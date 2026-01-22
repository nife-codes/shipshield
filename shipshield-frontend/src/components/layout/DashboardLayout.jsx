import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-bg text-white">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}