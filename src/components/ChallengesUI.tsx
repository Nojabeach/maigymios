/**
 * Challenges & Leaderboard Components
 * Components for displaying and interacting with challenges
 */

import React, { useState, useEffect } from "react";
import type {
  Challenge,
  ChallengeLeaderboard,
  UserChallenge,
} from "../utils/challenges";
import { challengesService } from "../utils/challenges";

interface ChallengeCardProps {
  challenge: Challenge;
  joined?: boolean;
  onJoin?: () => void;
  progress?: number;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  joined = false,
  onJoin,
  progress = 0,
}) => {
  const progressPercent = (progress / challenge.goal) * 100;
  const daysLeft = Math.ceil(
    (new Date(challenge.end_date).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const difficultyColor = {
    easy: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    medium:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
    hard: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{challenge.icon}</span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">
              {challenge.title}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {daysLeft} días restantes
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-bold px-2 py-1 rounded-full ${
            difficultyColor[challenge.difficulty]
          }`}
        >
          {challenge.difficulty === "easy"
            ? "Fácil"
            : challenge.difficulty === "medium"
            ? "Medio"
            : "Difícil"}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {challenge.description}
      </p>

      {joined && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              Progreso
            </span>
            <span className="text-xs font-bold text-gray-900 dark:text-white">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Meta</p>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {challenge.goal} {challenge.unit}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
            Recompensa
          </p>
          <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
            +{challenge.reward_points} pts
          </p>
        </div>
        {!joined && onJoin && (
          <button
            onClick={onJoin}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg active:scale-95 transition-transform"
          >
            Unirse
          </button>
        )}
      </div>
    </div>
  );
};

interface LeaderboardEntryProps {
  entry: ChallengeLeaderboard;
}

export const LeaderboardEntry: React.FC<LeaderboardEntryProps> = ({
  entry,
}) => {
  const getMedalEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold w-6 text-center">
          {getMedalEmoji(entry.rank)}
        </span>
        {entry.avatar && (
          <img
            src={entry.avatar}
            alt={entry.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {entry.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {entry.points} puntos
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-900 dark:text-white">
          {entry.progress}
        </p>
        {entry.completed && (
          <p className="text-xs text-green-600 dark:text-green-400">
            ✓ Completado
          </p>
        )}
      </div>
    </div>
  );
};

interface ChallengesListProps {
  challenges: Challenge[];
  userChallenges: UserChallenge[];
  onJoin: (challengeId: string) => void;
}

export const ChallengesList: React.FC<ChallengesListProps> = ({
  challenges,
  userChallenges,
  onJoin,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          🎯 Retos Disponibles
        </h3>
        <div className="space-y-3">
          {challenges.map((challenge) => {
            const userChallenge = userChallenges.find(
              (uc) => uc.challenge_id === challenge.id
            );
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                joined={!!userChallenge}
                onJoin={() => onJoin(challenge.id)}
                progress={userChallenge?.current_progress || 0}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface LeaderboardProps {
  challengeId: string;
  leaderboard: ChallengeLeaderboard[];
  title?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboard,
  title = "Clasificación",
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        🏆 {title}
      </h3>

      {leaderboard.length > 0 ? (
        <div className="space-y-2">
          {leaderboard.map((entry) => (
            <LeaderboardEntry key={entry.user_id} entry={entry} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-6">
          Sin participantes aún
        </p>
      )}
    </div>
  );
};

interface RewardBadgeProps {
  icon: string;
  label: string;
  points: number;
  date: string;
}

export const RewardBadge: React.FC<RewardBadgeProps> = ({
  icon,
  label,
  points,
  date,
}) => {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <p className="font-semibold text-gray-900 dark:text-white text-sm">
        {label}
      </p>
      <p className="text-xs text-yellow-700 dark:text-yellow-400 font-bold mt-1">
        +{points} puntos
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{date}</p>
    </div>
  );
};

interface ChallengesDashboardProps {
  userId?: string;
}

export const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({
  userId,
}) => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<ChallengeLeaderboard[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allChallenges, userChalls, points] = await Promise.all([
          challengesService.getActiveChallenges(),
          userId
            ? challengesService.getUserChallenges(userId)
            : Promise.resolve([]),
          userId ? challengesService.getUserPoints(userId) : Promise.resolve(0),
        ]);

        setChallenges(allChallenges);
        setUserChallenges(userChalls);
        setTotalPoints(points);

        // Load leaderboard for first challenge
        if (allChallenges.length > 0) {
          const leaderboardData = await challengesService.getLeaderboard(
            allChallenges[0].id
          );
          setLeaderboard(leaderboardData);
        }
      } catch (error) {
        console.error("Failed to load challenges data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId]);

  const handleJoinChallenge = async (challengeId: string) => {
    if (!userId) return;

    const joined = await challengesService.joinChallenge(userId, challengeId);
    if (joined) {
      // Reload user challenges
      const updated = await challengesService.getUserChallenges(userId);
      setUserChallenges(updated);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cargando retos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-90">Puntos Totales</p>
        <p className="text-4xl font-bold">{totalPoints}</p>
        <p className="text-xs opacity-75 mt-2">Ganados completando retos</p>
      </div>

      {/* Challenges and Leaderboard */}
      <ChallengesList
        challenges={challenges}
        userChallenges={userChallenges}
        onJoin={handleJoinChallenge}
      />

      {leaderboard.length > 0 && (
        <Leaderboard
          challengeId={challenges[0]?.id || ""}
          leaderboard={leaderboard}
          title="Ranking Actual"
        />
      )}
    </div>
  );
};
