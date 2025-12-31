# 📋 TODO LISTA - CAMINO A PRODUCCIÓN 100%

## Estado: 60% → Objetivo: 100% Funcional y Productivo

Basado en auditoría completa. **Tiempo estimado total: 4-6 horas**

---

## 🟢 SOLICITUDES AL USUARIO

### SOLICITUD 1: Verificar/Crear Tablas en Supabase ⏱️ 30 min

**Proyecto Supabase**: `lqthrfsvljirorypgvmi`

**Verificar que estas tablas EXISTEN:**

- [ ] `user_stats` - Debe existir (usada en App.tsx línea 125)
- [ ] `challenges` - Debe existir (usada en challenges.ts)
- [ ] `user_challenges` - Debe existir
- [ ] `rewards` - Debe existir

**Crear estas tablas si NO existen:**

```sql
-- 1. HEALTH DATA
CREATE TABLE health_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  metric_type VARCHAR(50),  -- 'steps', 'heart_rate', 'sleep'
  value NUMERIC NOT NULL,
  unit VARCHAR(20),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, metric_type, date)
);
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own data" ON health_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own data" ON health_data FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 2. WORKOUTS
CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  exercise_name VARCHAR(255),
  duration_minutes INT,
  calories_burned INT,
  intensity VARCHAR(20),  -- 'light', 'moderate', 'vigorous'
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own workouts" ON workouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workouts" ON workouts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. MEALS
CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  food_name VARCHAR(255),
  calories INT,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  date DATE NOT NULL,
  time TIME,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own meals" ON meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own meals" ON meals FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. FASTING SESSIONS
CREATE TABLE fasting_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  protocol VARCHAR(20),  -- '16:8', '18:6', etc
  duration_hours NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own sessions" ON fasting_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own sessions" ON fasting_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. CHAT MESSAGES
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role VARCHAR(20),  -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own messages" ON chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own messages" ON chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. HYDRATION LOGS (si no existe)
CREATE TABLE IF NOT EXISTS hydration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount_liters NUMERIC NOT NULL,
  date DATE NOT NULL,
  time TIME,
  created_at TIMESTAMP DEFAULT NOW()
);
ALTER TABLE hydration_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own logs" ON hydration_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own logs" ON hydration_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Instrucciones:**

1. Ir a https://app.supabase.com
2. Seleccionar proyecto `maigymios` (o el correcto)
3. SQL Editor → New Query
4. Copiar y ejecutar cada tabla
5. Confirmar creación exitosa

---

### SOLICITUD 2: Credenciales Faltantes ⏱️ 15 min

**Actualizar `.env.local` con:**

```dotenv
# Google AI (para Chat.tsx)
VITE_GOOGLE_API_KEY=<Tu API key de Google Cloud / Gemini>

# Google Analytics (opcional pero recomendado)
VITE_GA_ID=G-<Tu ID de Google Analytics>

# Sentry Error Tracking (opcional pero recomendado)
VITE_SENTRY_DSN=https://<tu-sentry-dsn>@sentry.io/project-id

# Environment
VITE_ENV=production
```

**¿Dónde obtener?**

- Google API Key: https://cloud.google.com/docs/authentication/api-keys
- GA ID: https://analytics.google.com
- Sentry DSN: https://sentry.io

---

### SOLICITUD 3: Verificar Estructura de Datos ⏱️ 10 min

Confirma que en tu Supabase:

- [ ] Tabla `users` tiene campos: `id, email, name, avatar, created_at`
- [ ] Tabla `user_stats` tiene campos: `id, user_id, date, calories, activity_minutes, hydration_current, hydration_goal`

Si faltan campos, agregar en SQL Editor.

---

## 🔴 TAREAS DE CÓDIGO - PRIORIDAD ALTA

### TAREA 1: Eliminar Mock Data en Profile.tsx ⏱️ 30 min

**Archivo**: `src/views/Profile.tsx`
**Líneas**: 24-49
**Prioridad**: 🔴 CRÍTICA

**Cambio requerido:**

```tsx
// ❌ ANTES:
const weeklyProgressData = [
  { date: "Lun", value: 45 },
  { date: "Mar", value: 48 },
  // ... MOCK DATA
];

// ✅ DESPUÉS:
const [weeklyProgressData, setWeeklyProgressData] = useState([]);

