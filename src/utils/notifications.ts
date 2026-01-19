/**
 * Push Notifications Service
 * Maneja push notifications, notificaciones locales y recordatorios
 */

interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  data?: Record<string, any>;
}

/**
 * Inicializar Service Worker
 */
export async function initServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      if (import.meta.env.DEV) console.log("✅ Service Worker registrado:", registration.scope);

      // Escuchar mensajes del Service Worker
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );

      return registration;
    } catch (error) {
      console.error("❌ Error registrando Service Worker:", error);
    }
  }
}

/**
 * Solicitar permiso para notificaciones
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("⚠️ Las notificaciones no están soportadas en este navegador");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

/**
 * Enviar notificación local
 */
export async function showLocalNotification(options: NotificationOptions) {
  try {
    const permission = await requestNotificationPermission();

    if (permission !== "granted") {
      console.warn("⚠️ Permiso denegado para notificaciones");
      return;
    }

    // Si hay Service Worker registrado, usar ese
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        payload: options,
      });
    } else {
      // Fallback a notificación nativa
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || "/icon.png",
        badge: options.badge,
        tag: options.tag,
        requireInteraction: options.requireInteraction,
        data: options.data,
      });
    }
  } catch (error) {
    console.error("Error mostrando notificación:", error);
  }
}

/**
 * Agendar notificación (recordatorio)
 */
export function scheduleNotification(
  options: NotificationOptions,
  delayMs: number
) {
  const timeoutId = setTimeout(() => {
    showLocalNotification(options);
  }, delayMs);

  // Retornar ID para cancelar si es necesario
  return timeoutId;
}

/**
 * Cancelar notificación agendada
 */
export function cancelScheduledNotification(timeoutId: ReturnType<typeof setTimeout>) {
  clearTimeout(timeoutId);
}

/**
 * Enviar múltiples notificaciones con intervalo
 */
export function scheduleRecurringNotifications(
  options: NotificationOptions,
  intervalMs: number,
  maxTimes?: number
) {
  let count = 0;
  const intervalId = setInterval(() => {
    if (maxTimes && count >= maxTimes) {
      clearInterval(intervalId);
      return;
    }
    showLocalNotification(options);
    count++;
  }, intervalMs);

  return intervalId;
}

/**
 * Cancelar notificaciones recurrentes
 */
export function cancelRecurringNotifications(
  intervalId: ReturnType<typeof setInterval>
) {
  clearInterval(intervalId as any);
}

/**
 * Notificaciones para fitness
 */
export const fitnessNotifications = {
  // Recordatorio de entrenamiento
  workoutReminder: (exerciseName: string) =>
    showLocalNotification({
      title: "💪 Hora de entrenar",
      body: `Comienza: ${exerciseName}`,
      icon: "/icon.png",
      tag: "workout-reminder",
      requireInteraction: true,
    }),

  // Recordatorio de agua
  hydrationReminder: (currentIntake: number, goal: number) =>
    showLocalNotification({
      title: "💧 Recuerda beber agua",
      body: `${currentIntake}L de ${goal}L`,
      icon: "/icon.png",
      tag: "hydration-reminder",
    }),

  // Recordatorio de comida
  mealReminder: (mealName: string) =>
    showLocalNotification({
      title: "🍎 Hora de la comida",
      body: `Registra tu ${mealName}`,
      icon: "/icon.png",
      tag: "meal-reminder",
      requireInteraction: true,
    }),

  // Logro desbloqueado
  achievementUnlocked: (achievementName: string) =>
    showLocalNotification({
      title: "🎉 ¡Logro desbloqueado!",
      body: achievementName,
      icon: "/icon.png",
      tag: "achievement",
      requireInteraction: true,
    }),

  // Alerta de meta
  goalAlert: (goalName: string, progress: string) =>
    showLocalNotification({
      title: "🎯 Progreso en meta",
      body: `${goalName}: ${progress}`,
      icon: "/icon.png",
      tag: "goal-alert",
    }),
};

/**
 * Manejar mensajes del Service Worker
 */
function handleServiceWorkerMessage(event: MessageEvent) {
  const { type, payload } = event.data;

  switch (type) {
    case "NOTIFICATION_CLICKED":
      handleNotificationClick(payload);
      break;
    case "NOTIFICATION_CLOSED":
      handleNotificationClosed(payload);
      break;
    default:
      if (import.meta.env.DEV) console.log("Mensaje desconocido del Service Worker:", type);
  }
}

/**
 * Manejar click en notificación
 */
function handleNotificationClick(data: Record<string, any>) {
  // Navegar a la sección correspondiente
  if (data.action === "open-chat") {
    window.location.hash = "#/chat";
  } else if (data.action === "open-workout") {
    window.location.hash = "#/workout";
  }
  if (import.meta.env.DEV) console.log("Notificación clickeada:", data);
}

/**
 * Manejar cierre de notificación
 */
function handleNotificationClosed(data: Record<string, any>) {
  if (import.meta.env.DEV) console.log("Notificación cerrada:", data);
}

/**
 * Obtener estado de notificaciones
 */
export function getNotificationStatus() {
  return {
    supported: "Notification" in window && "serviceWorker" in navigator,
    permission: "Notification" in window ? Notification.permission : "denied",
  };
}

/**
 * Limpiar todas las notificaciones
 */
export async function clearAllNotifications() {
  if ("serviceWorker" in navigator) {
    const registration = await navigator.serviceWorker.ready;
    const notifications = await registration.getNotifications();
    notifications.forEach((notification) => notification.close());
  }
}
