import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { siteInfo } from "@/lib/dataManager";

const navLinks = [
  { path: "/", label: "首页" },
  { path: "/products", label: "产品" },
  { path: "/resources", label: "资源" },
  { path: "/cases", label: "案例" },
  { path: "/contact", label: "联系我们" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/robot-logo.png"
              alt={`${siteInfo.name} Logo`}
              className="w-8 h-8 object-contain"
            />
            <span className="text-2xl font-display font-bold bg-gradient-to-r from-accent-400 to-primary-500 bg-clip-text text-transparent">
              {siteInfo.logoText}
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
            <div className="flex flex-col gap-4 items-start">
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
