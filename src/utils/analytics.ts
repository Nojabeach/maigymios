/**
 * Google Analytics 4 Integration
 * Tracking de eventos, pantallas y métricas de la app
 */

/**
 * Inicializar Google Analytics
 * Necesita Google Analytics Measurement ID (G-XXXXXXXXXX)
 */
export function initGoogleAnalytics(measurementId: string) {
  if (!measurementId) {
    console.warn("⚠️ Google Analytics Measurement ID not configured");
    return;
  }

  // Load Google Analytics script
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(..._args: any[]) {
    (window as any).dataLayer.push(arguments);
  }
  (window as any).gtag = gtag;
  gtag("js", new Date());
  gtag("config", measurementId, {
    // Opciones de configuración
    anonymize_ip: true,
    allow_google_signals: false,
  });

  console.log("✅ Google Analytics 4 initialized");
}

/**
 * Rastrear vista de página
 */
export function trackPageView(pageName: string, pageTitle?: string) {
  if (typeof (window as any).gtag === "undefined") {
    console.warn("⚠️ Google Analytics not initialized");
    return;
  }

  (window as any).gtag("event", "page_view", {
    page_path: pageName,
    page_title: pageTitle || pageName,
  });

  console.log("📊 Page view tracked:", pageName);
}

/**
 * Rastrear eventos personalizados
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof (window as any).gtag === "undefined") {
    console.warn("⚠️ Google Analytics not initialized");
    return;
  }

  (window as any).gtag("event", eventName, eventData || {});
  console.log("📊 Event tracked:", eventName, eventData);
}

/**
 * Rastrear visión de pantalla (para Single Page Apps)
 */
export function trackScreenView(screenName: string) {
  trackEvent("screen_view", {
    screen_name: screenName,
  });
}

/**
 * Eventos de Fitness/Workout
 */
export const fitnessAnalytics = {
  // Usuario inicia entrenamiento
  startWorkout: (workoutName: string, duration: number) =>
    trackEvent("start_workout", {
      workout_name: workoutName,
      duration_minutes: duration,
    }),

  // Usuario completa entrenamiento
  completeWorkout: (
    workoutName: string,
    duration: number,
    caloriesBurned: number
  ) =>
    trackEvent("complete_workout", {
      workout_name: workoutName,
      duration_minutes: duration,
      calories_burned: caloriesBurned,
    }),

  // Usuario registra comida
  logMeal: (mealName: string, calories: number) =>
    trackEvent("log_meal", {
      meal_name: mealName,
      calories: calories,
    }),

  // Usuario registra agua
  logWater: (amount: number) =>
    trackEvent("log_water", {
      water_amount_liters: amount,
    }),

  // Usuario alcanza meta
  achievementUnlocked: (achievementName: string) =>
    trackEvent("achievement_unlocked", {
      achievement_name: achievementName,
    }),

  // Usuario inicia sesión de meditación
  startMeditation: (duration: number) =>
    trackEvent("start_meditation", {
      duration_minutes: duration,
    }),

  // Usuario completa meditación
  completeMeditation: (duration: number) =>
    trackEvent("complete_meditation", {
      duration_minutes: duration,
    }),
};

/**
 * Eventos de Autenticación
 */
export const authAnalytics = {
  // Usuario inicia sesión
  login: (method: string = "email") =>
    trackEvent("login", {
      method: method,
    }),

  // Usuario se registra
  signUp: (method: string = "email") =>
    trackEvent("sign_up", {
      method: method,
    }),

  // Usuario cierra sesión
  logout: () => trackEvent("logout", {}),

  // Usuario olvida contraseña
  forgotPassword: () => trackEvent("forgot_password", {}),

  // Usuario recupera contraseña
  passwordReset: () => trackEvent("password_reset", {}),
};

/**
 * Eventos de Engagement
 */
