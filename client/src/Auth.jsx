import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4041";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

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
      setEmail("");
      setPassword("");
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Request failed";
      setMsg(message);
    }
  };

  return (
    <div className="max-w-md w-full bg-slate-800 p-6 rounded">
      <h2 className="text-2xl font-semibold mb-4 text-cyan-300">
        {mode === "login" ? "Login" : "Register"}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 rounded bg-slate-700"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="w-full p-2 rounded bg-slate-700"
        />
        <div className="flex items-center justify-between">
          <button
            className="bg-cyan-500 text-slate-900 px-4 py-2 rounded"
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
