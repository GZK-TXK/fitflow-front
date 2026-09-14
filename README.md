# FitFlow — Frontend (Web App)

> React web application for FitFlow. Trainers manage their clients, exercises, routines and weekly calendar; clients access a read-only portal; and admins moderate accounts. Works together with the [FitFlow backend API](../fitflow-back).

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Sass](https://img.shields.io/badge/Sass-1.x-CC6699?logo=sass&logoColor=white)](https://sass-lang.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

[English](#english) | [Español](#espanol)

<a id="english"></a>
## English

### Overview

FitFlow's frontend is a single-page application (SPA) built with React and Vite. It consumes the FitFlow REST API and adapts the interface to the user's **role**: trainers manage clients, exercises, routines and the calendar; clients see their own portal; admins moderate accounts. Authentication uses a JWT kept **in memory** (never in `localStorage`) and supports Google sign-in via Firebase.

### Tech Stack

- **Library:** React 19
- **Build tool:** Vite 8 (Rolldown)
- **Routing:** React Router 7
- **Styling:** Sass (SCSS) with a design-token system
- **Icons:** `lucide-react`
- **Auth:** Firebase JS SDK (Google), JWT stored in memory
- **HTTP:** native `fetch` via a small wrapper

### Roles & Experience

- **Trainer** (`TRAINER`) — dashboard, clients, exercises, routines (with a builder), calendar, profile.
- **Admin** (`ADMIN`) — everything a trainer sees, plus an **Admin** area: panel with stats and a **Users** section (approve/activate/deactivate accounts and manage roles).
- **Client** (`CLIENT`) — a read-only **portal**: assigned routines and calendar, plus the trainer's contact details.

### Features

- Login and registration (email/password) and **Continue with Google**.
- New trainer accounts start **pending approval**; the app shows a clear message.
- Access is blocked with a clear message if the account is pending or disabled.
- Role-based routing and navigation (trainer/admin vs client).
- Clients CRUD, with a **grant/revoke portal access** action on the client page.
- Exercise library with category filter and video links.
- Routine builder (add/edit/remove exercises with sets, reps, weight, rest, order).
- **Calendar** to assign routines to dates (trainer) and view them (client).
- Profile page (name and phone shown to clients).
- Responsive layout with a mobile drawer navigation.
- Code-splitting: routes are lazy-loaded and Firebase is loaded on demand.

### Project Structure

```
fitflow-front/
├── index.html
├── vite.config.js
├── .env.example
├── public/                # favicon, manifest
└── src/
    ├── main.jsx  App.jsx
    ├── config/            # api.js, firebase.js
    ├── lib/               # apiClient.js, tokenStore.js
    ├── context/           # AuthContext.jsx
    ├── hooks/             # useAuth, useClients, useExercises, useWorkouts, useSchedule, useMe, useAdmin
    ├── components/
    │   ├── layout/        # AppLayout, Navbar, Sidebar, ProtectedRoute, AdminRoute, RoleRoute, RoleHome
    │   ├── ui/            # Button, Input, Modal, Spinner, Alert, ConfirmDialog, PageHeader, EmptyState, PageLoader
    │   ├── clients/  exercises/  workouts/  calendar/
    ├── pages/             # route pages
    ├── styles/            # SCSS (tokens, base, ui, patterns, per-feature)
    └── utils/
```

### Routes

**Public**
- `/login`, `/register`

**Trainer / Admin** (protected)
- `/` (dashboard), `/clients`, `/clients/:id`, `/exercises`, `/workouts`, `/workouts/:id`, `/schedule`, `/profile`

**Admin only** (protected)
- `/admin`, `/admin/users`, `/admin/subscriptions`

**Client portal** (protected)
- `/portal`, `/portal/workouts/:id`, `/portal/calendar`

### Getting Started

#### Requirements

- Node.js 18+
- The FitFlow backend API running (default `http://localhost:4000`)

#### Installation

```bash
git clone https://github.com/GZK-TXK/fitflow-front.git
cd fitflow-front
npm install
```

#### Environment

```bash
cp .env.example .env
```

Fill in the values (see the table below).

#### Run

```bash
npm run dev       # development (http://localhost:5173)
```

#### Build

```bash
npm run build     # production build (dist/)
npm run preview   # preview the production build
```

### Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:4000` |
| `VITE_FIREBASE_API_KEY` | Firebase web API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project id | `your-project` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `your-project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender id | `1234567890` |
| `VITE_FIREBASE_APP_ID` | Firebase app id | `1:1234:web:abcd` |

> All `VITE_*` variables are public (they are bundled into the client). Never put secrets here.

### Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the dev server (Vite) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint with Oxlint |

### Deployment

- **Hosting:** Vercel (SPA).
- **Production branch:** `develop`.
- **Build:** `npm run build` · **Output:** `dist`.
- A `vercel.json` rewrite sends all routes to `index.html` (SPA fallback).
- Set the `VITE_*` environment variables in Vercel before building.
- Backend CORS: add this site's origin to `FRONTEND_URL` on the backend.

### License

Proprietary — All rights reserved. © 2026 GZK-TXK.

No permission is granted to use, copy, modify, distribute or sublicense this software without prior written consent. See [LICENSE](LICENSE).

### Author

- GitHub: [@GZK-TXK](https://github.com/GZK-TXK)

---

<a id="espanol"></a>
## Español

### Descripción general

El frontend de FitFlow es una aplicación de página única (SPA) construida con React y Vite. Consume la API REST de FitFlow y adapta la interfaz al **rol** del usuario: los entrenadores gestionan clientes, ejercicios, rutinas y calendario; los clientes ven su propio portal; y los administradores moderan cuentas. La autenticación usa un JWT guardado **en memoria** (nunca en `localStorage`) y admite el login con Google vía Firebase.

### Stack

- **Librería:** React 19
- **Build:** Vite 8 (Rolldown)
- **Rutas:** React Router 7
- **Estilos:** Sass (SCSS) con sistema de tokens de diseño
- **Iconos:** `lucide-react`
- **Autenticación:** Firebase JS SDK (Google), JWT en memoria
- **HTTP:** `fetch` nativo mediante un wrapper propio

### Roles y experiencia

- **Entrenador** (`TRAINER`) — dashboard, clientes, ejercicios, rutinas (con constructor), calendario, perfil.
- **Admin** (`ADMIN`) — todo lo del entrenador, más un área **Admin**: panel con estadísticas y sección **Usuarios** (aprobar/activar/desactivar cuentas y gestionar roles).
- **Cliente** (`CLIENT`) — **portal** de solo lectura: rutinas asignadas y calendario, además de los datos de contacto de su entrenador.

### Características

- Login y registro (email/contraseña) y **Continuar con Google**.
- Las cuentas nuevas de entrenador quedan **pendientes de aprobación**; la app lo indica con un aviso claro.
- El acceso se bloquea con un mensaje claro si la cuenta está pendiente o desactivada.
- Rutas y navegación por rol (entrenador/admin vs cliente).
- CRUD de clientes, con acción de **dar/quitar acceso al portal** en la ficha del cliente.
- Biblioteca de ejercicios con filtro por categoría y enlaces a vídeo.
- Constructor de rutinas (añadir/editar/quitar ejercicios con series, reps, peso, descanso, orden).
- **Calendario** para asignar rutinas a fechas (entrenador) y consultarlas (cliente).
- Página de perfil (nombre y teléfono visibles para los clientes).
- Diseño responsive con navegación lateral deslizante en móvil.
- Code-splitting: rutas cargadas de forma diferida (`lazy`) y Firebase bajo demanda.

### Estructura del proyecto

```
fitflow-front/
├── index.html
├── vite.config.js
├── .env.example
├── public/                # favicon, manifest
└── src/
    ├── main.jsx  App.jsx
    ├── config/            # api.js, firebase.js
    ├── lib/               # apiClient.js, tokenStore.js
    ├── context/           # AuthContext.jsx
    ├── hooks/             # useAuth, useClients, useExercises, useWorkouts, useSchedule, useMe, useAdmin
    ├── components/
    │   ├── layout/        # AppLayout, Navbar, Sidebar, ProtectedRoute, AdminRoute, RoleRoute, RoleHome
    │   ├── ui/            # Button, Input, Modal, Spinner, Alert, ConfirmDialog, PageHeader, EmptyState, PageLoader
    │   ├── clients/  exercises/  workouts/  calendar/
    ├── pages/             # páginas de ruta
    ├── styles/            # SCSS (tokens, base, ui, patterns, por feature)
    └── utils/
```

### Rutas

**Públicas**
- `/login`, `/register`

**Entrenador / Admin** (protegidas)
- `/` (dashboard), `/clients`, `/clients/:id`, `/exercises`, `/workouts`, `/workouts/:id`, `/schedule`, `/profile`

**Solo admin** (protegidas)
- `/admin`, `/admin/users`, `/admin/subscriptions`

**Portal del cliente** (protegidas)
- `/portal`, `/portal/workouts/:id`, `/portal/calendar`

### Puesta en marcha

#### Requisitos

- Node.js 18+
- La API de FitFlow en marcha (por defecto `http://localhost:4000`)

#### Instalación

```bash
git clone https://github.com/GZK-TXK/fitflow-front.git
cd fitflow-front
npm install
```

#### Variables de entorno

```bash
cp .env.example .env
```

Después rellena los valores (ver la tabla de abajo).

#### Ejecución

```bash
npm run dev       # desarrollo (http://localhost:5173)
```

#### Build

```bash
npm run build     # build de producción (dist/)
npm run preview   # previsualiza el build de producción
```

### Variables de entorno

| Variable | Descripción | Ejemplo |
| --- | --- | --- |
| `VITE_API_URL` | URL base de la API del backend | `http://localhost:4000` |
| `VITE_FIREBASE_API_KEY` | API key web de Firebase | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Dominio de autenticación | `tu-proyecto.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Id del proyecto de Firebase | `tu-proyecto` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket de Storage | `tu-proyecto.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Sender id | `1234567890` |
| `VITE_FIREBASE_APP_ID` | App id | `1:1234:web:abcd` |

> Todas las variables `VITE_*` son **públicas** (se incrustan en el cliente). No pongas secretos aquí.

### Scripts

| Script | Descripción |
| --- | --- |
| `npm run dev` | Arranca el servidor de desarrollo (Vite) |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Previsualiza el build de producción |
| `npm run lint` | Linter con Oxlint |

### Despliegue

- **Hosting:** Vercel (SPA).
- **Rama de producción:** `develop`.
- **Build:** `npm run build` · **Salida:** `dist`.
- Un `vercel.json` redirige todas las rutas a `index.html` (fallback SPA).
- Configura las variables `VITE_*` en Vercel antes de construir.
- CORS del backend: añade el origen de este sitio a `FRONTEND_URL`.

### Licencia

Propietaria — Todos los derechos reservados. © 2026 GZK-TXK.

No se concede permiso para usar, copiar, modificar, distribuir ni sublicenciar este software sin consentimiento previo por escrito. Ver [LICENSE](LICENSE).

### Autor

- GitHub: [@GZK-TXK](https://github.com/GZK-TXK)
