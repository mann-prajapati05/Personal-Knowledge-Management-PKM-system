import { Link } from "react-router-dom";
import Auth from "../Auth.jsx";

export default function AuthPage({ mode }) {
  return (
    <main className="min-h-[calc(100vh-72px)] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-4">
        <Auth initialMode={mode} />
        <div className="text-center text-sm text-slate-400">
          {mode === "login" ? (
            <span>
              Need an account?{" "}
              <Link className="text-cyan-300" to="/register">
                Register
              </Link>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <Link className="text-cyan-300" to="/login">
                Login
              </Link>
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
