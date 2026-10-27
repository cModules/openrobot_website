import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Download,
  Briefcase,
  FileText,
  Settings,
  LogOut,
  UploadCloud,
  ExternalLink,
  Eye,
  Image,
} from 'lucide-react';
import { useContent } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { config, repoUrl } from '@/lib/config';

const menu = [
  { to: '/', label: '概览', icon: LayoutDashboard, end: true },
  { to: '/products', label: '产品', icon: Package, end: false },
  { to: '/downloads', label: '下载', icon: Download, end: false },
  { to: '/cases', label: '案例', icon: Briefcase, end: false },
  { to: '/docs', label: '文档', icon: FileText, end: false },
  { to: '/assets', label: '资源库', icon: Image, end: false },
  { to: '/settings', label: '设置', icon: Settings, end: false },
];

export default function AdminLayout() {
  const { dirty, publishing, publish, logout, lastCommitUrl, error, isDemo } =
    useContent();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handlePublish = async () => {
    try {
      await publish();
      showToast('success', '已发布，EdgeOne 将在 1-2 分钟后更新线上站点');
    } catch (err) {
      showToast('error', err instanceof Error ? err.message : '发布失败');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary-600/20 text-accent-400'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex">
      <aside className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="px-5 py-5 border-b border-slate-800">
          <div className="text-lg font-display font-bold text-white">
            内容后台
          </div>
          <div className="text-xs text-slate-500 mt-0.5">OpenRobot</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menu.map(item => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                <Icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="p-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-3 text-sm">
            {isDemo ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-900/30 border border-amber-700/50 text-amber-300 text-xs font-medium">
                本地试用 · 改动只存本机
              </span>
            ) : (
              <>
                <span className="text-slate-500">仓库</span>
                <a
                  href={repoUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-accent-400 flex items-center gap-1"
                >
                  {config.owner}/{config.repo}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </>
            )}
            {dirty ? (
              <span className="px-2 py-0.5 rounded-full bg-yellow-900/40 border border-yellow-700/50 text-yellow-300 text-xs">
                有未发布的改动
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-green-900/30 border border-green-700/40 text-green-300 text-xs">
                已是最新
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {lastCommitUrl ? (
              <a
                href={lastCommitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-accent-400"
              >
                查看最近一次提交
              </a>
            ) : null}
            <button
              type="button"
              onClick={handlePublish}
              disabled={!dirty || publishing}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
            >
              {isDemo ? (
                <Eye className="w-4 h-4" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              {publishing
                ? '发布中…'
                : isDemo
                  ? '演示模式（不能发布）'
                  : '发布到线上'}
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="mb-5 px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          ) : null}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
