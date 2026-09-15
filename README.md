# FitFlow — Frontend (Web App)

> React web application for FitFlow. Trainers manage their clients, exercises, routines and weekly calendar; clients access a read-only portal; and admins moderate accounts. Includes profile photos, a guided FAQ assistant and real-time presence. Works together with the [FitFlow backend API](../fitflow-back).

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![React Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Sass](https://img.shields.io/badge/Sass-1.x-CC6699?logo=sass&logoColor=white)](https://sass-lang.com)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?logo=socket.io&logoColor=white)](https://socket.io)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

[English](#english) | [Español](#espanol)

<a id="english"></a>
## English

### Overview

FitFlow's frontend is a single-page application (SPA) built with React and Vite. It consumes the FitFlow REST API and adapts the interface to the user's **role**: trainers manage clients, exercises, routines and the calendar; clients see their own portal; admins moderate accounts. Authentication uses a JWT kept **in memory** (never in `localStorage`) and supports Google sign-in via Firebase. It also provides profile photos, a guided FAQ assistant and real-time presence over Socket.IO.

### Tech Stack

- **Library:** React 19
- **Build tool:** Vite 8 (Rolldown)
- **Routing:** React Router 7
- **Styling:** Sass (SCSS) with a design-token system
- **Icons:** `lucide-react`
- **Auth:** Firebase JS SDK (Google), JWT stored in memory
- **Real-time:** Socket.IO client
- **API docs:** `swagger-ui-react` (admin-only page)
- **HTTP:** native `fetch` via a small wrapper

### Roles & Experience

- **Trainer** (`TRAINER`) — dashboard, clients, exercises, routines (with a builder), calendar, profile.
- **Admin** (`ADMIN`) — everything a trainer sees, plus an **Admin** area: panel with stats and a **Users** section (approve/activate/deactivate accounts, manage roles, see who is online).
- **Client** (`CLIENT`) — a read-only **portal**: assigned routines, calendar, own profile and the trainer's contact details.

### Features

- Login and registration (email/password) and **Continue with Google**.
- **Invitation-based registration**: sign up from an invite link (`/register?invite=...`).
- New trainer accounts start **pending approval**; the app shows a clear message.
- Access is blocked with a clear message if the account is pending or disabled.
- Role-based routing and navigation (trainer/admin vs client).
- Clients CRUD, with a **grant/revoke portal access** action on the client page.
- Exercise library with category filter and a **video modal**.
- Routine builder (add/edit/remove exercises with sets, reps, weight, rest, order).
- **Calendar** to assign routines to dates (trainer) and view them (client).
- Profile page with **photo upload**; avatars shown in the navbar and the client portal.
- **Guided FAQ assistant** (role-aware, no AI) available as a floating widget.
- **Real-time presence**: admins see who is online; trainers see their own clients.
- **Admin-only API documentation** page at `/admin/docs` (interactive Swagger UI).
- Mobile-first responsive layout (mobile styles as the base, `min-width` breakpoints) with a drawer navigation on small screens.
- Code-splitting: routes are lazy-loaded and Firebase is loaded on demand.

### Project Structure

```
fitflow-front/
├── index.html
├── vite.config.js
├── .env                   # Local environment variables (not committed)
├── public/                # favicon, manifest, logo
└── src/
    ├── main.jsx  App.jsx
    ├── config/            # api.js, firebase.js
    ├── lib/               # apiClient.js, tokenStore.js, socket.js, time.js
    ├── context/           # AuthContext.jsx, PresenceContext.jsx
    ├── data/              # faq.js (assistant knowledge base)
    ├── hooks/             # useAuth, useClients, useExercises, useWorkouts, useSchedule, useMe, useAdmin, usePresence
    ├── components/
    │   ├── layout/        # AppLayout, Navbar, Sidebar, ProtectedRoute, AdminRoute, RoleRoute, RoleHome
    │   ├── ui/            # Button, Input, Modal, Spinner, Alert, ConfirmDialog, PageHeader, EmptyState, PageLoader, Avatar, VideoModal
    │   ├── assistant/     # AssistantWidget
    │   ├── invitations/   # InviteModal
    │   ├── clients/  exercises/  workouts/  calendar/
    ├── pages/             # route pages
    ├── styles/            # SCSS (tokens, base, ui, patterns, per-feature)
    └── utils/
```

### Routes

**Public**
- `/login`, `/register` (accepts `?invite=<token>`)

**Trainer / Admin** (protected)
- `/` (dashboard), `/clients`, `/clients/:id`, `/exercises`, `/workouts`, `/workouts/:id`, `/schedule`, `/profile`

**Admin only** (protected)
- `/admin`, `/admin/users`, `/admin/subscriptions`, `/admin/docs`

**Client portal** (protected)
- `/portal`, `/portal/workouts/:id`, `/portal/calendar`, `/portal/profile`

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

Create a `.env` file and set the environment variables required by the application. They are not listed here for security reasons.

#### Run

```bash
npm run dev       # development (http://localhost:5173)
```

#### Demo account

Run the demo seeder in the backend (`npm run demo:seed`) and sign in with:

- Trainer: `demoentrenador@demo.fitflow.app` / `Demo1234`
- Client (portal): `democliente@demo.fitflow.app` / `Demo1234`

#### Build

```bash
npm run build     # production build (dist/)
npm run preview   # preview the production build
```

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
- Set the environment variables in Vercel before building (not listed here).
- Backend CORS: add this site's origin to `FRONTEND_URL` on the backend (also required for the WebSocket connection).

### License

Proprietary — All rights reserved. © 2026 GZK-TXK.

No permission is granted to use, copy, modify, distribute or sublicense this software without prior written consent. See [LICENSE](LICENSE).

### Author

- GitHub: [@GZK-TXK](https://github.com/GZK-TXK)

---

<a id="espanol"></a>
## Español

### Descripción general

El frontend de FitFlow es una aplicación de página única (SPA) construida con React y Vite. Consume la API REST de FitFlow y adapta la interfaz al **rol** del usuario: los entrenadores gestionan clientes, ejercicios, rutinas y calendario; los clientes ven su propio portal; y los administradores moderan cuentas. La autenticación usa un JWT guardado **en memoria** (nunca en `localStorage`) y admite el login con Google vía Firebase. Además ofrece fotos de perfil, un asistente FAQ guiado y presencia en tiempo real mediante Socket.IO.

### Stack

- **Librería:** React 19
- **Build:** Vite 8 (Rolldown)
- **Rutas:** React Router 7
- **Estilos:** Sass (SCSS) con sistema de tokens de diseño
- **Iconos:** `lucide-react`
- **Autenticación:** Firebase JS SDK (Google), JWT en memoria
- **Tiempo real:** cliente de Socket.IO
- **Docs de API:** `swagger-ui-react` (página solo para admin)
- **HTTP:** `fetch` nativo mediante un wrapper propio

### Roles y experiencia

- **Entrenador** (`TRAINER`) — dashboard, clientes, ejercicios, rutinas (con constructor), calendario, perfil.
- **Admin** (`ADMIN`) — todo lo del entrenador, más un área **Admin**: panel con estadísticas y sección **Usuarios** (aprobar/activar/desactivar cuentas, gestionar roles y ver quién está en línea).
- **Cliente** (`CLIENT`) — **portal** de solo lectura: rutinas asignadas, calendario, perfil propio y los datos de contacto de su entrenador.

### Características

- Login y registro (email/contraseña) y **Continuar con Google**.
- **Registro por invitación**: alta desde un enlace de invitación (`/register?invite=...`).
- Las cuentas nuevas de entrenador quedan **pendientes de aprobación**; la app lo indica con un aviso claro.
- El acceso se bloquea con un mensaje claro si la cuenta está pendiente o desactivada.
- Rutas y navegación por rol (entrenador/admin vs cliente).
- CRUD de clientes, con acción de **dar/quitar acceso al portal** en la ficha del cliente.
- Biblioteca de ejercicios con filtro por categoría y **modal de vídeo**.
- Constructor de rutinas (añadir/editar/quitar ejercicios con series, reps, peso, descanso, orden).
- **Calendario** para asignar rutinas a fechas (entrenador) y consultarlas (cliente).
- Página de perfil con **subida de foto**; avatares visibles en la navbar y en el portal del cliente.
- **Asistente FAQ guiado** (según el rol, sin IA) como burbuja flotante.
- **Presencia en tiempo real**: el admin ve quién está en línea; el entrenador ve a sus propios clientes.
- **Documentación de la API (solo admin)** en `/admin/docs` (Swagger UI interactivo).
- Diseño responsive mobile-first (estilos móviles como base y breakpoints con `min-width`) con navegación lateral deslizante en móvil.
- Code-splitting: rutas cargadas de forma diferida (`lazy`) y Firebase bajo demanda.

### Estructura del proyecto

```
fitflow-front/
├── index.html
├── vite.config.js
├── .env                   # Variables de entorno locales (no se sube)
├── public/                # favicon, manifest, logo
└── src/
    ├── main.jsx  App.jsx
    ├── config/            # api.js, firebase.js
    ├── lib/               # apiClient.js, tokenStore.js, socket.js, time.js
    ├── context/           # AuthContext.jsx, PresenceContext.jsx
    ├── data/              # faq.js (base de conocimiento del asistente)
    ├── hooks/             # useAuth, useClients, useExercises, useWorkouts, useSchedule, useMe, useAdmin, usePresence
    ├── components/
    │   ├── layout/        # AppLayout, Navbar, Sidebar, ProtectedRoute, AdminRoute, RoleRoute, RoleHome
    │   ├── ui/            # Button, Input, Modal, Spinner, Alert, ConfirmDialog, PageHeader, EmptyState, PageLoader, Avatar, VideoModal
    │   ├── assistant/     # AssistantWidget
    │   ├── invitations/   # InviteModal
    │   ├── clients/  exercises/  workouts/  calendar/
    ├── pages/             # páginas de ruta
    ├── styles/            # SCSS (tokens, base, ui, patterns, por feature)
    └── utils/
```

### Rutas

**Públicas**
- `/login`, `/register` (acepta `?invite=<token>`)

**Entrenador / Admin** (protegidas)
- `/` (dashboard), `/clients`, `/clients/:id`, `/exercises`, `/workouts`, `/workouts/:id`, `/schedule`, `/profile`

**Solo admin** (protegidas)
- `/admin`, `/admin/users`, `/admin/subscriptions`, `/admin/docs`

**Portal del cliente** (protegidas)
- `/portal`, `/portal/workouts/:id`, `/portal/calendar`, `/portal/profile`

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

Crea un archivo `.env` y configura las variables de entorno que necesita la aplicación. No se listan aquí por seguridad.

#### Ejecución

```bash
npm run dev       # desarrollo (http://localhost:5173)
```

#### Cuenta demo

Ejecuta el seeder de demo en el backend (`npm run demo:seed`) e inicia sesión con:

- Entrenador: `demoentrenador@demo.fitflow.app` / `Demo1234`
- Cliente (portal): `democliente@demo.fitflow.app` / `Demo1234`

#### Build

```bash
npm run build     # build de producción (dist/)
npm run preview   # previsualiza el build de producción
```

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
- Configura las variables de entorno en Vercel antes de construir (no se listan aquí).
- CORS del backend: añade el origen de este sitio a `FRONTEND_URL` (también necesario para la conexión WebSocket).

### Licencia

Propietaria — Todos los derechos reservados. © 2026 GZK-TXK.

No se concede permiso para usar, copiar, modificar, distribuir ni sublicenciar este software sin consentimiento previo por escrito. Ver [LICENSE](LICENSE).

### Autor

- GitHub: [@GZK-TXK](https://github.com/GZK-TXK)
