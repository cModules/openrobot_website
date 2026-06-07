import { Link, useLocation } from "react-router-dom";
import { Cpu, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "首页" },
    { path: "/products", label: "产品" },
    { path: "/download", label: "下载" },
    { path: "/feedback", label: "反馈" },
    { path: "/contact", label: "联系" },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-accent-500" />
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-accent-400 to-primary-500 bg-clip-text text-transparent">
              OpenRoboOLP
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-accent-400 ${
                  location.pathname === link.path
                    ? "text-accent-400"
                    : "text-slate-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-slate-300 hover:text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-slate-800">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-medium transition-colors hover:text-accent-400 ${
                    location.pathname === link.path
                      ? "text-accent-400"
                      : "text-slate-300"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
