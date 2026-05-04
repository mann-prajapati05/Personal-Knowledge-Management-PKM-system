import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4041";

export default function ProtectedRoute() {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    const checkAuth = async () => {
      try {
        await axios.get(`${API_BASE}/auth/me`, { withCredentials: true });
        if (active) setStatus("ok");
      } catch {
        if (active) setStatus("unauthorized");
      }
    };

    checkAuth();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-[70vh] grid place-items-center text-slate-300">
        Loading...
      </div>
    );
  }

  if (status === "unauthorized") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
