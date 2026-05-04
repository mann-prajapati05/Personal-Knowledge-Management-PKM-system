import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4041";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE}/auth/logout`,
        {},
        { withCredentials: true },
      );
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          to="/notes"
          className="text-lg font-semibold tracking-tight text-cyan-300"
        >
          Notes
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:border-cyan-500 hover:text-cyan-300"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
