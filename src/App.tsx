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
import { offlineSyncService } from "./utils/offlineSync";
import HomeView from "./views/Home";
import WorkoutView from "./views/Workout";
import WorkoutDetailView from "./views/WorkoutDetail";
import NutritionView from "./views/Nutrition";
import HydrationView from "./views/Hydration";
import FastingView from "./views/Fasting";
import ProfileView from "./views/Profile";
import HealthView from "./views/Health";
import ChallengesView from "./views/Challenges";
import ChatView from "./views/Chat";
import OnboardingView from "./views/Onboarding";
import SettingsView from "./views/Settings";
import LoginView from "./views/Login";
import RegisterView from "./views/Register";
import ForgotPasswordView from "./views/ForgotPassword";
import BottomNav from "./components/BottomNav";
import { OfflineStatusBadge } from "./components/OfflineStatus";

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
    calories: 0,
    activityMin: 0,
    mindMin: 0,
    hydrationCurrent: 0,
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

    // 1b. Initialize Offline Sync
    offlineSyncService
      .initialize()
      .catch((err) => console.log("Offline sync init warning:", err));

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
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .eq("date", today)
        .maybeSingle();

      if (data) {
        const remoteStats: UserStats = {
          calories: data.calories,
          activityMin: data.activity_minutes,
          mindMin: data.mind_minutes,
          hydrationCurrent: data.hydration_liters || 0,
          hydrationGoal: 2.5,
        };
        setStats(remoteStats);
        localStorage.setItem(
          "vitality_user_stats",
          JSON.stringify(remoteStats)
        );
      } else {
        const newStats = { ...defaultStats };
        newStats.hydrationGoal = 2.5;
        setStats(newStats);
        syncToSupabase(newStats, userId);
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
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newData = payload.new;
          if (newData) {
            const newStats: UserStats = {
              calories: newData.calories,
              activityMin: newData.activity_minutes,
              mindMin: newData.mind_minutes,
              hydrationCurrent: newData.hydration_liters,
              hydrationGoal: 2.5,
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

    const today = new Date().toISOString().split("T")[0];
    const upsertData = {
      user_id: userId,
      date: today,
      calories: currentStats.calories,
      activity_minutes: currentStats.activityMin,
      mind_minutes: currentStats.mindMin,
      hydration_liters: currentStats.hydrationCurrent,
      updated_at: new Date(),
    };

    await supabase.from("user_stats").upsert(upsertData);
  };

  // Sync Stats to DB
  useEffect(() => {
    if (isAuthenticated && user && !isOffline) {
      localStorage.setItem("vitality_user_stats", JSON.stringify(stats));
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
    setCurrentScreen(ScreenName.HOME);
  };

  const handleLogout = () => {
    localStorage.removeItem("vitality_user_stats");
    setCurrentScreen(ScreenName.LOGIN);
  };

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
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

  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenName.HOME:
        return <HomeView stats={stats} navigate={navigate} />;
      case ScreenName.WORKOUT:
        return <WorkoutView navigate={navigate} />;
      case ScreenName.WORKOUT_DETAIL:
        return <WorkoutDetailView navigate={navigate} />;
      case ScreenName.NUTRITION:
        return <NutritionView navigate={navigate} user={user} />;
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
            user={user}
          />
        );
      case ScreenName.HEALTH:
        return (
          <HealthView
            navigate={navigate}
            toggleDarkMode={() => setDarkMode(!darkMode)}
          />
        );
      case ScreenName.CHALLENGES:
        return (
          <ChallengesView
            navigate={navigate}
            toggleDarkMode={() => setDarkMode(!darkMode)}
            userId={user?.id}
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
    return <LoginView onLogin={handleLogin} navigate={navigate} />;
  }

  const hideBottomNav = [
    ScreenName.WORKOUT_DETAIL,
    ScreenName.CHAT,
    ScreenName.SETTINGS,
    ScreenName.HEALTH,
    ScreenName.CHALLENGES,
  ].includes(currentScreen as any);

  return (
    <div className="relative min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex justify-center items-start md:items-center p-0 md:p-8 overflow-x-hidden">
      <div className="hidden md:block absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full h-full min-h-screen md:min-h-0 md:h-[844px] md:w-[393px] md:rounded-[3.5rem] md:shadow-[0_0_0_12px_#020617] md:border-[8px] md:border-slate-900 bg-white dark:bg-slate-950 overflow-hidden flex flex-col transition-all duration-500 shadow-2xl">
        <OfflineStatusBadge variant="banner" />
        <main
          className={`flex-1 flex flex-col bg-white dark:bg-slate-950 transition-all ${!hideBottomNav ? "pb-20 md:pb-6" : ""
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
