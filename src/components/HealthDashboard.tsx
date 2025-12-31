/**
 * Health Data Display Components
 * Components for visualizing HealthKit data
 */

import React, { useState, useEffect } from "react";
import type {
  HealthDataPoint,
  HealthSummary,
  WorkoutData,
} from "../utils/healthData";
import { healthDataService } from "../utils/healthData";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface HealthCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit: string;
  trend?: "up" | "down" | "stable";
  goal?: number;
  current?: number;
  color?: string;
}

export const HealthCard: React.FC<HealthCardProps> = ({
  icon,
  label,
  value,
  unit,
  trend,
  goal,
  current,
  color = "#22c55e",
}) => {
  const percentage = goal && current ? (current / goal) * 100 : 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div style={{ color }} className="text-2xl">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {label}
          </span>
        </div>
        {trend && (
          <span
            className={`text-xs font-bold px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : trend === "down"
                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>

      <div className="mb-3">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {typeof value === "number" ? value.toFixed(1) : value}{" "}
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {unit}
          </span>
        </p>
      </div>

      {goal && current !== undefined && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      )}
    </div>
  );
};

interface StepsChartProps {
  data: HealthDataPoint[];
  goal?: number;
}

export const StepsChart: React.FC<StepsChartProps> = ({
  data,
  goal = 10000,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Pasos Diarios
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Meta: {goal.toLocaleString()} pasos
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f3f4f6" }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            fill="url(#stepsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface HeartRateChartProps {
  data: HealthDataPoint[];
}

export const HeartRateChart: React.FC<HeartRateChartProps> = ({ data }) => {
  const avgHeartRate =
    data.reduce((sum, d) => sum + d.value, 0) / (data.length || 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Frecuencia Cardíaca
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Promedio: {avgHeartRate.toFixed(0)} bpm
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f3f4f6" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#ec4899"
            strokeWidth={2}
            dot={{ fill: "#ec4899", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface SleepChartProps {
  data: HealthDataPoint[];
  goal?: number;
}

export const SleepChart: React.FC<SleepChartProps> = ({ data, goal = 8 }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Duración del Sueño
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Meta: {goal} horas
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            labelStyle={{ color: "#f3f4f6" }}
          />
          <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface WorkoutListProps {
  workouts: WorkoutData[];
}

export const WorkoutList: React.FC<WorkoutListProps> = ({ workouts }) => {
  const getWorkoutIcon = (type: string) => {
    const icons: Record<string, string> = {
      running: "🏃",
      walking: "🚶",
      cycling: "🚴",
      gym: "💪",
      swimming: "🏊",
      yoga: "🧘",
      other: "⚽",
    };
    return icons[type] || "⚽";
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "light":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "moderate":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "vigorous":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Entrenamientos Recientes
      </h3>

      <div className="space-y-3">
        {workouts.slice(0, 5).map((workout) => (
          <div
            key={workout.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{getWorkoutIcon(workout.type)}</span>
              <div>
                <p className="font-medium text-gray-900 dark:text-white capitalize">
                  {workout.type}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {workout.date}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="font-bold text-gray-900 dark:text-white">
                {workout.duration} min
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {workout.calories} cal
              </p>
            </div>

            <span
              className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${getIntensityColor(
                workout.intensity
              )}`}
            >
              {workout.intensity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface HealthDashboardProps {}

export const HealthDashboard: React.FC<HealthDashboardProps> = () => {
  const [summary, setSummary] = useState<HealthSummary | null>(null);
  const [steps, setSteps] = useState<HealthDataPoint[]>([]);
  const [heartRate, setHeartRate] = useState<HealthDataPoint[]>([]);
  const [sleep, setSleep] = useState<HealthDataPoint[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        await healthDataService.initialize();
        const [summaryData, stepsData, hrData, sleepData, workoutData] =
          await Promise.all([
            healthDataService.getTodaySummary(),
            healthDataService.getSteps(7),
            healthDataService.getHeartRate(7),
            healthDataService.getSleep(7),
            healthDataService.getWorkouts(30),
          ]);

        setSummary(summaryData);
        setSteps(stepsData);
        setHeartRate(hrData);
        setSleep(sleepData);
        setWorkouts(workoutData);
      } catch (error) {
        console.error("Failed to load health data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHealthData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Cargando datos de salud...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <HealthCard
            icon="👣"
            label="Pasos"
            value={summary.steps.toLocaleString()}
            unit="hoy"
            goal={10000}
            current={summary.steps}
            color="#22c55e"
          />
          <HealthCard
            icon="❤️"
            label="Corazón"
            value={summary.heartRate}
            unit="bpm"
            color="#ec4899"
          />
          <HealthCard
            icon="😴"
            label="Sueño"
            value={summary.sleep.toFixed(1)}
            unit="hrs"
            goal={8}
            current={summary.sleep}
            color="#a855f7"
          />
          <HealthCard
            icon="🔥"
            label="Energía"
            value={summary.activeEnergy.toFixed(0)}
            unit="kcal"
            color="#f97316"
          />
          <HealthCard
            icon="📏"
            label="Distancia"
            value={summary.distance.toFixed(1)}
            unit="km"
            color="#06b6d4"
          />
          <HealthCard
            icon="🏃"
            label="Entreno"
            value={summary.workoutMinutes}
            unit="min"
            color="#8b5cf6"
          />
        </div>
      )}

      {/* Charts */}
      <StepsChart data={steps} goal={10000} />
      <HeartRateChart data={heartRate} />
      <SleepChart data={sleep} goal={8} />
      <WorkoutList workouts={workouts} />
    </div>
  );
};