useEffect(() => {
  const loadCharts = async () => {
    if (!user?.id) return;

    const { data: stats } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .order("date", { ascending: true });

    if (stats) {
      setWeeklyProgressData(
        stats.map((s) => ({
          date: new Date(s.date).toLocaleDateString("es-ES", {
            weekday: "short",
          }),
          value: s.calories || 0,
        }))
      );
    }
  };
  loadCharts();
}, [user?.id]);
```

**Checklist:**

- [ ] Reemplazar `weeklyProgressData` mock
- [ ] Reemplazar `caloriesData` mock
- [ ] Reemplazar `hydrationData` mock
- [ ] Verificar que useEffect carga datos
- [ ] Test: Gráficos muestran datos reales o vacíos (si no hay datos)

---

### TAREA 2: Reemplazar HealthData Mock ⏱️ 45 min

**Archivo**: `src/utils/healthData.ts`
**Líneas**: 59-177 y 179-182
**Prioridad**: 🔴 CRÍTICA

**Cambios necesarios:**

A. Eliminar funciones generadoras (lineas 59-177):

```typescript
// ❌ ELIMINAR:
const generateMockHealthData = (): HealthDataPoint[] => { ... }
const generateMockHeartRateData = (): HealthDataPoint[] => { ... }
const generateMockSleepData = (): HealthDataPoint[] => { ... }
const generateMockWorkouts = (): WorkoutData[] => { ... }
```

B. Reemplazar métodos de la clase HealthDataService (líneas 201-266):

```typescript
async getSteps(days: number = 7): Promise<HealthDataPoint[]> {
  try {
    const { data } = await supabase
      .from('health_data')
      .select('*')
      .eq('metric_type', 'steps')
      .gte('date', new Date(Date.now() - days*24*60*60*1000))
      .order('date');

    return data || [];
  } catch (error) {
    console.error("Error fetching steps:", error);
    return [];
  }
}

