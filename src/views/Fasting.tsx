import React, { useEffect, useState } from "react";
import { ScreenName } from "../types";
import { supabase } from "../supabaseClient";

interface FastingProps {
  navigate: (screen: ScreenName) => void;
}

const FastingView: React.FC<FastingProps> = ({ navigate }) => {
  const [activeSession, setActiveSession] = useState<any>(null);
  const [elapsed, setElapsed] = useState({ h: 0, m: 0, s: 0 });
  const [targetHours] = useState(16);

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    let interval: any;
    if (activeSession) {
      const update = () => {
        const start = new Date(activeSession.start_time).getTime();
        const now = Date.now();
        const diff = Math.max(0, now - start);
        setElapsed({
          h: Math.floor(diff / 3600000),
          m: Math.floor((diff % 3600000) / 60000),
          s: Math.floor((diff % 60000) / 1000),
        });
      };
      update();
      interval = setInterval(update, 1000);
    } else {
      setElapsed({ h: 0, m: 0, s: 0 });
    }
    return () => clearInterval(interval);
  }, [activeSession]);

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

  const startFasting = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("fasting_sessions")
      .insert({
        user_id: user.id,
        start_time: new Date().toISOString(),
        protocol: "16:8",
      })
      .select()
      .single();

    if (!error && data) {
      setActiveSession(data);
    }
  };

  const stopFasting = async () => {
    if (!activeSession) return;
    const { error } = await supabase
      .from("fasting_sessions")
      .update({ end_time: new Date().toISOString() })
      .eq("id", activeSession.id);

    if (!error) {
      setActiveSession(null);
    }
  };

  const progressPercent = Math.min(100, Math.round(((elapsed.h + elapsed.m / 60) / targetHours) * 100));

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ayuno</h1>
        </div>
        <button className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">timeline</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start p-6 pb-24 w-full max-w-lg mx-auto gap-10">

        {/* Protocol Selector - Premium Pill */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-1 rounded-3xl flex gap-1 border border-slate-100 dark:border-slate-800">
          {["16:8", "18:6", "20:4"].map(p => (
            <button key={p} className={`px-6 py-2 rounded-2xl text-xs font-black transition-all ${p === "16:8" ? "bg-white dark:bg-slate-800 shadow-md text-slate-900 dark:text-white" : "text-slate-400"}`}>
              {p}
            </button>
          ))}
        </div>

        {/* Huge Timer View */}
        <section className="flex flex-col items-center gap-4 relative">
          <div className="relative size-80 flex items-center justify-center">
            <svg className="absolute size-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle className="text-slate-100 dark:text-slate-900" cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8"></circle>
              <circle
                className={`${activeSession ? "text-primary-500" : "text-slate-300"} transition-all duration-1000 ease-out`}
                cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeDasharray="289"
                strokeDashoffset={289 - (activeSession ? (progressPercent / 100) * 289 : 0)}
                strokeLinecap="round" strokeWidth="8"
              ></circle>
            </svg>

            <div className="flex flex-col items-center text-center z-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{activeSession ? "Tiempo transcurrido" : "Listo para empezar"}</p>
              <div className="text-6xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                {String(elapsed.h).padStart(2, '0')}<span className="text-primary-500 opacity-50 px-1">:</span>{String(elapsed.m).padStart(2, '0')}
              </div>
              <div className="text-xl font-bold text-slate-400 tabular-nums mt-1 opacity-50">
                {String(elapsed.s).padStart(2, '0')}
              </div>
            </div>

            {activeSession && (
              <div className="absolute inset-0 bg-primary-500/5 rounded-full blur-[90px] -z-10 animate-pulse"></div>
            )}
          </div>
        </section>

        {/* Progress & Target Card */}
        <section className="card-premium w-full p-6 bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-2 flex justify-between items-center group">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Meta Hoy</p>
            <h4 className="text-lg font-black text-slate-900 dark:text-white">Protocolo {activeSession?.protocol || "16:8"}</h4>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Progreso</p>
            <h4 className="text-lg font-black text-primary-500">{progressPercent}%</h4>
          </div>
        </section>

        {/* Control Button */}
        <div className="w-full mt-auto">
          {activeSession ? (
            <button
              onClick={stopFasting}
              className="w-full py-6 rounded-[2.5rem] bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <span className="material-symbols-outlined filled">stop_circle</span>
              Finalizar Ayuno
            </button>
          ) : (
            <button
              onClick={startFasting}
              className="w-full py-6 rounded-[2.5rem] bg-primary-500 text-white font-extrabold text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-primary-500/40"
            >
              <span className="material-symbols-outlined filled">play_circle</span>
              Iniciar Ayuno
            </button>
          )}
          <p className="text-center text-xs font-bold text-slate-400 mt-6 px-4">Recuerda mantenerte hidratado y escuchar a tu cuerpo durante el periodo de ayuno.</p>
        </div>
      </div>
    </div>
  );
};

export default FastingView;
