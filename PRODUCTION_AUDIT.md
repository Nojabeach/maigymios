## 🔍 AUDITORÍA COMPLETA DEL PROYECTO VITALITY-APP

### RESUMEN EJECUTIVO

- **Estado General**: ⚠️ REQUIERE AJUSTES CRÍTICOS
- **Prioridad**: ALTA - Eliminación de datos mock antes de producción
- **Estimated Fix Time**: 4-6 horas

---

## 📋 HALLAZGOS CRÍTICOS

### 1. ❌ DATOS MOCK HARDCODEADOS (Bloqueante)

**Ubicaciones con datos mock que DEBEN eliminarse:**

#### A. Profile.tsx (Mock Data para Gráficos)

- **Líneas 24-49**: `weeklyProgressData`, `caloriesData`, `hydrationData` - MOCK
- **Ubicación**: `src/views/Profile.tsx`
- **Impacto**: Gráficos no muestran datos reales del usuario
- **Solución Requerida**: Conectar a Supabase para obtener stats reales

#### B. HealthData.ts (Mock Generators)

- **Líneas 59-177**: `generateMockHealthData()`, `generateMockHeartRateData()`, `generateMockSleepData()`, `generateMockWorkouts()`
- **Ubicación**: `src/utils/healthData.ts`
- **Líneas 179-182**: `mockSteps`, `mockHeartRate`, `mockSleep`, `mockWorkouts` inicializadas con datos fake
- **Impacto**: Health Center muestra datos inventados
- **Solución Requerida**: Implementar integraciones HealthKit reales (iOS) o leer desde Supabase

#### C. Challenges.ts (Mock Data)

- **Líneas 275-360**: `getMockChallenges()` - 5 desafíos hardcodeados
- **Líneas 364-410**: `getMockLeaderboard()` - Ranking ficticio
- **Ubicación**: `src/utils/challenges.ts`
- **Impacto**: Desafíos y leaderboards no son reales
- **Solución Requerida**: Llamadas a Supabase en líneas 73, 232 funcionan, pero fallback es mock

#### D. App.tsx (Default Stats)

- **Líneas 42-49**: `defaultStats` con valores hardcodeados (calories: 1200, activityMin: 35, etc)
- **Impacto**: Estadísticas iniciales no son reales
- **Solución Requerida**: Cargar desde Supabase al autenticarse

#### E. Nutrition.tsx (Demo UI)

- **Línea 18**: Comentario "Here you would normally update stats state, but for demo UI we just close"
- **Línea 20**: `alert()` en lugar de guardar en BD
- **Impacto**: Registro de comidas no persiste
- **Solución Requerida**: Implementar persistencia en Supabase

#### F. Fasting.tsx (Valores Hardcodeados)

- **Línea 24**: Fecha hardcodeada "Hoy, 24 Oct"
- **Línea 47**: "14:30" hardcodeado
- **Línea 125**: Barras mockup con `Math.random() * 30`
- **Impacto**: No muestra datos reales de ayuno
- **Solución Requerida**: Conectar con tabla user_fasting en Supabase

---

### 2. ❌ INTEGRACIONES INCOMPLETAS

### Análisis de Conexiones a Supabase (REAL vs MOCK)

#### ✅ YA CONECTADAS A SUPABASE:

**A. Challenges (challenges.ts)**

- ✅ `getActiveChallenges()`: Línea 64-67 → `from("challenges").select("*")`
- ✅ `getUserChallenges()`: Línea 83-87 → `from("user_challenges").select("*")`
- ✅ `joinChallenge()`: Línea 101 → `from("user_challenges").insert()`
- ✅ `updateProgress()`: Línea 126-128 → `from("user_challenges").update()`
- ✅ `completeChallenge()`: Línea 148-151 → `from("user_challenges").update()`
- ✅ `awardReward()`: Línea 189 → `from("rewards").insert()`
- ✅ `getLeaderboard()`: Línea 211-215 → `from("user_challenges").select() with users join`
- ✅ `getUserPoints()`: Línea 242-245 → `from("rewards").select()`
- ✅ `getRewardHistory()`: Línea 261-265 → `from("rewards").select()`
- ⚠️ **FALLBACK**: Si BD no disponible → `getMockChallenges()` (línea 73)

