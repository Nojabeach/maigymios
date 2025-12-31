-- ================================================
-- VITALITY APP - DYNAMIC CONTENT MIGRATION
-- ================================================
-- Run this in your Supabase SQL Editor
-- Project: https://supabase.com/dashboard/project/[your-project-id]/sql

-- ================================================
-- 1. CREATE EXERCISES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('Piernas', 'Brazos', 'Core', 'Cardio', 'Flexibilidad')),
  sets_reps TEXT,
  image_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('Principiante', 'Intermedio', 'Avanzado')),
  duration_minutes INT DEFAULT 10,
  calories_estimate INT DEFAULT 30,
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read exercises
CREATE POLICY "Exercises are viewable by authenticated users"
  ON public.exercises FOR SELECT
  TO authenticated
  USING (is_active = true);

-- ================================================
-- 2. SEED EXERCISES DATA
-- ================================================
INSERT INTO public.exercises (name, description, category, sets_reps, image_url, difficulty, duration_minutes, calories_estimate, display_order, is_active) VALUES
('Sentadillas Asistidas', 'Usa una silla para equilibrio. Perfecto para fortalecer piernas sin impacto.', 'Piernas', '3 x 10 rep', '/assets/exercise-squat.jpg', 'Principiante', 10, 30, 1, true),
('Flexiones en Pared', 'Pecho y brazos sin impacto. Ideal para comenzar a ganar fuerza.', 'Brazos', '3 x 8 rep', '/assets/exercise-pushup.jpg', 'Principiante', 8, 25, 2, true),
('Zancadas Alternas', 'Fortalece piernas y glúteos con este movimiento funcional.', 'Piernas', '3 x 10 rep', '/assets/workout-yoga.jpg', 'Intermedio', 12, 40, 3, true),
('Plancha Abdominal', 'Fortalece el core y mejora la postura corporal.', 'Core', '3 x 30 seg', '/assets/workout-header.jpg', 'Intermedio', 5, 20, 4, true),
('Elevación de Talones', 'Trabaja los gemelos y mejora el equilibrio.', 'Piernas', '3 x 15 rep', '/assets/exercise-squat.jpg', 'Principiante', 7, 20, 5, true),
('Puente de Glúteos', 'Activa glúteos y fortalece la zona lumbar.', 'Piernas', '3 x 12 rep', '/assets/workout-yoga.jpg', 'Principiante', 8, 25, 6, true)
ON CONFLICT DO NOTHING;

-- ================================================
-- 3. CREATE USER PREFERENCES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_calorie_target INT DEFAULT 1800,
  daily_steps_target INT DEFAULT 10000,
  daily_water_target DECIMAL(3,1) DEFAULT 2.5,
  workout_reminder_time TIME,
  meal_reminder_enabled BOOLEAN DEFAULT true,
  preferred_workout_time TEXT CHECK (preferred_workout_time IN ('morning', 'afternoon', 'evening')),
  fitness_level TEXT CHECK (fitness_level IN ('Principiante', 'Intermedio', 'Avanzado')) DEFAULT 'Principiante',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can only read their own preferences
CREATE POLICY "Users can view own preferences"
  ON public.user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON public.user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON public.user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================
-- 4. CREATE FUNCTION TO AUTO-CREATE PREFERENCES
-- ================================================
CREATE OR REPLACE FUNCTION public.handle_new_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id, daily_calorie_target, daily_steps_target, fitness_level)
  VALUES (
    NEW.id,
    1800,
    10000,
    'Principiante'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create preferences for new users
DROP TRIGGER IF EXISTS on_auth_user_created_preferences ON auth.users;
CREATE TRIGGER on_auth_user_created_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_preferences();

-- ================================================
-- 5. CREATE FEATURED CONTENT TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS public.featured_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT CHECK (content_type IN ('workout', 'nutrition', 'challenge')),
  image_url TEXT,
  duration_text TEXT, -- e.g., "20 min"
  difficulty TEXT,
  calories_text TEXT, -- e.g., "350 kcal"
  is_active BOOLEAN DEFAULT true,
  priority INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.featured_content ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read featured content
CREATE POLICY "Featured content is viewable by authenticated users"
  ON public.featured_content FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Seed featured content
INSERT INTO public.featured_content (title, description, content_type, image_url, duration_text, difficulty, calories_text, priority, is_active) VALUES
('Movilidad Total y Fuerza', 'Rutina completa para mejorar flexibilidad y ganar músculo', 'workout', '/assets/workout-header.jpg', '20 min', 'Principiante', '350 kcal', 1, true),
('Ensalada César Fit', 'Equilibrio perfecto de macros para tu día', 'nutrition', '/assets/meal-salad.jpg', '15 min prep', NULL, '450 kcal', 1, true)
ON CONFLICT DO NOTHING;

-- ================================================
-- 6. HELPFUL QUERIES FOR VERIFICATION
-- ================================================
-- View all exercises
-- SELECT * FROM exercises WHERE is_active = true ORDER BY display_order;

-- View user preferences
-- SELECT * FROM user_preferences WHERE user_id = auth.uid();

-- View featured content
-- SELECT * FROM featured_content WHERE is_active = true ORDER BY priority DESC;

-- ================================================
-- MIGRATION COMPLETE
-- ================================================
-- Next steps:
-- 1. Run this entire script in Supabase SQL Editor
-- 2. Verify tables were created: Check Database > Tables
-- 3. Update application code to fetch from these tables
-- 4. Test with a real user login
