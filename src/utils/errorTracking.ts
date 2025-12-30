/**
 * Sentry Error Tracking Integration
 * Monitoreo de errores, excepciones y performance
 */

interface ErrorContext {
  userId?: string;
  userEmail?: string;
  version?: string;
  environment?: string;
  [key: string]: any;
}

let sentryInitialized = false;

/**
 * Inicializar Sentry
 * Necesita Sentry DSN (Data Source Name)
 */
export function initSentry(dsn: string, options?: any) {
  if (!dsn) {
    console.warn("⚠️ Sentry DSN not configured");
    return;
  }

  // Importar dinámicamente Sentry SDK (si está instalado)
  // Para este proyecto, implementamos un wrapper que puede usar Sentry o similar

  // Configuración local de error tracking
  setupGlobalErrorHandlers();
  setupUnhandledRejectionHandler();
  setupConsoleLogging();

  // Guardar contexto de Sentry
  if (typeof window !== "undefined") {
    (window as any).__SENTRY_CONTEXT__ = {
      dsn,
      ...options,
    };
  }

  sentryInitialized = true;
  console.log("✅ Error tracking initialized");
}

/**
 * Reportar error a Sentry
 */
export function captureException(error: Error, context?: ErrorContext) {
  if (!sentryInitialized) {
    console.error("Sentry not initialized. Error:", error.message);
    return;
  }

  const errorData = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
    context: context || {},
    url: typeof window !== "undefined" ? window.location.href : "unknown",
    userAgent:
      typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
  };

  console.error("📊 Error captured:", errorData);

  // Aquí iría el envío a Sentry en producción
  if (typeof window !== "undefined" && (window as any).__SENTRY_CONTEXT__) {
    // SDK de Sentry se encargaría automáticamente
  }
}

/**
 * Reportar mensaje/evento
 */
export function captureMessage(
  message: string,
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  context?: ErrorContext
) {
  if (!sentryInitialized) {
    console.log("Sentry not initialized. Message:", message);
    return;
  }

  const messageData = {
    message,
    level,
    timestamp: new Date().toISOString(),
    context: context || {},
    url: typeof window !== "undefined" ? window.location.href : "unknown",
  };

  console.log("📊 Message captured:", messageData);
}

/**
 * Setear contexto de usuario
 */
export function setUserContext(
  userId: string,
  userEmail?: string,
  extra?: any
) {
  if (!sentryInitialized) return;

  const userContext = {
    id: userId,
    email: userEmail,
    ...extra,
  };

  console.log("👤 User context set:", userContext);
}

/**
 * Setear contexto general
 */
export function setContext(name: string, context: ErrorContext) {
  if (!sentryInitialized) return;

  console.log(`📝 Context '${name}' set:`, context);
}

/**
 * Agregar breadcrumb (pista de navegación)
 */
export function addBreadcrumb(
  message: string,
  category: string = "app",
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  data?: any
) {
  if (!sentryInitialized) return;

  const breadcrumb = {
    message,
    category,
    level,
    timestamp: new Date().toISOString(),
    data: data || {},
  };

  console.log("🔷 Breadcrumb added:", breadcrumb);
}

/**
 * Monitorear operación async
 */
export async function withErrorTracking<T>(
  fn: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    addBreadcrumb(`Starting ${operationName}`, "operation", "info");
    const result = await fn();
    addBreadcrumb(`Completed ${operationName}`, "operation", "info");
    return result;
  } catch (error) {
    captureException(error as Error, {
      operation: operationName,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Monitorear función sincrónica
 */
export function withErrorTrackingSync<T>(
  fn: () => T,
  operationName: string
): T {
  try {
    addBreadcrumb(`Starting ${operationName}`, "operation", "info");
    const result = fn();
    addBreadcrumb(`Completed ${operationName}`, "operation", "info");
    return result;
  } catch (error) {
    captureException(error as Error, {
      operation: operationName,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Configurar global error handler
 */
function setupGlobalErrorHandlers() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    captureException(new Error(event.message), {
      type: "uncaught_error",
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    });
  });

  // Capturar errores de consola
  const originalError = console.error;
  console.error = function (...args: any[]) {
    if (args[0] instanceof Error) {
      captureException(args[0], {
        type: "console_error",
        args: args.slice(1),
      });
    }
    originalError.apply(console, args);
  };
}

/**
 * Configurar unhandled rejection handler
 */
function setupUnhandledRejectionHandler() {
  if (typeof window === "undefined") return;

  window.addEventListener("unhandledrejection", (event) => {
    const error =
      event.reason instanceof Error
        ? event.reason
        : new Error(String(event.reason));

    captureException(error, {
      type: "unhandled_rejection",
      reason: event.reason,
    });
  });
}

/**
 * Configurar logging en desarrollo
 */
function setupConsoleLogging() {
  const isDev =
    typeof window !== "undefined" &&
    (window as any).__VITE_ENV__ === "development";

  if (isDev) {
    const originalWarn = console.warn;
    console.warn = function (...args: any[]) {
      addBreadcrumb(
        args.map((a) => String(a)).join(" "),
        "console.warn",
        "warning"
      );
      originalWarn.apply(console, args);
    };

    const originalLog = console.log;
    console.log = function (...args: any[]) {
      if (
        (args[0] && String(args[0]).includes("ERROR")) ||
        String(args[0]).includes("error")
      ) {
        addBreadcrumb(
          args.map((a) => String(a)).join(" "),
          "console.log",
          "error"
        );
      }
      originalLog.apply(console, args);
    };
  }
}

/**
 * Eventos específicos de fitness
 */
export const fitnessErrorTracking = {
  // Error al cargar entrenamiento
  workoutLoadError: (workoutId: string, error: Error) =>
    captureException(error, {
      type: "workout_load_error",
      workout_id: workoutId,
    }),

  // Error al guardar estadísticas
  statsSyncError: (error: Error, action: string) =>
    captureException(error, {
      type: "stats_sync_error",
      action: action,
    }),

  // Error al conectar con IA
  aiChatError: (error: Error, messageCount: number) =>
    captureException(error, {
      type: "ai_chat_error",
      message_count: messageCount,
    }),

  // Error al sincronizar datos
  dataSyncError: (error: Error, endpoint: string) =>
    captureException(error, {
      type: "data_sync_error",
      endpoint: endpoint,
    }),
};

/**
 * Performance monitoring
 */
export function monitorPerformance() {
  if (typeof window === "undefined") return;

  // Monitorear Web Vitals cuando estén disponibles
  if ("PerformanceObserver" in window) {
    try {
      // Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcpValue =
          (lastEntry as any).renderTime || (lastEntry as any).loadTime;

        if (lcpValue > 2500) {
          captureMessage(`Slow LCP: ${lcpValue}ms`, "warning", {
            metric: "LCP",
            value: lcpValue,
          });
        }
      });
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      console.log("LCP monitoring not available");
    }

    try {
      // First Input Delay
      const fIdObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.processingDuration > 100) {
            captureMessage(
              `Slow FID: ${entry.processingDuration}ms`,
              "warning",
              { metric: "FID", value: entry.processingDuration }
            );
          }
        });
      });
      fIdObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.log("FID monitoring not available");
    }
  }
}

/**
 * Clear user context (logout)
 */
export function clearUserContext() {
  if (!sentryInitialized) return;
  console.log("👤 User context cleared");
}

/**
 * Export context para debugging
 */
export function getErrorContext() {
  return {
    initialized: sentryInitialized,
    url: typeof window !== "undefined" ? window.location.href : "unknown",
    timestamp: new Date().toISOString(),
  };
}
