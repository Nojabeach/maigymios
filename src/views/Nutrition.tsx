import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import { IMAGES } from '../constants';
import { supabase } from '../supabaseClient';

interface NutritionProps {
  navigate: (screen: ScreenName) => void;
  user?: any;
}

const NutritionView: React.FC<NutritionProps> = ({ navigate, user }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState('');
  const [calories, setCalories] = useState('');
  const [time, setTime] = useState('');
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      loadMeals();
    }
  }, [user]);

  const loadMeals = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('created_at', { ascending: true });

    if (data) setMeals(data);
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeal.trim() && user?.id) {
      const today = new Date().toISOString().split('T')[0];

      const { error } = await supabase.from('meals').insert({
        user_id: user.id,
        name: newMeal,
        calories: parseInt(calories) || 0,
        date: today,
        meal_type: 'snack',
        proteins: 0,
        carbs: 0,
        fats: 0
      });

      if (!error) {
        setShowAddModal(false);
        setNewMeal('');
        setCalories('');
        loadMeals();
      }
    }
  };

  const totalCals = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const targetCals = 1800;
  const calPercentage = Math.min(100, Math.round((totalCals / targetCals) * 100));

  return (
    <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col min-h-screen">
      {/* Header - Glassmorphism */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between safe-top">
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 active:scale-90 transition-all"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Nutrición</h1>
        </div>
        <button className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <span className="material-symbols-outlined">history</span>
        </button>
      </header>

      <div className="flex flex-col gap-8 p-6 pb-24 animate-fade-in w-full max-w-lg mx-auto">
        {/* Calorie Progress Card */}
        <section className="card-premium bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Calorías Totales</p>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">
                {totalCals.toLocaleString()} <span className="text-lg font-bold text-slate-400">/ {targetCals}</span>
              </h2>
            </div>
            <div className="bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase">
              Snacks Activos
            </div>
          </div>

          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-1000"
              style={{ width: `${calPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs font-bold text-slate-400 text-right">{100 - calPercentage}% restante para tu meta</p>
        </section>

        {/* AI Suggestion */}
        <section
          className="relative rounded-[2rem] overflow-hidden group cursor-pointer active:scale-[0.98] transition-all h-48 shadow-strong"
          onClick={() => navigate(ScreenName.CHAT)}
        >
          <img src={IMAGES.AI_DIET} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Dietist" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-primary-500 p-1 rounded-lg"><span className="material-symbols-outlined text-sm text-white">smart_toy</span></span>
              <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Sugerencia IA</span>
            </div>
            <h3 className="text-lg font-black text-white leading-tight">¿Te falta proteína? Un yogur griego sería ideal ahora.</h3>
          </div>
        </section>

        {/* Meals List */}
        <section>
          <div className="flex justify-between items-center mb-6 px-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Comidas de Hoy</h3>
            <button
              className="w-10 h-10 rounded-2xl bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 active:scale-90 transition-all"
              onClick={() => setShowAddModal(true)}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {meals.length === 0 ? (
              <div className="card-premium py-12 flex flex-col items-center opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">restaurant</span>
                <p className="text-sm font-bold">No has registrado nada aún</p>
              </div>
            ) : (
              meals.map((meal) => (
                <div key={meal.id} className="card-premium p-4 flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-all">
                    <span className="material-symbols-outlined filled">lunch_dining</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-slate-900 dark:text-white">{meal.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-slate-400">{meal.calories} kcal</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-xs font-bold text-slate-400">
                        {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <button className="text-slate-300 hover:text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Modern Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 safe-bottom">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-slide-up border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nuevo Snack</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800"><span className="material-symbols-outlined">close</span></button>
            </div>

            <form onSubmit={handleAddMeal} className="flex flex-col gap-6">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción</label>
                <input
                  autoFocus
                  required
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  placeholder="Ej. Batido de proteínas"
                  className="w-full mt-2 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 text-lg font-bold outline-none ring-2 ring-transparent focus:ring-primary-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Kcal</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    placeholder="150"
                    className="w-full mt-2 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 text-lg font-bold outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-2 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl p-4 text-lg font-bold outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-primary-500 text-white font-black py-5 rounded-3xl shadow-xl shadow-primary-500/30 hover:bg-primary-600 active:scale-95 transition-all mt-4">
                Guardar Registro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NutritionView;