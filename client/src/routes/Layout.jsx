import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <Outlet />
    </div>
  );
}
