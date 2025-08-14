import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/Auth/login";
import LayoutPage from "../pages/LayoutPage/LayoutPage";
import Dashboard from "../components/Common/dashboard";
import Report from "../components/Common/report";
import ReportUp from "../components/Common/report_up";
import Company from "../components/Common/company";
import Users from "../components/Common/users";
import Config from "../components/Common/config";
import FormErgon2 from "../components/Common/form-ergon2";
import ManagerDepartaments from "../components/Common/manager_departaments";
import ProtectedRoute from "../components/Auth/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <LayoutPage />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="laudos" element={<Report />} />
        <Route path="laudos/create" element={<ReportUp />} />
        <Route path="empresas" element={<Company />} />
        <Route path="usuarios" element={<Users />} />
        <Route path="configuracoes" element={<Config />} />
        <Route path="cadastros" element={<ManagerDepartaments />} />
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>
      <Route path="/formulario-ergonomico" element={<FormErgon2 />} />
    </Routes>
  );
}