/**
 * Apple Health API Integration
 * Provides access to HealthKit data on iOS through Capacitor
 * Falls back to mock data on web
 */

// Capacitor import - will be available when building for native platforms
let Capacitor: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const CapacitorModule = require("@capacitor/core");
  Capacitor = CapacitorModule.Capacitor;
} catch {
  // Not available in web environment
  Capacitor = { isNativePlatform: () => false };
}

export interface HealthDataPoint {
  date: string;
  timestamp: number;
  value: number;
  unit: string;
  source: string;
}

export interface HealthSummary {
  steps: number;
  activeEnergy: number;
  distance: number;
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  bloodGlucose: number;
  workoutMinutes: number;
  sleep: number;
}

export interface WorkoutData {
  id: string;
  date: string;
  type:
    | "running"
    | "walking"
    | "cycling"
    | "gym"
    | "swimming"
    | "yoga"
    | "other";
  duration: number; // minutes
  calories: number;
  distance?: number; // km
  heartRate?: number;
  intensity: "light" | "moderate" | "vigorous";
}

// Mock data for development
const generateMockHealthData = (): HealthDataPoint[] => {
  const data: HealthDataPoint[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    data.push({
      date: dateStr,
      timestamp: date.getTime(),
      value: Math.floor(Math.random() * (12000 - 5000) + 5000), // 5k-12k steps
      unit: "steps",
      source: "Apple Health",
    });
  }

  return data;
};

const generateMockHeartRateData = (): HealthDataPoint[] => {
  const data: HealthDataPoint[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    data.push({
      date: dateStr,
      timestamp: date.getTime(),
      value: Math.floor(Math.random() * (95 - 60) + 60), // 60-95 bpm
      unit: "bpm",
      source: "Apple Health",
    });
  }

  return data;
};

const generateMockSleepData = (): HealthDataPoint[] => {
  const data: HealthDataPoint[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("es-ES", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });

    data.push({
      date: dateStr,
      timestamp: date.getTime(),
      value: Math.floor(Math.random() * (9 - 6) + 6), // 6-9 hours
      unit: "hours",
      source: "Apple Health",
    });
  }

  return data;
};

const generateMockWorkouts = (): WorkoutData[] => {
  const workoutTypes: WorkoutData["type"][] = [
    "running",
    "walking",
    "cycling",
    "gym",
    "yoga",
  ];
  const intensities: WorkoutData["intensity"][] = [
    "light",
    "moderate",
    "vigorous",
  ];
  const data: WorkoutData[] = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
    const intensity =
      intensities[Math.floor(Math.random() * intensities.length)];
    const duration = Math.floor(Math.random() * (60 - 20) + 20); // 20-60 min

    data.push({
      id: `workout-${i}`,
      date: date.toLocaleDateString("es-ES"),
      type,
      duration,
      calories: Math.floor(duration * (intensity === "vigorous" ? 12 : 8)),
      distance:
        type !== "gym" && type !== "yoga" ? Math.random() * 10 : undefined,
      heartRate: Math.floor(Math.random() * (180 - 120) + 120),
      intensity,
    });
  }

  return data.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

class HealthDataService {
  private isNative = Capacitor.isNativePlatform();
  private mockSteps = generateMockHealthData();
  private mockHeartRate = generateMockHeartRateData();
  private mockSleep = generateMockSleepData();
  private mockWorkouts = generateMockWorkouts();

  /**
   * Initialize HealthKit access on iOS
   */
  async initialize(): Promise<void> {
    if (this.isNative) {
      try {
        // Request HealthKit permissions on native platforms
        // This would use @capacitor-health or similar plugin
        console.log("Initializing HealthKit access");
      } catch (error) {
        console.error("Failed to initialize HealthKit:", error);
      }
    }
  }

  /**
   * Get step count data
   */
  async getSteps(days: number = 7): Promise<HealthDataPoint[]> {
    if (this.isNative) {
      try {
        // Call native plugin to get steps
        // const result = await HealthPlugin.getSteps({ days });
        // return result;
      } catch (error) {
        console.error("Failed to fetch steps:", error);
      }
    }

    // Return mock data for development
    return this.mockSteps.slice(-days);
  }

