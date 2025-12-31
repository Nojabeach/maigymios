/**
 * Challenges & Competitions System
 * Social fitness challenges with leaderboards and rewards
 */

import { supabase } from "../supabaseClient";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "steps" | "calories" | "duration" | "distance" | "streak";
  goal: number;
  unit: string;
  duration: "daily" | "weekly" | "monthly";
  reward_points: number;
  difficulty: "easy" | "medium" | "hard";
  max_participants: number;
  start_date: string;
  end_date: string;
  created_at: string;
  image_url?: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  current_progress: number;
  completed: boolean;
  completed_at?: string;
  joined_at: string;
  rank?: number;
}

export interface ChallengeLeaderboard {
  user_id: string;
  username: string;
  avatar?: string;
  progress: number;
  rank: number;
  points: number;
  completed: boolean;
}

export interface Reward {
  id: string;
  user_id: string;
  challenge_id: string;
  points: number;
  badge?: string;
  description: string;
  earned_at: string;
}

class ChallengesService {
  /**
   * Get all active challenges
   */
  async getActiveChallenges(): Promise<Challenge[]> {
    try {
      const { data, error } = await supabase
        .from("challenges")
        .select("*")
        .gt("end_date", new Date().toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as Challenge[]) || [];
    } catch (error) {
      console.error("Failed to fetch active challenges:", error);
      return getMockChallenges();
    }
  }

  /**
   * Get user's active challenges
   */
  async getUserChallenges(userId: string): Promise<UserChallenge[]> {
    try {
      const { data, error } = await supabase
        .from("user_challenges")
        .select("*")
        .eq("user_id", userId)
        .eq("completed", false);

      if (error) throw error;
      return (data as UserChallenge[]) || [];
    } catch (error) {
      console.error("Failed to fetch user challenges:", error);
      return [];
    }
  }

