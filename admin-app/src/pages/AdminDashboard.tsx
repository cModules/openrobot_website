import { Package, Download, FileText, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useProducts, useDownloads, useDocumentation } from "@/lib/useData";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  const { products } = useProducts();
  const { downloads } = useDownloads();
  const { documentation } = useDocumentation();

  const totalProducts = products.reduce((sum, cat) => sum + cat.items.length, 0);
  const totalCategories = products.length;

  const stats = [
    {
      title: "产品数量",
      value: totalProducts,
      icon: Package,
      color: "from-primary-600 to-primary-500",
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "产品分类",
      value: totalCategories,
      icon: FileText,
      color: "from-accent-600 to-accent-500",
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "下载资源",
      value: downloads.length,
      icon: Download,
      color: "from-green-600 to-green-500",
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "文档资源",
      value: documentation.length,
      icon: FileText,
      color: "from-orange-600 to-orange-500",
      trend: "-2%",
      trendUp: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.trendUp ? "text-green-400" : "text-red-400"}`}>
                  {stat.trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.trend}
                </div>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.title}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">快速操作</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/products"
              className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all group"
            >
              <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <div className="font-medium text-white">产品管理</div>
                <div className="text-sm text-slate-400">添加/编辑产品</div>
              </div>
            </Link>
            <Link
              to="/downloads"
              className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all group"
            >
              <div className="w-12 h-12 bg-accent-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6 text-accent-400" />
              </div>
              <div>
                <div className="font-medium text-white">下载管理</div>
                <div className="text-sm text-slate-400">管理下载资源</div>
              </div>
            </Link>
            <Link
              to="/downloads#docs"
              className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all group"
            >
              <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <div className="font-medium text-white">文档管理</div>
                <div className="text-sm text-slate-400">管理文档资源</div>
              </div>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all group"
            >
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <div className="font-medium text-white">系统设置</div>
                <div className="text-sm text-slate-400">数据管理</div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">最近更新</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">ORV-Cam Pro</div>
                <div className="text-xs text-slate-400">产品信息已更新</div>
              </div>
              <div className="text-xs text-slate-500">10分钟前</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-accent-600/20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-accent-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">ORV IDE v2.1.0</div>
                <div className="text-xs text-slate-400">下载资源已添加</div>
              </div>
              <div className="text-xs text-slate-500">1小时前</div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-xl">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">API 参考文档</div>
                <div className="text-xs text-slate-400">文档已更新</div>
              </div>
              <div className="text-xs text-slate-500">2小时前</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">产品分类概览</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((category) => (
            <div key={category.id} className="p-4 bg-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{category.category}</span>
                <span className="text-xs px-2 py-1 bg-primary-600/20 text-primary-400 rounded-full">
                  {category.items.length} 个产品
                </span>
              </div>
              <div className="space-y-2">
                {category.items.slice(0, 3).map((product) => (
                  <div key={product.id} className="text-sm text-slate-400 truncate">
                    • {product.name}
                  </div>
                ))}
                {category.items.length > 3 && (
                  <div className="text-xs text-slate-500">+{category.items.length - 3} 更多</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
