import { Cpu, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-20">
      <div className="container mx-auto py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Cpu className="w-6 h-6 text-accent-500" />
              <span className="text-xl font-display font-bold text-white">
                OpenRoboOLP
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              高性能工业机器人离线编程软件，为机器人工程师、研究人员和制造商提供免费、可扩展的商业 OLP 工具替代方案。
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-slate-400 hover:text-accent-400 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-accent-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-accent-400 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-accent-400 transition-colors">工业机器人</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">视觉传感器</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">夹爪</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">软件</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">资源</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-accent-400 transition-colors">文档</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">教程</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">论坛</a></li>
              <li><a href="#" className="hover:text-accent-400 transition-colors">支持</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
          <p>&copy; 2024 OpenRoboOLP. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