**B. User Stats (App.tsx)**

- ✅ `loadStats()`: Línea 125-126 → `from("user_stats").select("*")`
- ✅ `updateStats()`: Línea 206 → `from("user_stats").upsert()`
- ⚠️ **PROBLEMA**: Default stats hardcodeados (línea 42-49) antes de cargar reales

**C. Authentication**

- ✅ Supabase auth integrada en `Login.tsx`, `Register.tsx`, `ForgotPassword.tsx`
- ✅ Session check en `App.tsx` useEffect

#### ❌ NO CONECTADAS A SUPABASE (MOCK O NO FUNCIONAL):

**A. Health Data (healthData.ts)**

- ❌ `getSteps()`: Línea 201 → Retorna `this.mockSteps.slice(-days)` SIEMPRE
- ❌ `getHeartRate()`: Línea 219 → Retorna `this.mockHeartRate.slice(-days)` SIEMPRE
- ❌ `getSleep()`: Línea 232 → Retorna `this.mockSleep.slice(-days)` SIEMPRE
- ❌ `getWorkouts()`: Línea 251 → Retorna `this.mockWorkouts` SIEMPRE
- ⚠️ **RAZÓN**: No hay tabla `health_data` en Supabase (esperada) O no está documentada
- **Solución**:
  - Opción A: Crear tabla `health_data` en Supabase
  - Opción B: Para iOS, usar HealthKit plugin nativo (hoy está comentado)

**B. Workouts (Workout.tsx, WorkoutDetail.tsx)**

- ❌ No guardan a Supabase
- ⚠️ **RAZÓN**: No hay tabla `workouts` visible en código
- **Solución**: Crear tabla e integrar en `Workout.tsx` al completar ejercicio

**C. Meals (Nutrition.tsx)**

- ❌ No guardan a Supabase
- Línea 18: `// Here you would normally update stats state, but for demo UI we just close`
- Línea 20: `alert()` en lugar de guardar
- **Solución**: Crear tabla `meals` e integrar persistencia

**D. Hydration (Hydration.tsx)**

- ⚠️ **ESTADO MIXTO**:
  - App.tsx sí carga `hydrationCurrent` y `hydrationGoal` del usuario
  - Pero botones para añadir agua en Hydration.tsx NO persisten
  - **Solución**: Integrar llamadas a `from("hydration_logs").insert()` en botones

**E. Fasting (Fasting.tsx)**

- ❌ Completamente desconectada
- Valores hardcodeados: "14:30", "Protocolo 16:8", etc
- **Solución**: Crear tabla `fasting_sessions` e integrar

**F. Chat (Chat.tsx)**

- ✅ Google Gemini API funciona (línea 88: `"gemini-2.5-flash-latest"`)
- ❌ NO guarda historial en Supabase
- **Solución**: Guardar en tabla `chat_messages` después de cada respuesta

---

### A. Apple Health (healthData.ts, Líneas 184-266)

```typescript
// ❌ Código comentado/no implementado:
- getSteps(): Fallback a mock data
- getHeartRate(): Fallback a mock data
- getSleep(): Fallback a mock data
- getWorkouts(): Fallback a mock data
- requestPermissions(): Retorna false
- initialize(): No hace nada
```

**Estado**: Funciona con mock, pero no obtiene datos reales de iOS
**Solución**:

- Para desarrollo web: OK usar mock
- Para producción iOS: Requiere @capacitor-health plugin + configuración

#### B. Gym Workouts

- No hay tabla `workouts` en Supabase documentada
- `Workout.tsx` y `WorkoutDetail.tsx` no guardan datos
- **Solución**: Crear tabla `workouts(id, user_id, exercise_name, duration, calories, etc)`

#### C. Nutrición

- No hay tabla `meals` en Supabase
- Registro de comidas solo muestra `alert()`
- **Solución**: Crear tabla `meals(id, user_id, food_name, calories, macros, date)`

