export const ScreenName = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  FORGOT_PASSWORD: "FORGOT_PASSWORD",
  ONBOARDING: "ONBOARDING",
  HOME: "HOME",
  WORKOUT: "WORKOUT",
  WORKOUT_DETAIL: "WORKOUT_DETAIL",
  NUTRITION: "NUTRITION",
  HYDRATION: "HYDRATION",
  FASTING: "FASTING",
  PROFILE: "PROFILE",
  HEALTH: "HEALTH",
  CHALLENGES: "CHALLENGES",
  CHAT: "CHAT",
  SETTINGS: "SETTINGS",
} as const;

export type ScreenName = (typeof ScreenName)[keyof typeof ScreenName];

export interface UserStats {
  calories: number;
  activityMin: number;
  mindMin: number;
  hydrationCurrent: number;
  hydrationGoal: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  completed: boolean;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  time: string;
}