  /**
   * Join a challenge
   */
  async joinChallenge(userId: string, challengeId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("user_challenges").insert({
        user_id: userId,
        challenge_id: challengeId,
        current_progress: 0,
        completed: false,
        joined_at: new Date().toISOString(),
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to join challenge:", error);
      return false;
    }
  }

  /**
   * Update challenge progress
   */
  async updateProgress(
    userChallengeId: string,
    progress: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("user_challenges")
        .update({ current_progress: progress })
        .eq("id", userChallengeId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to update progress:", error);
      return false;
    }
  }

  /**
   * Complete a challenge
   */
  async completeChallenge(
    userChallengeId: string,
    points: number = 0
  ): Promise<boolean> {
    try {
      // Update challenge completion
      const { error: updateError } = await supabase
        .from("user_challenges")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", userChallengeId);

      if (updateError) throw updateError;

      // Get the user_id to award points
      const { data: userChallenge } = await supabase
        .from("user_challenges")
        .select("user_id, challenge_id")
        .eq("id", userChallengeId)
        .single();

      if (userChallenge) {
        // Award reward points
        await this.awardReward(
          userChallenge.user_id,
          userChallenge.challenge_id,
          points
        );
      }

      return true;
    } catch (error) {
      console.error("Failed to complete challenge:", error);
      return false;
    }
  }

  /**
   * Award reward to user
   */
  async awardReward(
    userId: string,
    challengeId: string,
    points: number
  ): Promise<boolean> {
    try {
      const { error } = await supabase.from("rewards").insert({
        user_id: userId,
        challenge_id: challengeId,
        points,
        earned_at: new Date().toISOString(),
        description: `Challenge completed`,
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Failed to award reward:", error);
      return false;
    }
  }

  /**
   * Get challenge leaderboard
   */
  async getLeaderboard(challengeId: string): Promise<ChallengeLeaderboard[]> {
    try {
      const { data, error } = await supabase
        .from("user_challenges")
        .select("user_id, current_progress, completed, users(username, avatar)")
        .eq("challenge_id", challengeId)
        .order("current_progress", { ascending: false })
        .limit(10);

      if (error) throw error;

      return (
        (data as any[])?.map((item, index) => ({
          user_id: item.user_id,
          username: item.users?.username || "Anónimo",
          avatar: item.users?.avatar,
          progress: item.current_progress,
          rank: index + 1,
          points: 0,
          completed: item.completed,
        })) || []
      );
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
      return getMockLeaderboard();
    }
  }

  /**
   * Get user's total reward points
   */
  async getUserPoints(userId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from("rewards")
        .select("points")
        .eq("user_id", userId);

      if (error) throw error;

      return data?.reduce((sum, reward) => sum + reward.points, 0) || 0;
    } catch (error) {
      console.error("Failed to fetch user points:", error);
      return 0;
    }
  }

  /**
   * Get user's reward history
   */
  async getRewardHistory(userId: string): Promise<Reward[]> {
    try {
      const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("user_id", userId)
        .order("earned_at", { ascending: false });

      if (error) throw error;
      return (data as Reward[]) || [];
    } catch (error) {
      console.error("Failed to fetch reward history:", error);
      return [];
    }
  }
}

// Mock data generators
function getMockChallenges(): Challenge[] {
  const now = new Date();
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  return [
    {
      id: "challenge-1",
      title: "10K Steps Challenge",
      description: "Camina 10,000 pasos cada día durante una semana",
      icon: "👣",
      type: "steps",
      goal: 70000, // 10k steps x 7 days
      unit: "pasos",
      duration: "weekly",
      reward_points: 500,
      difficulty: "easy",
      max_participants: 100,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      created_at: now.toISOString(),
    },
    {
      id: "challenge-2",
      title: "Calorie Burn Master",
      description: "Quema 5,000 calorías en una semana",
      icon: "🔥",
      type: "calories",
      goal: 5000,
      unit: "calorías",
      duration: "weekly",
      reward_points: 750,
      difficulty: "medium",
      max_participants: 50,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      created_at: now.toISOString(),
    },
    {
      id: "challenge-3",
      title: "Workout Warrior",
      description: "Entrena 60 minutos en 3 días consecutivos",
      icon: "💪",
      type: "duration",
      goal: 180, // 60 min x 3 days
      unit: "minutos",
      duration: "weekly",
      reward_points: 1000,
      difficulty: "hard",
      max_participants: 75,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      created_at: now.toISOString(),
    },
    {
      id: "challenge-4",
      title: "Runner's Paradise",
      description: "Corre 25 km en una semana",
      icon: "🏃",
      type: "distance",
      goal: 25,
      unit: "km",
      duration: "weekly",
      reward_points: 800,
      difficulty: "medium",
      max_participants: 60,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      created_at: now.toISOString(),
    },
    {
      id: "challenge-5",
      title: "7-Day Streak",
      description: "Ejercítate 7 días consecutivos sin faltar",
      icon: "🔥",
      type: "streak",
      goal: 7,
      unit: "días",
      duration: "weekly",
      reward_points: 1200,
      difficulty: "hard",
      max_participants: 40,
      start_date: now.toISOString(),
      end_date: endDate.toISOString(),
      created_at: now.toISOString(),
    },
  ];
}

function getMockLeaderboard(): ChallengeLeaderboard[] {
  return [
    {
      user_id: "user-1",
      username: "Carlos M.",
      progress: 42500,
      rank: 1,
      points: 2500,
      completed: false,
    },
    {
      user_id: "user-2",
      username: "María G.",
      progress: 38200,
      rank: 2,
      points: 2000,
      completed: false,
    },
    {
      user_id: "user-3",
      username: "Juan P.",
      progress: 35800,
      rank: 3,
      points: 1800,
      completed: false,
    },
    {
      user_id: "user-4",
      username: "Sofia L.",
      progress: 32100,
      rank: 4,
      points: 1500,
      completed: false,
    },
    {
      user_id: "user-5",
      username: "Diego R.",
      progress: 29500,
      rank: 5,
      points: 1200,
      completed: false,
    },
  ];
}

// Export singleton instance
export const challengesService = new ChallengesService();

// Export challenges analytics
export const challengesAnalytics = {
  joinChallenge: (challengeId: string, challengeTitle: string) => ({
    event: "challenge_joined",
    data: { challengeId, challengeTitle },
  }),
  completeChallenge: (challengeId: string, points: number) => ({
    event: "challenge_completed",
    data: { challengeId, points },
  }),
  viewLeaderboard: (challengeId: string) => ({
    event: "leaderboard_viewed",
    data: { challengeId },
  }),
  inviteFriend: (challengeId: string) => ({
    event: "challenge_invite_sent",
    data: { challengeId },
  }),
};
