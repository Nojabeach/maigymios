# Guía Completa: Obtener API Keys para Vitality App

## 📋 Resumen

Tu archivo `.env.local` necesita 3 API keys adicionales para funcionalidades avanzadas:

1. **Google Generative AI** - Para el chat con IA
2. **Google Analytics 4** - Para métricas de uso
3. **Sentry** - Para monitoreo de errores

---

## 1. Google Generative AI (Gemini) API Key

### ¿Para qué sirve?
Permite que el Chat de IA funcione en tu app (vista Chat.tsx).

### Cómo obtenerla:

#### Paso 1: Ir a Google AI Studio
1. Ve a [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google

#### Paso 2: Crear API Key
1. Haz clic en **"Create API Key"**
2. Selecciona un proyecto de Google Cloud (o crea uno nuevo)
3. Copia la clave que aparece (formato: `AIza...`)

#### Paso 3: Añadir al .env.local
```bash
VITE_GOOGLE_API_KEY=AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### ⚠️ Notas Importantes:
- **GRATIS**: 60 requests/minuto
- **Límites**: Suficiente para desarrollo y pruebas
- Si necesitas más, activa facturación en Google Cloud
- Más info: [https://ai.google.dev/pricing](https://ai.google.dev/pricing)

---

## 2. Google Analytics 4 (GA4) - Measurement ID

### ¿Para qué sirve?
Rastrea cuántos usuarios usan tu app, qué pantallas visitan, etc.

### Cómo obtenerlo:

#### Paso 1: Ir a Google Analytics
1. Ve a [https://analytics.google.com](https://analytics.google.com)
2. Inicia sesión con tu cuenta de Google

#### Paso 2: Crear Propiedad
1. Si no tienes cuenta, crea una nueva:
   - **Nombre de cuenta**: Vitality App
   - **Nombre de propiedad**: Vitality Web
   - **Zona horaria**: Tu zona
   - **Moneda**: EUR

#### Paso 3: Configurar Data Stream
1. En la propiedad creada, ve a **Admin** (⚙️ abajo izquierda)
2. En la columna "Property", clic en **Data Streams**
3. Clic en **Add Stream** > **Web**
4. **Website URL**: `https://maigymios.web.app`
5. **Stream name**: Vitality Production

#### Paso 4: Copiar Measurement ID
1. Después de crear el stream, verás el **Measurement ID**
2. Tiene formato: `G-XXXXXXXXXX`
3. Copia ese ID

#### Paso 5: Añadir al .env.local
```bash
VITE_GA_ID=G-ABC123DEF4
```

### 📊 Ver Estadísticas:
Después de desplegar con la clave, ve a Google Analytics > Reports para ver:
- Usuarios activos en tiempo real
- Páginas más visitadas
- Ubicación geográfica de usuarios
- Dispositivos usados

---

## 3. Sentry DSN (Error Tracking)

### ¿Para qué sirve?
Captura errores de JavaScript en producción y te los envía automáticamente.

### Cómo obtenerlo:

#### Paso 1: Crear Cuenta en Sentry
1. Ve a [https://sentry.io/signup/](https://sentry.io/signup/)
2. Crea una cuenta gratuita (con GitHub o email)
3. El plan gratuito incluye **5,000 errores/mes** (suficiente)

#### Paso 2: Crear Proyecto
1. Una vez dentro, clic en **"Create Project"**
2. **Platform**: Selecciona **React**
3. **Alert Frequency**: "Alert me on every new issue"
4. **Project Name**: `vitality-app`
5. Clic en **"Create Project"**

#### Paso 3: Obtener DSN
1. Verás una pantalla de configuración
2. Busca el campo **DSN (Data Source Name)**
3. Tiene formato: `https://[hash]@o[org-id].ingest.sentry.io/[project-id]`
4. Copia toda la URL

#### Paso 4: Añadir al .env.local
```bash
VITE_SENTRY_DSN=https://abcd1234567890@o123456.ingest.sentry.io/7890123
```

### 🔍 Ver Errores:
Después de desplegar:
1. Ve a tu proyecto en Sentry
2. **Issues**: Verás todos los errores que ocurran
3. Incluye:
   - Stack trace completo
   - Navegador del usuario
   - URL donde ocurrió
   - User ID (si está logueado)

---

## ✅ Verificación Final

Tu `.env.local` completo debería verse así:

```bash
# Supabase Configuration (YA TIENES ESTO)
VITE_SUPABASE_URL=https://lqthrfsvljirorypgvmi.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-actual

# Google Generative AI (NUEVO)
VITE_GOOGLE_API_KEY=AIzaSyDxxxxx...

# Google Analytics 4 (NUEVO)
VITE_GA_ID=G-ABC123DEF4

# Sentry Error Tracking (NUEVO)
VITE_SENTRY_DSN=https://abcd@o123.ingest.sentry.io/789

# Environment
VITE_ENV=production
```

---

## 🚀 Activar las Nuevas Features

Después de añadir las claves:

```bash
# Reiniciar el servidor de desarrollo
npm run dev
```

O si lo despliegas:

```bash
npm run build
firebase deploy --only hosting
```

---

## 🆓 Resumen de Costos

| Servicio | Plan Gratuito | Límite |
|----------|---------------|--------|
| Google AI (Gemini) | ✅ Gratis | 60 req/min |
| Google Analytics | ✅ Gratis | Ilimitado |
| Sentry | ✅ Gratis | 5,000 errors/mes |

**Todas son GRATIS para tu nivel de tráfico actual** 🎉

---

## ❓ FAQ

**P: ¿Son obligatorias todas?**
R: No. La app funciona sin ellas, pero sin:
- Google AI: El chat no responderá
- Analytics: No verás estadísticas
- Sentry: No recibirás alertas de errores

**P: ¿Se pueden compartir entre proyectos?**
R: Sí, pero es mejor tener una por proyecto para separar métricas.

**P: ¿Son seguras en el .env.local?**
R: Sí, `.env.local` está en `.gitignore`, nunca se sube a GitHub.

---

## 📞 Enlaces Rápidos

- Google AI Studio: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- Google Analytics: [https://analytics.google.com](https://analytics.google.com)
- Sentry: [https://sentry.io](https://sentry.io)