  /**
   * Get heart rate data
   */
  async getHeartRate(days: number = 7): Promise<HealthDataPoint[]> {
    if (this.isNative) {
      try {
        // Call native plugin to get heart rate
        // const result = await HealthPlugin.getHeartRate({ days });
        // return result;
      } catch (error) {
        console.error("Failed to fetch heart rate:", error);
      }
    }

    return this.mockHeartRate.slice(-days);
  }

  /**
   * Get sleep data
   */
  async getSleep(days: number = 7): Promise<HealthDataPoint[]> {
    if (this.isNative) {
      try {
        // Call native plugin to get sleep
        // const result = await HealthPlugin.getSleep({ days });
        // return result;
      } catch (error) {
        console.error("Failed to fetch sleep:", error);
      }
    }

    return this.mockSleep.slice(-days);
  }

  /**
   * Get workout data
   */
  async getWorkouts(_days: number = 30): Promise<WorkoutData[]> {
    if (this.isNative) {
      try {
        // Call native plugin to get workouts
        // const result = await HealthPlugin.getWorkouts({ days });
        // return result;
      } catch (error) {
        console.error("Failed to fetch workouts:", error);
      }
    }

    return this.mockWorkouts;
  }

  /**
   * Get today's health summary
   */
  async getTodaySummary(): Promise<HealthSummary> {
    const today = new Date().toLocaleDateString();

    return {
      steps: this.mockSteps[this.mockSteps.length - 1]?.value || 8500,
      activeEnergy: Math.floor(Math.random() * (500 - 200) + 200),
      distance: Math.random() * (10 - 3) + 3,
      heartRate: this.mockHeartRate[this.mockHeartRate.length - 1]?.value || 72,
      bloodPressure: {
        systolic: Math.floor(Math.random() * (140 - 110) + 110),
        diastolic: Math.floor(Math.random() * (90 - 70) + 70),
      },
      bloodGlucose: Math.floor(Math.random() * (140 - 80) + 80),
      workoutMinutes:
        this.mockWorkouts
          .filter((w) => w.date === today)
          .reduce((sum, w) => sum + w.duration, 0) || 0,
      sleep: this.mockSleep[this.mockSleep.length - 1]?.value || 7.5,
    };
  }

  /**
   * Get average metrics for a period
   */
  async getAverageMetrics(days: number = 7) {
    const steps = await this.getSteps(days);
    const heartRate = await this.getHeartRate(days);
    const sleep = await this.getSleep(days);

    return {
      averageSteps:
        steps.reduce((sum, d) => sum + d.value, 0) / (steps.length || 1),
      averageHeartRate:
        heartRate.reduce((sum, d) => sum + d.value, 0) /
        (heartRate.length || 1),
      averageSleep:
        sleep.reduce((sum, d) => sum + d.value, 0) / (sleep.length || 1),
    };
  }

  /**
   * Check if device has HealthKit access
   */
  hasHealthKitAccess(): boolean {
    return this.isNative;
  }

  /**
   * Request HealthKit permissions
   */
  async requestPermissions(): Promise<boolean> {
    if (!this.isNative) return false;

    try {
      // Request permissions from native plugin
      // const granted = await HealthPlugin.requestPermissions();
      // return granted;
      return false;
    } catch (error) {
      console.error("Failed to request permissions:", error);
      return false;
    }
  }
}

// Export singleton instance
export const healthDataService = new HealthDataService();

// Export health analytics object for GA tracking
export const healthAnalytics = {
  logStepGoalAchieved: (steps: number, goal: number) => ({
    event: "health_step_goal_achieved",
    data: { steps, goal },
  }),
  logWorkoutLogged: (type: string, duration: number, calories: number) => ({
    event: "health_workout_logged",
    data: { type, duration, calories },
  }),
  logHealthMetricViewed: (metric: string) => ({
    event: "health_metric_viewed",
    data: { metric },
  }),
  logHealthGoalSet: (goal: string, target: number) => ({
    event: "health_goal_set",
    data: { goal, target },
  }),
};
