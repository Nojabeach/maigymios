import { useState, useEffect } from "react";
import { ScreenName, type UserStats } from "./types";
import { supabase } from "./supabaseClient";
import { initServiceWorker } from "./utils/notifications";
import {
  initGoogleAnalytics,
  trackScreenView,
  engagementAnalytics,
} from "./utils/analytics";
import { initSentry, monitorPerformance } from "./utils/errorTracking";
import HomeView from "./views/Home";
import WorkoutView from "./views/Workout";
import WorkoutDetailView from "./views/WorkoutDetail";
import NutritionView from "./views/Nutrition";
import HydrationView from "./views/Hydration";
import FastingView from "./views/Fasting";
import ProfileView from "./views/Profile";
import ChatView from "./views/Chat";
import OnboardingView from "./views/Onboarding";
import SettingsView from "./views/Settings";
import LoginView from "./views/Login";
import RegisterView from "./views/Register";
import ForgotPasswordView from "./views/ForgotPassword";
import BottomNav from "./components/BottomNav";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(
    ScreenName.LOGIN
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Default stats
  const defaultStats: UserStats = {
    calories: 1200,
    activityMin: 35,
    mindMin: 10,
    hydrationCurrent: 1.5,
    hydrationGoal: 2.5,
  };

  const [stats, setStats] = useState<UserStats>(defaultStats);

  // Initialize: Check Auth and Load Data
  useEffect(() => {
    // 0a. Initialize Error Tracking
    const sentryDsn = import.meta.env.VITE_SENTRY_DSN || "";
    if (sentryDsn) {
      initSentry(sentryDsn, {
        environment: import.meta.env.VITE_ENV || "production",
        tracesSampleRate: 0.1,
      });
      monitorPerformance();
    }

    // 0b. Initialize Analytics
    const gaId = import.meta.env.VITE_GA_ID || "";
    if (gaId) {
      initGoogleAnalytics(gaId);
      engagementAnalytics.appLaunch("web");
    }

    // 1. Initialize Service Worker for notifications
    initServiceWorker().catch((err) => console.log("SW init warning:", err));

    // 1. LocalStorage Fast Load (Immediate UI feedback)
    const savedStats = localStorage.getItem("vitality_user_stats");
    if (savedStats) {
      try {
        setStats(JSON.parse(savedStats));
      } catch (e) {
        console.error("Failed to parse stats", e);
      }
    }

    // 2. Supabase Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        setCurrentScreen(ScreenName.HOME);
        fetchStatsFromSupabase(session.user.id);
        subscribeToRealtime(session.user.id);
      } else {
        const hasOnboarded = localStorage.getItem("vitality_has_onboarded");
        setCurrentScreen(
          hasOnboarded ? ScreenName.LOGIN : ScreenName.ONBOARDING
        );
      }
    });

    // 3. Listen for Auth Changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsAuthenticated(true);
        setUser(session.user);
        fetchStatsFromSupabase(session.user.id);
        subscribeToRealtime(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch from DB
  const fetchStatsFromSupabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("id", userId)
        .single();

      if (data) {
        const remoteStats: UserStats = {
          calories: data.calories,
          activityMin: data.activity_min,
          mindMin: data.mind_min,
          hydrationCurrent: data.hydration_current,
          hydrationGoal: data.hydration_goal,
        };
        // Only update if different to avoid jitters, or just trust remote
        setStats(remoteStats);
        localStorage.setItem(
          "vitality_user_stats",
          JSON.stringify(remoteStats)
        );
      } else if (error && error.code === "PGRST116") {
        // No row found, insert default
        console.log("Creating new stats row for user");
        syncToSupabase(defaultStats, userId);
      }
    } catch (error) {
      console.log("Error fetching stats:", error);
    }
  };

  // Realtime Subscription
  const subscribeToRealtime = (userId: string) => {
    const channel = supabase
      .channel("public:user_stats")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_stats",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime update received:", payload);
          const newData = payload.new;
          if (newData) {
            const newStats: UserStats = {
              calories: newData.calories,
              activityMin: newData.activity_min,
              mindMin: newData.mind_min,
              hydrationCurrent: newData.hydration_current,
              hydrationGoal: newData.hydration_goal,
            };
            setStats(newStats);
            localStorage.setItem(
              "vitality_user_stats",
              JSON.stringify(newStats)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Helper to sync
  const syncToSupabase = async (currentStats: UserStats, userId: string) => {
    if (isOffline) return;

    const upsertData = {
      id: userId,
      calories: currentStats.calories,
      activity_min: currentStats.activityMin,
      mind_min: currentStats.mindMin,
      hydration_current: currentStats.hydrationCurrent,
      hydration_goal: currentStats.hydrationGoal,
      updated_at: new Date(),
    };

    await supabase.from("user_stats").upsert(upsertData);
  };

  // Sync Stats to DB (Debounced via useEffect isn't ideal for rapid clicks,
  // but acceptable for prototype. For production, use optimistic UI + debounced save)
  useEffect(() => {
    if (isAuthenticated && user && !isOffline) {
      // We save to local storage immediately
      localStorage.setItem("vitality_user_stats", JSON.stringify(stats));

      // We debounce the server save slightly to avoid flooding DB on rapid clicks
      const timer = setTimeout(() => {
        syncToSupabase(stats, user.id);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [stats, isAuthenticated, user, isOffline]);

  // Network Listeners
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogin = () => {
    // Auth Listener handles state update
    setCurrentScreen(ScreenName.HOME);
  };

  const handleLogout = () => {
    localStorage.removeItem("vitality_user_stats");
    setCurrentScreen(ScreenName.LOGIN);
  };

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
    // Track screen view for analytics
    trackScreenView(screen);
  };

  const updateHydration = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      hydrationCurrent: Math.min(
        prev.hydrationGoal,
        parseFloat((prev.hydrationCurrent + amount).toFixed(2))
      ),
    }));
  };

  // Auth Screens
  if (!isAuthenticated) {
    if (currentScreen === ScreenName.ONBOARDING) {
      return (
        <OnboardingView
          onComplete={() => {
            localStorage.setItem("vitality_has_onboarded", "true");
            navigate(ScreenName.REGISTER);
          }}
        />
      );
    }
    if (currentScreen === ScreenName.REGISTER) {
      return <RegisterView onLogin={handleLogin} navigate={navigate} />;
    }
    if (currentScreen === ScreenName.FORGOT_PASSWORD) {
      return <ForgotPasswordView navigate={navigate} />;
    }
    // Default to Login
    return <LoginView onLogin={handleLogin} navigate={navigate} />;
  }

  // App Screens
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.HOME:
        return <HomeView stats={stats} navigate={navigate} />;
      case ScreenName.WORKOUT:
        return <WorkoutView navigate={navigate} />;
      case ScreenName.WORKOUT_DETAIL:
        return <WorkoutDetailView navigate={navigate} />;
      case ScreenName.NUTRITION:
        return <NutritionView navigate={navigate} />;
      case ScreenName.HYDRATION:
        return (
          <HydrationView
            stats={stats}
            updateHydration={updateHydration}
            navigate={navigate}
          />
        );
      case ScreenName.FASTING:
        return <FastingView navigate={navigate} />;
      case ScreenName.PROFILE:
        return (
          <ProfileView
            navigate={navigate}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            onLogout={handleLogout}
          />
        );
      case ScreenName.SETTINGS:
        return <SettingsView navigate={navigate} />;
      case ScreenName.CHAT:
        return <ChatView navigate={navigate} />;
      default:
        return <HomeView stats={stats} navigate={navigate} />;
    }
  };

  const hideBottomNav = [
    ScreenName.WORKOUT_DETAIL,
    ScreenName.CHAT,
    ScreenName.SETTINGS,
  ].includes(currentScreen as any);

  return (
    <div className="relative flex h-full min-h-screen w-full flex-col bg-white dark:bg-background-dark overflow-x-hidden">
      {/* Container responsivo para iPhone y iPad */}
      <div className="flex flex-col h-full w-full md:max-w-4xl md:mx-auto md:bg-surface-light dark:md:bg-surface-dark md:shadow-xl md:rounded-2xl overflow-hidden">
        {/* Offline Banner */}
        {isOffline && (
          <div className="bg-red-500 text-white text-xs py-2 px-4 text-center font-semibold sticky top-0 z-[60] animate-pulse">
            📡 Sin conexión. Guardando localmente.
          </div>
        )}

        <main
          className={`flex-1 flex flex-col bg-white dark:bg-background-dark transition-smooth ${
            !hideBottomNav ? "pb-20 md:pb-6" : ""
          }`}
        >
          {renderScreen()}
        </main>

        {!hideBottomNav && (
          <BottomNav currentScreen={currentScreen} navigate={navigate} />
        )}
      </div>
    </div>
  );
}