// Similar para getHeartRate(), getSleep(), getWorkouts()
```

**Checklist:**

- [ ] Eliminar todos los generadores mock
- [ ] Eliminar propiedades `mockSteps`, `mockHeartRate`, `mockSleep`, `mockWorkouts`
- [ ] Reemplazar métodos con llamadas a Supabase
- [ ] Test: Health Dashboard carga datos o muestra vacío

---

### TAREA 3: Persistencia de Comidas ⏱️ 20 min

**Archivo**: `src/views/Nutrition.tsx`
**Línea**: 18-20
**Prioridad**: 🔴 CRÍTICA

**Cambio:**

```tsx
const handleAddMeal = async (e: React.FormEvent) => {
  e.preventDefault();
  if (newMeal.trim()) {
    try {
      // ❌ ANTES: alert("¡Comida registrada con éxito!");

      // ✅ DESPUÉS:
      const { error } = await supabase.from("meals").insert({
        user_id: user?.id,
        food_name: newMeal,
        calories: 150, // TODO: Calcular o pedir al usuario
        date: new Date().toISOString().split("T")[0],
        time: new Date().toTimeString().slice(0, 5),
      });

      if (!error) {
        setShowAddModal(false);
        setNewMeal("");
        // TODO: Mostrar toast success en lugar de alert
      } else {
        console.error("Error saving meal:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
};
```

**Checklist:**

- [ ] Cambiar `alert()` por insert en Supabase
- [ ] Capturar errores correctamente
- [ ] Test: Comida guardada persiste después de recargar

---

### TAREA 4: Logs de Hidratación ⏱️ 20 min

**Archivo**: `src/views/Hydration.tsx`
**Prioridad**: 🟡 IMPORTANTE

**Agregar método al hacer click en botones "Añadir agua":**

```typescript
const handleAddWater = async (amount: number) => {
  try {
    const { error } = await supabase.from("hydration_logs").insert({
      user_id: user?.id,
      amount_liters: amount,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().slice(0, 5),
    });

    if (!error) {
      // Actualizar estado padre
      updateHydration(amount);
    }
  } catch (error) {
    console.error("Error saving water:", error);
  }
};
```

**Checklist:**

- [ ] Botones de agua guardan en `hydration_logs`
- [ ] Estado del usuario se actualiza
- [ ] Test: Logs persisten

---

### TAREA 5: Sesiones de Ayuno ⏱️ 45 min

**Archivo**: `src/views/Fasting.tsx`
**Líneas**: 24-50 (hardcodes)
**Prioridad**: 🟡 IMPORTANTE

**Cambios:**

```typescript
const [fastingSession, setFastingSession] = useState<any>(null);

useEffect(() => {
  const loadActiveFasting = async () => {
    if (!user?.id) return;

    // Cargar sesión activa
    const { data } = await supabase
      .from("fasting_sessions")
      .select("*")
      .eq("user_id", user.id)
      .is("end_time", null) // Solo activa
      .order("start_time", { ascending: false })
      .limit(1)
      .single();

    setFastingSession(data);
  };

  loadActiveFasting();
  const interval = setInterval(loadActiveFasting, 60000); // Refresh cada minuto

  return () => clearInterval(interval);
}, [user?.id]);

// Reemplazar hardcodes "14:30", "Protocolo 16:8" con datos reales
// Calcular elapsed time desde start_time
```

**Checklist:**

- [ ] Cargar sesión activa de BD
- [ ] Eliminar hardcodes de horas
- [ ] Mostrar protocolo real del usuario
- [ ] Test: Fasting timer muestra datos actuales

---

### TAREA 6: Historial de Chat ⏱️ 30 min

**Archivo**: `src/views/Chat.tsx`
**Línea**: Después de respuesta (línea ~100-120)
**Prioridad**: 🟡 IMPORTANTE

**Agregar persistencia:**

```typescript
// Después de recibir respuesta de Gemini:
const saveMessageToHistory = async (userMsg: string, assistantMsg: string) => {
  try {
    const { error } = await supabase.from("chat_messages").insert([
      {
        user_id: user?.id,
        role: "user",
        content: userMsg,
      },
      {
        user_id: user?.id,
        role: "assistant",
        content: assistantMsg,
      },
    ]);

    if (error) console.error("Error saving chat:", error);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Cargar historial al iniciar Chat.tsx
useEffect(() => {
  const loadChatHistory = async () => {
    if (!user?.id) return;

    const { data } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(50);

    // TODO: Mostrar historial en UI
  };

  loadChatHistory();
}, [user?.id]);
```

**Checklist:**

- [ ] Guardar mensajes en BD
- [ ] Cargar historial al abrir Chat
- [ ] Mostrar historial en UI
- [ ] Test: Chat persiste después de cerrar app

---

### TAREA 7: Stats del Usuario ⏱️ 15 min

**Archivo**: `src/App.tsx`
**Líneas**: 42-49
**Prioridad**: 🔴 CRÍTICA

**Cambio:**

```typescript
// ❌ ANTES:
const defaultStats: UserStats = {
  calories: 1200, // HARDCODED
  activityMin: 35, // HARDCODED
  mindMin: 10, // HARDCODED
  hydrationCurrent: 1.5,
  hydrationGoal: 2.5,
};

// ✅ DESPUÉS:
// Cargar stats reales del usuario después de auth
useEffect(() => {
  const loadUserStats = async () => {
    if (!user?.id) {
      setStats(defaultStats);
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase
      .from("user_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    if (data) {
      setStats({
        calories: data.calories || 0,
        activityMin: data.activity_minutes || 0,
        mindMin: data.mind_minutes || 0,
        hydrationCurrent: data.hydration_current || 0,
        hydrationGoal: data.hydration_goal || 2.5,
      });
    } else {
      setStats(defaultStats); // Si no hay datos de hoy
    }
  };

  loadUserStats();
}, [user?.id]);
```

**Checklist:**

- [ ] Cargar stats después de auth
- [ ] Usar valores reales del usuario
- [ ] Fallback a defaults si no hay datos
- [ ] Test: Stats son del usuario logueado

---

## 🟡 TAREAS DE LIMPIEZA - PRIORIDAD MEDIA

### TAREA 8: Eliminar Archivos Duplicados ⏱️ 10 min

**Prioridad**: 🟡 MEDIA

```bash
# Eliminar duplicados:
rm src/vite.config.ts       # Usar solo root vite.config.ts
rm src/tsconfig.json        # Usar solo root tsconfig.json
rm src/manifest.json        # Usar solo public/manifest.json
# Verificar y eliminar si existe:
rm src/package.json
```

**Checklist:**

- [ ] `src/vite.config.ts` eliminado
- [ ] `src/tsconfig.json` eliminado
- [ ] `src/manifest.json` eliminado
- [ ] Build sigue funcionando

---

### TAREA 9: Limpiar Console.logs ⏱️ 15 min

**Prioridad**: 🟡 MEDIA (Para producción)

**Archivos afectados:**

- `src/utils/performance.ts` - 7 logs
- `src/utils/offlineSync.ts` - 10+ logs
- `src/utils/notifications.ts` - 4 logs

**Cambio:**

```typescript
// ❌ ANTES:
console.log("LCP:", value);

// ✅ DESPUÉS:
console.debug("LCP:", value);
// O mejor aún:
if (import.meta.env.DEV) {
  console.log("LCP:", value);
}
```

**Checklist:**

- [ ] Cambiar 7 logs en performance.ts
- [ ] Cambiar 10+ logs en offlineSync.ts
- [ ] Cambiar 4 logs en notifications.ts
- [ ] Build sin warnings

---

## 🟢 TAREAS DE VALIDACIÓN - PRIORIDAD FINAL

### TAREA 10: Testing Completo ⏱️ 30 min

**Prioridad**: 🔴 CRÍTICA

**Test Manual Checklist:**

```
Preparación:
- [ ] npm run build → Sin errores
- [ ] Sin TypeScript warnings
- [ ] Build size < 600KB

Flujo Autenticación:
- [ ] Login con usuario test ✓
- [ ] Logout funciona ✓
- [ ] Session persiste refresh ✓

Flujo Home:
- [ ] Stats muestran datos reales ✓
- [ ] Bottom nav navega correctamente ✓

Flujo Profile:
- [ ] Gráficos cargan datos (7 días) ✓
- [ ] Dark mode toggle funciona ✓

Flujo Nutrition:
- [ ] Registrar comida → Se guarda en Supabase ✓
- [ ] Recarga página → Comida persiste ✓

Flujo Hydration:
- [ ] Botón "Añadir agua" → Se guarda ✓
- [ ] Gráfico de hidratación actualiza ✓

Flujo Fasting:
- [ ] Muestra sesión actual si existe ✓
- [ ] Protocolo es el real del usuario ✓

Flujo Health:
- [ ] Dashboard carga datos (pasos, pulsaciones) ✓
- [ ] Si no hay datos, muestra vacío (no error) ✓

Flujo Chat:
- [ ] Mensaje enviado → Recibe respuesta IA ✓
- [ ] Historial se guarda en BD ✓
- [ ] Recargar página → Historial persiste ✓

Flujo Challenges:
- [ ] Carga desafíos actuales ✓
- [ ] Leaderboard funciona ✓
- [ ] Unirse a reto → Se guarda ✓

Offline:
- [ ] Funciona sin conexión (IndexedDB) ✓
- [ ] Sincroniza cuando vuelve conexión ✓
```

---

## 📊 RESUMEN DE TAREAS

| #             | Tarea                 | Archivo       | Tiempo   | Prioridad |
| ------------- | --------------------- | ------------- | -------- | --------- |
| **SOLICITUD** | Crear tablas Supabase | SQL           | 30 min   | 🔴        |
| **SOLICITUD** | Credenciales APIs     | .env          | 15 min   | 🔴        |
| **1**         | Mock data Profile     | Profile.tsx   | 30 min   | 🔴        |
| **2**         | Mock Health           | healthData.ts | 45 min   | 🔴        |
| **3**         | Nutrición persiste    | Nutrition.tsx | 20 min   | 🔴        |
| **4**         | Hidratación logs      | Hydration.tsx | 20 min   | 🟡        |
| **5**         | Fasting datos reales  | Fasting.tsx   | 45 min   | 🟡        |
| **6**         | Chat historial        | Chat.tsx      | 30 min   | 🟡        |
| **7**         | User stats reales     | App.tsx       | 15 min   | 🔴        |
| **8**         | Archivos duplicados   | Varios        | 10 min   | 🟡        |
| **9**         | Console.logs          | Varios        | 15 min   | 🟡        |
| **10**        | Testing completo      | Manual        | 30 min   | 🔴        |
|               | **TOTAL**             |               | **4-6h** |           |

---

## 🚀 ORDEN RECOMENDADO DE EJECUCIÓN

1. ✅ **Solicitud 1**: Crear tablas Supabase (BLOQUEA TODO)
2. ✅ **Solicitud 2**: Credenciales en .env
3. ✅ **TAREA 7**: Stats reales en App.tsx (fácil, depende otras)
4. ✅ **TAREA 1**: Mock data Profile
5. ✅ **TAREA 2**: Mock Health
6. ✅ **TAREA 3**: Nutrición
7. ✅ **TAREA 4**: Hidratación
8. ✅ **TAREA 5**: Fasting
9. ✅ **TAREA 6**: Chat
10. ✅ **TAREA 8**: Limpiar duplicados
11. ✅ **TAREA 9**: Console.logs
12. ✅ **TAREA 10**: Testing completo

---

## ✅ ANTES DE DEPLOYMENT

- [ ] Todas las solicitudes completadas
- [ ] Todas las tareas completadas
- [ ] Testing manual 100% ✓
- [ ] Build success sin warnings
- [ ] `.env.local` con credenciales reales
- [ ] No hay console.logs (solo debug)
- [ ] Firebase Hosting actualizado
- [ ] Dominio apuntando correctamente

---

## 📞 PREGUNTAS?

Si algo no está claro:

- Revisa `PRODUCTION_AUDIT.md` para detalles técnicos
- Revisa `READY_FOR_PRODUCTION.md` para resumen
- Este archivo tiene el plan paso a paso

**¡Vamos a hacerlo! 🚀**
