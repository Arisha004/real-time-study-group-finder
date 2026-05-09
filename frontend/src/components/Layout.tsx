import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/projects", label: "Projects", icon: "📁" },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-lg font-bold truncate">Real-Time Study Group Fin...</h1>
          <p className="text-xs text-gray-400 mt-1">React • Supabase • WebSocket</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                location.pathname === item.path ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}>
              <span>{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm font-medium truncate">{user?.full_name}</p>
          <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          <button onClick={logout} className="text-xs text-red-500 mt-2 hover:underline">Sign Out</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold truncate">Real-Time Study Grou...</h1>
          <button onClick={logout} className="text-xs text-red-500">Sign Out</button>
        </header>
        <main className="flex-1 overflow-auto"><Outlet /></main>
        <nav className="lg:hidden bg-white border-t flex">
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex-1 flex flex-col items-center py-3 text-xs font-medium ${
                location.pathname === item.path ? "text-blue-600" : "text-gray-400"
              }`}>
              <span className="text-lg">{item.icon}</span> {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
