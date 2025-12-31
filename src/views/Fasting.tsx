import React, { useState, useEffect } from "react";
import { ScreenName } from "../types";
import { supabase } from "../supabaseClient";

interface FastingProps {
  navigate: (screen: ScreenName) => void;
}

const FastingView: React.FC<FastingProps> = ({ navigate }) => {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [elapsed, setElapsed] = useState({ h: 0, m: 0, s: 0 });

  // Load active session
  useEffect(() => {
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("fasting_sessions")
        .select("*")
        .eq("user_id", user.id)
        .is("end_time", null)
        .order("start_time", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) {
        setActiveSession(data);
      }
    };
    loadSession();
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: any;
    if (activeSession) {
      const updateTimer = () => {
        const start = new Date(activeSession.start_time).getTime();
        const now = new Date().getTime();
        const diff = now - start;

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        setElapsed({ h, m, s });
      };

      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsed({ h: 0, m: 0, s: 0 });
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleEndFasting = async () => {
    if (!activeSession) return;

    const now = new Date().toISOString();
    const { error } = await supabase
      .from("fasting_sessions")
      .update({ end_time: now })
      .eq("id", activeSession.id);

    if (!error) {
      setActiveSession(null);
      // Optional: Refresh summary or logs
    }
  };

  const handleStartFasting = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("fasting_sessions")
      .insert({
        user_id: user.id,
        start_time: new Date().toISOString(),
        protocol: "16:8" // Default protocol
      })
      .select()
      .single();

    if (data) setActiveSession(data);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 pb-2 justify-between sticky top-0 z-10 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate(ScreenName.HOME)}
        >
          <span className="material-symbols-outlined text-text-main dark:text-white">
            arrow_back
          </span>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
              Control de Ayuno
            </h2>
            <span className="text-xs font-medium text-text-sub dark:text-gray-400">
              {new Date().toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center justify-center rounded-full h-10 w-10 bg-surface-light dark:bg-surface-dark text-text-main dark:text-white shadow-sm">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        <div className="px-4 py-2 flex justify-center">
          <div className="inline-flex items-center gap-2 bg-surface-light dark:bg-surface-dark px-4 py-2 rounded-full shadow-sm border border-gray-100 dark:border-gray-800 cursor-pointer">
            <span className="material-symbols-outlined text-primary text-sm">
              bolt
            </span>
            <span className="text-sm font-bold">Protocolo {activeSession?.protocol || "16:8"}</span>
            <span className="material-symbols-outlined text-text-sub text-sm">
              expand_more
            </span>
          </div>
        </div>

        {/* Circular Timer Dial */}
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <div
            className="relative w-64 h-64 rounded-full flex items-center justify-center shadow-lg transition-all duration-500"
            style={{ background: activeSession ? "conic-gradient(#22c55e 85%, #dbe6db 0deg)" : "bg-gray-200" }}
          >
            <div className="absolute w-[90%] h-[90%] bg-background-light dark:bg-background-dark rounded-full flex flex-col items-center justify-center z-10 shadow-inner">
              <div className="text-center mb-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${activeSession ? "bg-primary/10 text-green-700 dark:text-primary" : "bg-gray-100 text-gray-500"}`}>
                  {activeSession ? "Ayunando" : "Sin Ayuno"}
                </span>
              </div>
              <div className="flex items-baseline gap-1 text-text-main dark:text-white">
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold tracking-tighter leading-none">
                    {elapsed.h}
                  </span>
                  <span className="text-xs text-text-sub dark:text-gray-400 font-medium mt-1">
                    h
                  </span>
                </div>
                <span className="text-4xl font-bold text-text-sub/30 pb-4">
                  :
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold tracking-tighter leading-none">
                    {elapsed.m.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-text-sub dark:text-gray-400 font-medium mt-1">
                    m
                  </span>
                </div>
                <span className="text-4xl font-bold text-text-sub/30 pb-4">
                  :
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-bold tracking-tighter leading-none text-text-sub dark:text-gray-400">
                    {elapsed.s.toString().padStart(2, '0')}
                  </span>
                  <span className="text-xs text-text-sub dark:text-gray-400 font-medium mt-1">
                    s
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-text-sub dark:text-gray-400">
                {activeSession ? "Meta: 16:00 h" : "Listo para empezar"}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6">
          {activeSession ? (
            <button
              onClick={handleEndFasting}
              className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-primary hover:bg-primary-dark transition-colors text-[#111811] text-lg font-bold leading-normal tracking-wide shadow-lg shadow-primary/30"
            >
              <span className="mr-2 material-symbols-outlined">restaurant</span>
              <span>Terminar Ayuno</span>
            </button>
          ) : (
            <button
              onClick={handleStartFasting}
              className="w-full flex cursor-pointer items-center justify-center overflow-hidden rounded-xl h-14 bg-black dark:bg-white dark:text-black hover:bg-gray-800 transition-colors text-white text-lg font-bold leading-normal tracking-wide shadow-lg"
            >
              <span className="mr-2 material-symbols-outlined">play_arrow</span>
              <span>Empezar Ayuno</span>
            </button>
          )}

          {activeSession && (
            <div className="flex justify-center mt-3">
              <button className="text-sm text-text-sub dark:text-gray-400 font-medium underline decoration-dashed underline-offset-4 hover:text-primary transition-colors">
                Editar hora de inicio
              </button>
            </div>
          )}
        </div>

        {/* Weekly Graph */}
        <div className="px-4 py-2">
          <div className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base">Esta semana</h3>
              {/* Placeholder logic for graph */}
              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-text-sub dark:text-gray-400">
                Promedio: -- h
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-32 w-full">
              {/* Bars placeholder */}
              {["L", "M", "X", "J", "V", "S", "D"].map((day) => (
                <div
                  key={day}
                  className="flex flex-col items-center gap-2 group w-full"
                >
                  <div
                    className="relative w-full bg-gray-100 dark:bg-gray-800 rounded-t-md transition-all"
                    style={{
                      height: "10%",
                    }}
                  ></div>
                  <span className="text-xs font-medium text-text-sub dark:text-gray-400">
                    {day}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-center mt-2 text-gray-400">Historial no disponible</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastingView;
