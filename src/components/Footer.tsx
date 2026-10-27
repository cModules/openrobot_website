import { Link } from "react-router-dom";
import { Github, Mail, MessageCircle } from "lucide-react";
import { siteInfo } from "@/lib/dataManager";
import { useContact } from "@/lib/contact";

const socialClass =
  "p-2 text-slate-400 hover:text-accent-400 hover:bg-slate-800 rounded-lg transition-all";

export default function Footer() {
  const { open } = useContact();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="container mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/robot-logo.png"
                alt={`${siteInfo.name} Logo`}
                className="w-6 h-6 object-contain"
              />
              <span className="text-xl font-display font-bold text-white">
                {siteInfo.logoText}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {siteInfo.footerDescription}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => open("github")}
                aria-label="GitHub"
                title="GitHub"
                className={socialClass}
              >
                <Github className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => open("wechat")}
                aria-label="微信"
                title="微信"
                className={socialClass}
              >
                <MessageCircle className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => open("email")}
                aria-label="邮箱"
                title="邮箱"
                className={socialClass}
              >
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">产品与服务</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-accent-400 transition-colors">roboWorld</Link></li>
              <li><Link to="/products" className="hover:text-accent-400 transition-colors">SO101 套件</Link></li>
              <li><Link to="/products" className="hover:text-accent-400 transition-colors">方案顾问</Link></li>
              <li><Link to="/cases" className="hover:text-accent-400 transition-colors">客户案例</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">资源与支持</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/resources" className="hover:text-accent-400 transition-colors">资源中心</Link></li>
              <li><Link to="/contact" className="hover:text-accent-400 transition-colors">联系我们</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} {siteInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
