<div align="center">
  <img src="public/icon.png" width="128" height="128" alt="Vitality Logo" style="border-radius: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.2);">
  <h1>💎 Vitality</h1>
  <p><strong>The Premium AI-Powered Health & Wellness Ecosystem</strong></p>
  
  [![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_4.1-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
</div>

---

## 🌟 Visión General

**Vitality** no es solo una aplicación de seguimiento; es un ecosistema de bienestar integral diseñado con una estética **Premium** y alma de inteligencia artificial. Inspirada en los estándares más altos de diseño nativo de iOS (Apple Health), Vitality ofrece una experiencia fluida, sofisticada y altamente personalizada para el usuario moderno.

> [!IMPORTANT]
> **Vitality Elite v2.5** ya está disponible con el nuevo motor de diseño basado en Tailwind 4, integración completa de Capacitor para iOS/Android y soporte para Google Gemini 2.5 Flash.

---

## 🚀 Características Principales

### 🧠 Inteligencia Artificial (Coach Vitality)
- **Asesoría en tiempo real**: Chat inteligente alimentado por Google Gemini que analiza tus estadísticas para darte consejos de salud personalizados.
- **Planes Dinámicos**: La IA ajusta tus recomendaciones basadas en tu progreso real de hidratación y ejercicio.

### 💪 Entrenamiento y Recuperación
- **Entrenamientos Premium**: Interfaz de video optimizada, instrucciones detalladas y seguimiento de repeticiones con diseño Apple-style.
- **Fasting (Ayuno Intermitente)**: Temporizador de alta precisión con protocolos personalizables y visualización de progreso.
- **Centro de Salud**: Dashboard crítico con pasos, sueño y frecuencia cardíaca (simulados para PWA).

### 🍎 Nutrición e Hidratación
- **Smart Nutrition**: Registro rápido de comidas con desglose calórico y sugerencias de la IA.
- **Hydration Tracking**: Visualizador circular avanzado con recordatorios y metas diarias personalizables.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Framework UI** | React 19 (Concurrency Mode) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS 4.1 (Next-gen Engine) |
| **Backend/Auth** | Supabase (PostgreSQL Realtime) |
| **Mobile Core** | Capacitor + PWA Standard |
| **IA Engine** | Google GenAI (Gemini 2.5 Flash) |
| **Hosting** | Firebase Hosting |

---

## 🏗️ Estructura del Proyecto

```text
src/
├── components/          # Elementos UI premium (Cards, Progress, Botones)
├── views/               # Pantallas (Workout, Nutrition, Fasting, Chat, etc.)
├── utils/               # Lógica de persistencia, Supabase e IA
├── App.tsx              # Orquestador de rutas y autenticación
├── constants.ts         # Activos e imágenes globales
├── index.css            # Sistema de diseño Tailwind 4
└── types.ts             # Definiciones de TypeScript
```

---

## 📱 Experiencia Móvil de Primera Clase

Vitality está optimizada para ser instalada como una **PWA (Progressive Web App)**, ofreciendo una experiencia idéntica a una aplicación nativa.

### Instalación en iOS:
1. Navega a **[maigymios.web.app](https://maigymios.web.app)** en Safari.
2. Pulsa el icono de **Compartir** 📤.
3. Elige **"Añadir a la pantalla de inicio"** ➕.

---

## 📥 Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nojabeach/maigymios.git
cd maigymios

# 2. Instalar dependencias
npm install

# 3. Configuración de Entorno
# Crea un archivo .env.local con:
# VITE_SUPABASE_URL=...
# VITE_SUPABASE_ANON_KEY=...
# VITE_GOOGLE_API_KEY=...

# 4. Iniciar Desarrollo
npm run dev
```

---

<div align="center">
  <p>Desarrollado con pasión para transformar el fitness digital.</p>
  <strong>Vitality Development Team</strong>
</div>
