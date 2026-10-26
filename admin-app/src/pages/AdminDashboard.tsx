import { Link } from 'react-router-dom';
import { Package, Download, FileText, ArrowRight } from 'lucide-react';
import { useContent } from '@/lib/store';

export default function AdminDashboard() {
  const { content, loading } = useContent();

  if (loading || !content) {
    return (
      <div className="text-slate-400 text-sm">
        {loading ? '正在从 GitHub 拉取内容…' : '尚未加载内容'}
      </div>
    );
  }

  const stats = [
    { label: '产品分类', value: content.products.length, to: '/products', icon: Package },
    {
      label: '产品条目',
      value: content.products.reduce((sum, cat) => sum + cat.items.length, 0),
      to: '/products',
      icon: Package,
    },
    { label: '下载项', value: content.downloads.length, to: '/downloads', icon: Download },
    { label: '文档入口', value: content.documentation.length, to: '/docs', icon: FileText },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">概览</h1>
        <p className="text-slate-400 text-sm">
          这里管理主站全部可编辑内容。改完记得点右上角「发布到线上」。
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              to={stat.to}
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-accent-500/50 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-accent-400" />
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-accent-400 transition-colors" />
              </div>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-xl font-display font-bold text-white mb-4">发布流程</h2>
        <ol className="space-y-3 text-sm text-slate-400">
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 text-xs">1</span>
            <span>在「产品 / 下载 / 文档 / 设置」里编辑内容，改动先存在本机草稿。</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 text-xs">2</span>
            <span>点「发布到线上」，后台会用你的 Token 向仓库提交一个 commit。</span>
          </li>
          <li className="flex gap-3">
            <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center flex-shrink-0 text-xs">3</span>
            <span>GitHub 触发 EdgeOne 自动重建，约 1-2 分钟后线上生效。</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
