import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useProducts } from "@/lib/useData";

/**
 * 产品介绍页。
 *
 * 介绍内容是上传到 Blob Storage 的完整 HTML 站点，
 * 这里用 iframe 原样加载 /api/asset/<introPath>。
 *
 * 之所以能在 iframe 里正常显示：资源接口用的是路径形式
 * /api/asset/products/roboworld/index.html，
 * 页面内部的相对路径 assets/xxx.png 会被浏览器解析成
 * /api/asset/products/roboworld/assets/xxx.png，正好命中同一个函数。
 */
export default function ProductIntro() {
  const { productId } = useParams();
  const { products } = useProducts();

  const product = products
    .flatMap((category) => category.items)
    .find((item) => item.id === productId);

  if (!product || !product.introPath) {
    return <Navigate to="/products" replace />;
  }

  const src = `/api/asset/${product.introPath}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Navbar />

      <div className="flex items-center justify-between gap-4 px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/products"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-accent-400 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            返回产品
          </Link>
          <span className="text-white font-semibold truncate">
            {product.name}
          </span>
        </div>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-accent-400 transition-colors flex-shrink-0"
        >
          新窗口打开
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <iframe
        src={src}
        title={`${product.name} 产品介绍`}
        className="flex-1 w-full border-0 bg-white"
        style={{ height: "calc(100vh - 116px)" }}
      />
    </div>
  );
}
