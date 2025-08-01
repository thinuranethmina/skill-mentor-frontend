import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import PaymentPage from "@/pages/PaymentPage";
import MentorPage from "./pages/MentorPage";
import AdminDashboardPage from "@/pages/admin/DashboardPage";
import AdminSessionsPage from "@/pages/admin/SessionsPage";
import AdminClassesPage from "@/pages/admin/ClassesPage";
import AdminStudentsPage from "@/pages/admin/StudentsPage";
import AdminMentorsPage from "@/pages/admin/MentorsPage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import AboutPage from "./pages/AboutPage";
import TermsAndConditionPage from "./pages/TermsAndConditionPage";
import MentorsPage from "./pages/MentorsPage";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>

        <Route
          element={<Layout />}
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionPage />} />
          <Route path="/mentors" element={<MentorsPage />} />
          <Route path="/mentor/:id" element={<MentorPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment/:sessionId"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <PaymentPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="sessions" element={<AdminSessionsPage />} />
          <Route path="classes" element={<AdminClassesPage />} />
          <Route path="students" element={<AdminStudentsPage />} />
          <Route path="mentors" element={<AdminMentorsPage />} />
        </Route>

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
