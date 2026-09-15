import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { PresenceProvider } from './context/PresenceContext.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import AdminRoute from './components/layout/AdminRoute.jsx'
import RoleRoute from './components/layout/RoleRoute.jsx'
import RoleHome from './components/layout/RoleHome.jsx'
import PageLoader from './components/ui/PageLoader.jsx'

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))
const ClientsPage = lazy(() => import('./pages/ClientsPage.jsx'))
const ClientDetailPage = lazy(() => import('./pages/ClientDetailPage.jsx'))
const ExercisesPage = lazy(() => import('./pages/ExercisesPage.jsx'))
const WorkoutsPage = lazy(() => import('./pages/WorkoutsPage.jsx'))
const WorkoutBuilderPage = lazy(() => import('./pages/WorkoutBuilderPage.jsx'))
const SchedulePage = lazy(() => import('./pages/SchedulePage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const ClientWorkoutsPage = lazy(() => import('./pages/ClientWorkoutsPage.jsx'))
const ClientWorkoutDetailPage = lazy(() => import('./pages/ClientWorkoutDetailPage.jsx'))
const ClientCalendarPage = lazy(() => import('./pages/ClientCalendarPage.jsx'))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage.jsx'))
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage.jsx'))
const AdminSubscriptionsPage = lazy(() => import('./pages/AdminSubscriptionsPage.jsx'))
const ApiDocsPage = lazy(() => import('./pages/ApiDocsPage.jsx'))

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PresenceProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<RoleHome />} />

                  <Route element={<RoleRoute allow={['TRAINER', 'ADMIN']} />}>
                    <Route path="/clients" element={<ClientsPage />} />
                    <Route path="/clients/:id" element={<ClientDetailPage />} />
                    <Route path="/exercises" element={<ExercisesPage />} />
                    <Route path="/workouts" element={<WorkoutsPage />} />
                    <Route path="/workouts/:id" element={<WorkoutBuilderPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>

                  <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
                    <Route path="/admin/docs" element={<ApiDocsPage />} />
                  </Route>

                  <Route element={<RoleRoute allow={['CLIENT']} />}>
                    <Route path="/portal" element={<ClientWorkoutsPage />} />
                    <Route path="/portal/workouts/:id" element={<ClientWorkoutDetailPage />} />
                    <Route path="/portal/calendar" element={<ClientCalendarPage />} />
                    <Route path="/portal/profile" element={<ProfilePage />} />
                  </Route>
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </PresenceProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}