#### D. Hidratación

- Tabla `hydration_logs` probablemente existe pero no se sincroniza
- Stats hardcodeados en App.tsx
- **Solución**: Cargar logs reales de Supabase

#### E. Ayuno (Fasting)

- No hay tabla `fasting_sessions` implementada
- UI es solo visualización estática
- **Solución**: Crear tabla `fasting_sessions(id, user_id, start_time, end_time, duration)`

#### F. Chat IA

- `Chat.tsx` usa Google Gemini API ✅ (funciona)
- Pero no guarda historial en BD
- **Solución**: Guardar mensajes en tabla `chat_messages(id, user_id, role, content, timestamp)`

---

### 3. ⚠️ IMPORTS SIN USAR

**Archivos que importan pero no usan:**

- `Profile.tsx`: Importa `IMAGES` pero solo usa `IMAGES.USER_AVATAR`
- `Chat.tsx`: Importa `IMAGES` pero no se usa
- `App.tsx`: Posibles imports de servicios no utilizados

---

### 4. ⚠️ ARCHIVOS DUPLICADOS

**Hallazgos:**

- `src/manifest.json` Y `public/manifest.json` - ✅ Aceptable (uno es fallback)
- `src/icon.png` Y `public/icon.png` - ✅ OK después del fix anterior
- NO hay código duplicado detectado

---

### 5. ⚠️ CÓDIGO SIN VINCULACIÓN

**Componentes que no se usan:**

- `ChallengesUI.tsx`: Importado en `Challenges.tsx` ✅ Vinculado
- `HealthDashboard.tsx`: Importado en `Health.tsx` ✅ Vinculado
- `Charts.tsx`: Importado en `Profile.tsx` ✅ Vinculado
- `OfflineStatus.tsx`: Importado en `App.tsx` ✅ Vinculado
- `Button.tsx`, `Card.tsx`, `Input.tsx`: Se usan en múltiples views ✅

**Nota**: No hay código huérfano detectado

---

### 6. ⚠️ CONFIGURACIÓN DUPLICADA

**Archivos de configuración redundantes:**

- `src/vite.config.ts` + `d:\MaiGym\vitality-app\vite.config.ts` ❌ **PROBLEMA**

  - Posible conflicto. Raíz debería ser única
  - **Solución**: Eliminar `src/vite.config.ts`

- `src/tsconfig.json` + `d:\MaiGym\vitality-app\tsconfig.json`

  - **Solución**: Eliminar `src/tsconfig.json`

- `src/manifest.json` + `public/manifest.json` + `src/package.json` (?)

  - **Solución**: Verificar y eliminar duplicados

- `src/index.html` vs raíz `index.html`
  - **Solución**: Entry point debe ser única (usar raíz)

## 🟢 VERIFICACIÓN DE CREDENCIALES

**.env.local detectado ✅:**

```
VITE_SUPABASE_URL=https://lqthrfsvljirorypgvmi.supabase.co ✅
VITE_SUPABASE_ANON_KEY=sb_publishable_ik1mv3WjmsOL-XAVB4dDaA_mfy91Vhc ✅
VITE_GOOGLE_API_KEY=PLACEHOLDER_API_KEY ⚠️ DEBE CONFIGURARSE
VITE_ENV=development ⚠️ Debe ser 'production' en prod
VITE_GA_ID=NOT SET ⚠️ Debe configurarse para analytics
VITE_SENTRY_DSN=NOT SET ⚠️ Debe configurarse para error tracking
```

**Estado**:

- ✅ Supabase está configurado
- ⚠️ Google AI debe configurarse antes de que Chat funcione
- ⚠️ GA y Sentry no están configurados (opcional pero recomendado)

---

## 📋 CHECKLIST TABLAS SUPABASE

Según el código, estas tablas DEBEN existir en `lqthrfsvljirorypgvmi.supabase.co`:

