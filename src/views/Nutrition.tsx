import React, { useState } from 'react';
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

  // Load meals on mount
  React.useEffect(() => {
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
        meal_type: 'snack', // Defaulting to snack for now, logic can be improved
        proteins: 0,
        carbs: 0,
        fats: 0
      });

      if (!error) {
        setShowAddModal(false);
        setNewMeal('');
        setCalories('');
        loadMeals(); // Reload list
      } else {
        console.error(error);
        alert("Error al guardar comida");
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <button
            className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors"
            onClick={() => navigate(ScreenName.HOME)}
          >
            <span className="material-symbols-outlined text-text-main dark:text-white">calendar_today</span>
          </button>
          <h1 className="text-xl font-bold tracking-tight">Hoy</h1>
        </div>
        <button className="flex items-center justify-center p-2 rounded-full hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
          <span className="material-symbols-outlined text-text-main dark:text-white">history</span>
        </button>
      </header>

      <div className="flex flex-col gap-6 p-4 animate-fade-in">
        {/* Fasting Window Widget */}
        <section
          className="bg-surface-light dark:bg-surface-dark rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform"
          onClick={() => navigate(ScreenName.FASTING)}
        >
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined filled">timer</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-sub dark:text-gray-400 uppercase tracking-wide">Ventana de Alimentación</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold">12:00 PM - 8:00 PM</p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Activo</span>
            </div>
          </div>
          <button className="text-text-sub dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </section>

        {/* Daily Stats Chart */}
        <section className="bg-surface-light dark:bg-surface-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-text-sub dark:text-gray-400">Resumen Diario</p>
              <h2 className="text-3xl font-bold tracking-tight mt-1">1,250 <span className="text-lg text-text-sub dark:text-gray-400 font-normal">/ 1,800 Kcal</span></h2>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-primary">Restan 550</span>
              <span className="text-xs text-text-sub dark:text-gray-400">Objetivo</span>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                <span>Proteína</span>
                <span>80g / 120g</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(19,236,19,0.4)]" style={{ width: '66%' }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                <span>Carbohidratos</span>
                <span>110g / 200g</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '55%' }}></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-text-sub dark:text-gray-400 uppercase tracking-wider">
                <span>Grasas</span>
                <span>45g / 60g</span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-purple-400 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Dietitian Card */}
        <section className="relative overflow-hidden rounded-2xl bg-surface-dark shadow-md group cursor-pointer" onClick={() => navigate(ScreenName.CHAT)}>
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-80 mix-blend-overlay transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url("${IMAGES.AI_DIET}")` }}></div>
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="relative z-20 p-5 pt-32 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-primary text-black p-1 rounded-md">
                <span className="material-symbols-outlined text-sm">smart_toy</span>
              </div>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Consejo de tu Dietista IA</span>
            </div>
            <h3 className="text-white text-xl font-bold leading-tight">Te falta un poco de proteína hoy. ¿Qué tal un yogur griego de merienda?</h3>
            <button className="mt-2 self-start bg-primary hover:bg-green-400 text-black text-sm font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2" onClick={() => navigate(ScreenName.CHAT)}>
              Ver sugerencias
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Meal Logging List */}
        <section className="pb-20">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-bold text-xl">Plan de Alimentación</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
              <span className="material-symbols-outlined text-lg">edit_calendar</span>
              Editar
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {meals.length === 0 ? (
              <div className="p-4 text-center text-text-sub dark:text-gray-400">
                No hay comidas registradas hoy
              </div>
            ) : (
              meals.map((meal) => (
                <div key={meal.id} className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 flex items-center gap-4 shadow-sm border-l-4 border-primary">
                  <div className="flex flex-col items-center gap-1 min-w-[50px]">
                    <span className="text-xs font-bold text-text-sub dark:text-gray-400">
                      {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="material-symbols-outlined filled text-primary text-xl">check_circle</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-text-sub dark:text-gray-400 uppercase text-[10px] tracking-wide">
                      {meal.meal_type || 'Snack'}
                    </p>
                    <p className="font-bold text-base">{meal.name}</p>
                    <p className="text-xs text-text-sub dark:text-gray-400 mt-0.5">{meal.calories} Kcal • Registrado</p>
                  </div>
                </div>
              ))
            )}

            {/* Add Extra Snack Button */}
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-text-sub dark:text-gray-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors active:bg-gray-50 dark:active:bg-gray-800"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Registrar Snack
            </button>
          </div>
        </section>
      </div>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-surface-dark w-full max-w-md rounded-3xl p-6 shadow-2xl animate-slide-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold dark:text-white">Registrar Comida</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-100 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="material-symbols-outlined dark:text-white">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMeal} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-400 ml-1">¿Qué comiste?</label>
                <input
                  autoFocus
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  placeholder="Ej. Manzana y almendras"
                  className="w-full mt-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-400 ml-1">Calorías (aprox)</label>
                  <input
                    type="number"
                    placeholder="150"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className="w-full mt-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-text-sub dark:text-gray-400 ml-1">Hora</label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full mt-1 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl p-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-primary text-black font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
              >
                Guardar Snack
              </button>
            </form>
          </div>
        </div>
      )}

      <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease-out forwards;
          }
          @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          .animate-slide-up {
            animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          }
      `}</style>
    </>
  );
};

export default NutritionView;