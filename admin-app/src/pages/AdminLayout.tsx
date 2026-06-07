import { Outlet, Link, useLocation } from "react-router-dom";
import { Cpu, LayoutDashboard, Package, Download, Settings, LogOut } from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "仪表板" },
    { path: "/products", icon: Package, label: "产品管理" },
    { path: "/downloads", icon: Download, label: "下载管理" },
    { path: "/settings", icon: Settings, label: "系统设置" },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-600 rounded-xl flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">OpenRVS</h1>
              <p className="text-xs text-slate-400">管理后台</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${isActive(item.path)
                        ? "bg-primary-600/20 text-primary-400 border border-primary-500/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">退出登录</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <header className="bg-slate-900/50 border-b border-slate-800 sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              {navItems.find(item => isActive(item.path))?.label || "管理后台"}
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">管理员</span>
              <div className="w-9 h-9 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