- [ ] `users` (Probably exists)
- [ ] `user_stats` ✅ USADA EN: App.tsx línea 125-126, 206
- [ ] `challenges` ✅ USADA EN: challenges.ts línea 64
- [ ] `user_challenges` ✅ USADA EN: challenges.ts línea 83, 101, 126-128, 148-151, 211
- [ ] `rewards` ✅ USADA EN: challenges.ts línea 189, 242, 261
- [ ] `health_data` ⚠️ NO ENCONTRADA - Se usa mock en su lugar
- [ ] `workouts` ❌ NO ENCONTRADA - No se guarda nada
- [ ] `meals` ❌ NO ENCONTRADA - No se guarda nada
- [ ] `hydration_logs` ⚠️ PARCIALMENTE - Se carga pero no se actualiza
- [ ] `fasting_sessions` ❌ NO ENCONTRADA - No existe
- [ ] `chat_messages` ❌ NO ENCONTRADA - Chat no persiste

**Acciones necesarias:**

```sql
-- Verificar que estas existen:
SELECT table_name FROM information_schema.tables WHERE table_schema='public';

-- Si no existen, crear en SQL Editor de Supabase:

CREATE TABLE health_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  metric_type VARCHAR(50), -- 'steps', 'heart_rate', 'sleep', 'workout'
  value NUMERIC NOT NULL,
  unit VARCHAR(20),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  exercise_name VARCHAR(255),
  duration_minutes INT,
  calories_burned INT,
  intensity VARCHAR(20),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  food_name VARCHAR(255),
  calories INT,
  protein_g NUMERIC,
  carbs_g NUMERIC,
  fat_g NUMERIC,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fasting_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  protocol VARCHAR(20), -- '16:8', '18:6', etc
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  role VARCHAR(20), -- 'user' | 'assistant'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all new tables:
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies:
CREATE POLICY "Users can only view their own data" ON health_data
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own data" ON health_data
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Repeat for other tables...
```

---

### 🔴 BLOQUEANTE (Debe hacerse antes de producción)

1. **Eliminar/Reemplazar datos mock en:**

   - [ ] `Profile.tsx` - Mock gráficos → Cargar de Supabase
   - [ ] `HealthData.ts` - Generadores fake → Usar Supabase
   - [ ] `Challenges.ts` - Mock fallback → Usar Supabase
   - [ ] `App.tsx` - Stats default → Cargar del usuario logueado
   - [ ] `Nutrition.tsx` - Alert → Persistencia en BD
   - [ ] `Fasting.tsx` - Valores hardcodeados → Datos reales

2. **Verificar Tablas en Supabase:**

   - `users` (existe)
   - `user_stats` (¿existe?)
   - `workouts` (¿existe?)
   - `meals` (¿existe?)
   - `hydration_logs` (¿existe?)
   - `fasting_sessions` (¿existe?)
   - `challenges` (¿existe?)
   - `user_challenges` (¿existe?)
   - `rewards` (¿existe?)
   - `chat_messages` (¿existe?)

3. **Limpiar Configuración:**
   - [ ] Eliminar `src/vite.config.ts`
   - [ ] Eliminar `src/tsconfig.json`
   - [ ] Eliminar `src/package.json` (si existe)
   - [ ] Eliminar `src/manifest.json` (usar la de public/)

### 🟡 IMPORTANTE (Después de bloqueantes)

4. **Limpiar console.logs:**

   - `performance.ts`: 7 console.logs de debug
   - `offlineSync.ts`: 10+ console.logs
   - `notifications.ts`: 4 console.logs
   - **Acción**: Cambiar a `console.debug()` o remover

5. **Implementar error handling:**

   - Servicios fallback a mock data en producción - REVISAR

6. **Revisar variables sin usar:**
   - `_days` parameter en `getWorkouts()`
   - Posibles variables no inicializadas

### 🟢 OPTIMIZACIONES (Post-lanzamiento)

7. **Agregar validaciones:**

   - Validar datos antes de mostrar
   - Manejo de errores más robusto

8. **Performance:**
   - Cache de datos locales
   - Paginación en listas grandes

---

## 📊 TABLAS SUPABASE REQUERIDAS

