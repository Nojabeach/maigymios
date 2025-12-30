# 🏋️ Vitality - Tu Entrenador IA Personal

Una aplicación moderna de bienestar integral con IA que te ayuda a entrenar, monitorear tu nutrición e hidratación, y alcanzar tus objetivos de fitness.

## ✨ Características

- 🤖 **Chat con IA**: Asistente personal que te guía en tus entrenamientos
- 💪 **Rutinas de Entrenamiento**: Ejercicios personalizados sin equipamiento
- 🍎 **Monitoreo de Nutrición**: Registra y analiza tu consumo calórico
- 💧 **Control de Hidratación**: Recuerda beber agua y monitorea tu ingesta
- 🌙 **Dark Mode**: Interfaz elegante adaptada a cualquier hora del día
- 📱 **Responsive Design**: Funciona perfectamente en iPhone 12, iPad y todos los dispositivos
- 🔄 **Sincronización en Tiempo Real**: Tu progreso se sincroniza automáticamente
- 📴 **Modo Offline**: Sigue usando la app aunque no tengas conexión

## 🚀 Tecnologías

- **Frontend**: React 19 + TypeScript
- **Estilos**: Tailwind CSS + CSS Variables
- **Backend**: Supabase (PostgreSQL + Auth)
- **IA**: Google Generative AI (Gemini)
- **Build**: Vite
- **Deploy**: Firebase Hosting

## 📱 Instalación en iOS/iPad

### Opción 1: Web App (Recomendado)

1. Abre la URL en Safari: `https://maigymios.web.app`
2. Toca el botón "Compartir" (cuadrado con flecha hacia arriba)
3. Selecciona "Añadir a pantalla de inicio"
4. Elige un nombre y toca "Añadir"
5. ¡La app aparecerá como una app nativa!

### Opción 2: Acceso Directo

- Abre en Safari
- Menú: Archivo > Añadir a pantalla de inicio

## 💻 Instalación Local

### Requisitos

- Node.js 18+
- npm o yarn
- Cuenta de Supabase
- API Key de Google Generative AI

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/vitality-app.git
cd vitality-app

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus credenciales

# Desarrollo
npm run dev

# Compilar para producción
npm run build

# Desplegar
firebase deploy --project maigymios
```

## 🎨 Características de Diseño UI/UX

- **Color Scheme Optimizado**: Verde primario (#22c55e), púrpura secundario, naranja de acento
- **Tipografía**: Google Fonts (Inter + Poppins)
- **Animaciones Suaves**: Transiciones 250ms en interacciones
- **Safe Area**: Compatible con notch de iOS
- **Accesibilidad**: 44px mínimo en botones, contraste WCAG AA
- **Dark Mode Nativo**: Respeta preferencias del sistema
- **Performance**: Bundle de 731KB, carga en <2s

## 📐 Responsive Design

- **iPhone**: 375px - Optimizado para iPhone 12 (390x844)
- **iPad**: 768px+ - Interfaz adaptada para tablets
- **Desktop**: 1024px+ - Diseño multi-columna opcional

## 🔐 Seguridad

- Auth segura con Supabase
- Variables de entorno protegidas
- SSL/TLS en Firebase Hosting
- Rate limiting en API calls

## 📊 Estructura del Proyecto

```
src/
├── components/        # Componentes reutilizables
│   ├── Button.tsx     # Botón con variantes
│   ├── Card.tsx       # Card responsive
│   ├── Input.tsx      # Input mejorado
│   └── BottomNav.tsx  # Navegación inferior
├── views/             # Pantallas principales
│   ├── Home.tsx       # Dashboard
│   ├── Workout.tsx    # Entrenamientos
│   ├── Nutrition.tsx  # Nutrición
│   ├── Hydration.tsx  # Hidratación
│   ├── Chat.tsx       # IA Chat
│   └── ...
├── types.ts           # TypeScript types
├── index.css          # Estilos globales
├── App.tsx            # Componente raíz
└── main.tsx           # Entry point
```

## 🎯 Roadmap

- [ ] Notificaciones push
- [ ] Gráficos avanzados de progreso
- [ ] Integraciones con Apple Health
- [ ] Modo offline mejorado
- [ ] Comunidad y desafíos
- [ ] Planes de entrenamiento personalizados

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para cambios mayores, abre un issue primero.

## 📄 Licencia

MIT

## 📞 Soporte

- Email: soporte@vitality.app
- Issues: GitHub Issues
- Documentación: Wiki

---

**Hecho con ❤️ para tu salud y bienestar.**