export const engagementAnalytics = {
  // Usuario abre la app
  appLaunch: (platform: string = "web") =>
    trackEvent("app_launch", {
      platform: platform,
    }),

  // Usuario interactúa con Chat IA
  chatInteraction: (messageCount: number) =>
    trackEvent("chat_interaction", {
      message_count: messageCount,
    }),

  // Usuario ve tutorial/onboarding
  viewTutorial: (step: number) =>
    trackEvent("view_tutorial", {
      step: step,
    }),

  // Usuario completa onboarding
  onboardingComplete: () => trackEvent("onboarding_complete", {}),

  // Usuario activa notificaciones
  enableNotifications: () => trackEvent("enable_notifications", {}),

  // Usuario abre un artículo/recurso
  viewResource: (resourceName: string, resourceType: string) =>
    trackEvent("view_resource", {
      resource_name: resourceName,
      resource_type: resourceType,
    }),

  // Usuario comparte algo
  share: (contentType: string) =>
    trackEvent("share", {
      content_type: contentType,
    }),
};

/**
 * Eventos de Error y Performance
 */
export const performanceAnalytics = {
  // Error en la app
  appError: (errorName: string, errorMessage?: string) =>
    trackEvent("app_error", {
      error_name: errorName,
      error_message: errorMessage,
    }),

  // Offline detectado
  goOffline: () => trackEvent("go_offline", {}),

  // Online detectado
  goOnline: () => trackEvent("go_online", {}),

  // Sincronización fallida
  syncFailed: (reason: string) =>
    trackEvent("sync_failed", {
      reason: reason,
    }),

  // Cargar imágenes/recursos lento
  slowResourceLoad: (resourceName: string, loadTime: number) =>
    trackEvent("slow_resource_load", {
      resource_name: resourceName,
      load_time_ms: loadTime,
    }),

  // Web Vitals
  webVitals: (vitalName: string, value: number) =>
    trackEvent("web_vital", {
      vital_name: vitalName,
      value: value,
    }),
};

/**
 * Rastrear tiempo en página
 */
export function trackTimeOnPage(pageName: string, timeSeconds: number) {
  trackEvent("time_on_page", {
    page_name: pageName,
    time_seconds: timeSeconds,
  });
}

/**
 * Rastrear clics en botones importantes
 */
export function trackButtonClick(buttonName: string, action?: string) {
  trackEvent("button_click", {
    button_name: buttonName,
    action: action,
  });
}

/**
 * Rastrear búsquedas
 */
export function trackSearch(searchQuery: string, resultsCount?: number) {
  trackEvent("search", {
    search_term: searchQuery,
    results_count: resultsCount,
  });
}

/**
 * Rastrear filtros aplicados
 */
export function trackFilter(filterName: string, filterValue: string) {
  trackEvent("apply_filter", {
    filter_name: filterName,
    filter_value: filterValue,
  });
}

/**
 * Rastrear compras/suscripciones (si aplica)
 */
export function trackPurchase(
  itemName: string,
  value: number,
  currency: string = "USD"
) {
  trackEvent("purchase", {
    value: value,
    currency: currency,
    items: [{ item_name: itemName }],
  });
}

/**
 * Obtener Session ID
 */
export function getSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtener User ID (si está disponible)
 */
export function setUserId(userId: string) {
  if (typeof (window as any).gtag === "undefined") {
    console.warn("⚠️ Google Analytics not initialized");
    return;
  }

  (window as any).gtag("config", {
    user_id: userId,
  });
}

/**
 * Obtener User Properties (custom attributes)
 */
export function setUserProperty(propertyName: string, propertyValue: any) {
  if (typeof (window as any).gtag === "undefined") {
    console.warn("⚠️ Google Analytics not initialized");
    return;
  }

  (window as any).gtag("set", {
    [`user_properties.${propertyName}`]: propertyValue,
  });
}

/**
 * Rastrear conversión/meta
 */
export function trackConversion(conversionName: string, value?: number) {
  trackEvent("conversion", {
    conversion_name: conversionName,
    value: value,
  });
}

/**
 * Debug mode para desarrollo
 */
export function enableAnalyticsDebug() {
  (window as any).gtag("config", {
    debug_mode: true,
  });
  console.log("✅ Analytics debug mode enabled");
}
