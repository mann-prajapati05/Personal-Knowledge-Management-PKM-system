import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Layout.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AuthPage from "../pages/AuthPage.jsx";
import NotesPage from "../pages/NotesPage.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/notes" replace />} />
          <Route path="login" element={<AuthPage mode="login" />} />
          <Route path="register" element={<AuthPage mode="register" />} />
          <Route element={<ProtectedRoute />}>
            <Route path="notes" element={<NotesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/notes" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