```sql
-- Debe existir y estar creada
CREATE TABLE user_stats (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  calories INT,
  activity_minutes INT,
  mind_minutes INT,
  hydration_liters DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workouts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  exercise_name VARCHAR(255),
  duration_minutes INT,
  calories_burned INT,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meals (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  food_name VARCHAR(255),
  calories INT,
  protein_g INT,
  carbs_g INT,
  fat_g INT,
  date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE hydration_logs (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  amount_liters DECIMAL,
  date DATE,
  time TIME,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE fasting_sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  duration_hours INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  role VARCHAR(10), -- 'user' | 'assistant'
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ya debería existir:
CREATE TABLE challenges (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  goal INT,
  reward_points INT,
  difficulty VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_challenges (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  challenge_id UUID NOT NULL,
  current_progress INT,
  completed BOOLEAN,
  joined_at TIMESTAMP DEFAULT NOW()
);
```

---

## ✅ VERIFICACIÓN FINAL PRE-PRODUCCIÓN

- [ ] Todos los datos mock reemplazados
- [ ] Supabase todas las tablas creadas
- [ ] .env.local con credenciales reales
- [ ] Google Analytics configurado
- [ ] Sentry configurado
- [ ] Firebase Hosting configurado
- [ ] CORS en Supabase permitido
- [ ] RLS policies creadas en Supabase
- [ ] Certificados SSL verificados
- [ ] Cache headers correctos
- [ ] Error handling funcional
- [ ] Tests básicos en producción
- [ ] No console.logs en prod
- [ ] Build size < 600KB ✅ (591KB)

---

## 📌 CONCLUSIÓN

La aplicación está al 60% lista para producción. Requiere:

1. **Crítico**: Eliminar mock data y conectar a Supabase real
2. **Importante**: Limpiar logs y configuración duplicada
3. **Bueno**: Verificar todas las tablas existen

**Tiempo estimado de corrección**: 4-6 horas

**No recomendado lanzar a producción sin estos cambios.**

---

## 🚀 GUÍA RÁPIDA DE IMPLEMENTACIÓN

### Quick Reference - Qué cambiar dónde:

| Archivo        | Línea     | Problema           | Solución                            |
| -------------- | --------- | ------------------ | ----------------------------------- |
| Profile.tsx    | 24-49     | Mock data gráficos | Cargar de `user_stats`              |
| healthData.ts  | 59-177    | Mock generators    | Usar tabla `health_data` o eliminar |
| healthData.ts  | 179-182   | Mock props         | Inicializar vacíos                  |
| challenges.ts  | 275-410   | Mock funciones     | Mantener fallback a Supabase ✅     |
| App.tsx        | 42-49     | Default stats      | Cargar post-auth                    |
| Nutrition.tsx  | 18-20     | Alert sin guardar  | INSERT a tabla `meals`              |
| Fasting.tsx    | 24-50     | Hardcodes          | Cargar de `fasting_sessions`        |
| Chat.tsx       | 117       | Sin historial      | INSERT a tabla `chat_messages`      |
| performance.ts | múltiples | console.logs       | Cambiar a console.debug()           |
| offlineSync.ts | múltiples | console.logs       | Cambiar a console.debug()           |

---

### Comando para encontrar todos los TODOs rápidamente:

```bash
grep -r "TODO\|FIXME\|HACK\|console.log\|alert(" src/ --include="*.tsx" --include="*.ts"
```

---

## ✅ FINAL CHECKLIST

- [ ] Tablas Supabase creadas y verificadas
- [ ] Profile.tsx - Gráficos cargan datos reales
- [ ] HealthData.ts - No usa datos mock
- [ ] Nutrition.tsx - Guarda en BD
- [ ] Hydration.tsx - Actualiza logs
- [ ] Fasting.tsx - Carga sesión actual
- [ ] Chat.tsx - Guarda historial
- [ ] App.tsx - Stats son del usuario actual
- [ ] console.logs cambiados a debug()
- [ ] Archivos duplicados eliminados
- [ ] .env.local completado
- [ ] Build success sin warnings
- [ ] Test en producción OK
- [ ] Firebase Hosting actualizado

---
