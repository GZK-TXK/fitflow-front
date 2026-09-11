import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import ProtectedRoute from './components/layout/ProtectedRoute.jsx'
import AppLayout from './components/layout/AppLayout.jsx'
import AdminRoute from './components/layout/AdminRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ClientsPage from './pages/ClientsPage.jsx'
import ClientDetailPage from './pages/ClientDetailPage.jsx'
import ExercisesPage from './pages/ExercisesPage.jsx'
import WorkoutsPage from './pages/WorkoutsPage.jsx'
import WorkoutBuilderPage from './pages/WorkoutBuilderPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminTrainersPage from './pages/AdminTrainersPage.jsx'
import AdminSubscriptionsPage from './pages/AdminSubscriptionsPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clients/:id" element={<ClientDetailPage />} />
              <Route path="/exercises" element={<ExercisesPage />} />
              <Route path="/workouts" element={<WorkoutsPage />} />
              <Route path="/workouts/:id" element={<WorkoutBuilderPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/trainers" element={<AdminTrainersPage />} />
                <Route path="/admin/subscriptions" element={<AdminSubscriptionsPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}