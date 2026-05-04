import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4041";

export default function Auth({ initialMode = "login" }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const url = `${API_BASE}/auth/${mode}`;
      const res = await axios.post(
        url,
        { email, password },
        { withCredentials: true },
      );
      setMsg(`Success: ${res.data.user?.email || "ok"}`);
      navigate("/notes", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Request failed";
      setMsg(message);
    }
  };

  return (
    <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/70 p-8 shadow-2xl shadow-cyan-950/20">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight text-cyan-300">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      <p className="mb-6 text-sm text-slate-400">
        {mode === "login" ? "Welcome back." : "Create your account."}
      </p>

      <form onSubmit={submit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-500"
        />
        <div className="flex items-center justify-between">
          <button
            className="rounded-xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 hover:bg-cyan-300"
            type="submit"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
          <button
            type="button"
            className="text-sm text-cyan-300"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login" ? "Create account" : "Have account? Login"}
          </button>
        </div>
        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>
    </div>
  );
}
