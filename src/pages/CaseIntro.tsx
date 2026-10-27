import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCases } from "@/lib/useData";

/**
 * 案例详情页。
 *
 * 与产品介绍页同理：案例详情可以是上传到 Blob Storage 的完整 HTML 页面，
 * 这里用 iframe 原样加载 /api/asset/<coverPath>。
 */
export default function CaseIntro() {
  const { caseId } = useParams();
  const { cases } = useCases();

  const item = cases.find((entry) => entry.id === caseId);

  if (!item || !item.coverPath) {
    return <Navigate to="/cases" replace />;
  }

  const src = `/api/asset/${item.coverPath}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Navbar />

      <div className="flex items-center justify-between gap-4 px-6 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/cases"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-accent-400 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            返回案例
          </Link>
          <span className="text-white font-semibold truncate">
            {item.title}
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
        title={`${item.title} 案例详情`}
        className="flex-1 w-full border-0 bg-white"
        style={{ height: "calc(100vh - 116px)" }}
      />
    </div>
  );
}
