/**
 * Apple Health API Integration
 * Provides access to HealthKit data on iOS through Capacitor
 * Falls back to mock data on web
 */

// Capacitor import - will be available when building for native platforms
// Capacitor import - placeholder for PWA
const Capacitor = { isNativePlatform: () => false };

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

// Supabase import
import { supabase } from "../supabaseClient";

// Mock data for development

// Generators removed


class HealthDataService {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  private isNative = Capacitor.isNativePlatform();


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

    // Supabase implementation
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('metric_type', 'steps')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date', { ascending: true });

    // Map to HealthDataPoint
    return (data || []).map((d: any) => ({
      date: new Date(d.date).toLocaleDateString("es-ES", { weekday: "short", month: "short", day: "numeric" }),
      timestamp: new Date(d.date).getTime(),
      value: d.value,
      unit: d.unit,
      source: "Supabase"
    }));
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

    // Supabase implementation
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('metric_type', 'heart_rate')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date');

    return (data || []).map((d: any) => ({
      date: new Date(d.date).toLocaleDateString("es-ES", { weekday: "short", month: "short", day: "numeric" }),
      timestamp: new Date(d.date).getTime(),
      value: d.value,
      unit: d.unit,
      source: "Supabase"
    }));
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

    // Supabase implementation
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('health_data')
      .select('*')
      .eq('user_id', user.id)
      .eq('metric_type', 'sleep')
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('date');

    return (data || []).map((d: any) => ({
      date: new Date(d.date).toLocaleDateString("es-ES", { weekday: "short", month: "short", day: "numeric" }),
      timestamp: new Date(d.date).getTime(),
      value: d.value,
      unit: d.unit,
      source: "Supabase"
    }));
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30);

    return (data || []).map((d: any) => ({
      id: d.id,
      date: new Date(d.date).toLocaleDateString("es-ES"),
      type: d.exercise_name as any || "other",
      duration: d.duration_minutes,
      calories: d.calories_burned,
      intensity: d.intensity || "moderate"
    }));
  }

  /**
   * Get today's health summary
   */
  async getTodaySummary(): Promise<HealthSummary> {
    const stepsData = await this.getSteps(1);
    const heartRateData = await this.getHeartRate(1);
    const sleepData = await this.getSleep(1);
    const workoutsData = await this.getWorkouts(1);

    const latestSteps = stepsData.length > 0 ? stepsData[stepsData.length - 1].value : 0;
    const latestHeartRate = heartRateData.length > 0 ? heartRateData[heartRateData.length - 1].value : 70;
    const latestSleep = sleepData.length > 0 ? sleepData[sleepData.length - 1].value : 0;

    // Calculate workout minutes for today
    const workoutMinutes = workoutsData.reduce((sum, w) => sum + w.duration, 0);

    return {
      steps: latestSteps,
      activeEnergy: Math.floor(latestSteps * 0.04), // Estimación simple
      distance: parseFloat((latestSteps * 0.00076).toFixed(2)), // Estimación km
      heartRate: latestHeartRate,
      bloodPressure: {
        systolic: 0,
        diastolic: 0,
      },
      bloodGlucose: 0,
      workoutMinutes: workoutMinutes,
      sleep: latestSleep,
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
