import { useEffect, useState } from "react";
import {
  X,
  Github,
  Mail,
  MessageCircle,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useContact, type ContactTab } from "@/lib/contact";
import { siteInfo } from "@/lib/dataManager";

const tabs: { id: ContactTab; label: string; icon: typeof Github }[] = [
  { id: "wechat", label: "微信", icon: MessageCircle },
  { id: "email", label: "邮箱", icon: Mail },
  { id: "github", label: "GitHub", icon: Github },
];

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 浏览器不允许写剪贴板时，值仍然展示在页面上，用户可手动复制
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      {copied ? "已复制" : label}
    </button>
  );
}

export default function ContactModal() {
  const { isOpen, tab, close } = useContact();
  const [qrFailed, setQrFailed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between px-6 pt-5">
          <h3 className="text-lg font-display font-bold text-white">联系我们</h3>
          <button
            type="button"
            onClick={close}
            aria-label="关闭"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 px-6 pt-4">
          {tabs.map(item => {
            const Icon = item.icon;
            const active = tab === item.id;
            return (
              <span
                key={item.id}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium ${
                  active
                    ? "bg-primary-600/20 text-accent-400"
                    : "text-slate-500"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </span>
            );
          })}
        </div>

        <div className="p-6">
          {tab === "wechat" ? (
            <div className="text-center">
              {siteInfo.wechatQr && !qrFailed ? (
                <img
                  src={siteInfo.wechatQr}
                  alt="微信二维码"
                  onError={() => setQrFailed(true)}
                  className="w-44 h-44 mx-auto object-contain bg-white rounded-xl p-2"
                />
              ) : (
                <div className="w-44 h-44 mx-auto flex items-center justify-center bg-slate-800 border border-slate-700 rounded-xl text-slate-500 text-sm px-4 text-center">
                  微信二维码待补充
                  <br />
                  请先用微信号添加
                </div>
              )}
              <p className="text-slate-400 text-sm mt-4">扫码或搜索微信号添加</p>
              {siteInfo.wechatId ? (
                <>
                  <p className="text-white text-2xl font-display font-bold mt-1">
                    {siteInfo.wechatId}
                  </p>
                  <div className="mt-4">
                    <CopyButton value={siteInfo.wechatId} label="复制微信号" />
                  </div>
                </>
              ) : (
                <p className="text-accent-400 text-xl font-display font-bold mt-1">
                  微信号尚未填写
                </p>
              )}
            </div>
          ) : null}

          {tab === "email" ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-primary-900/50 rounded-xl flex items-center justify-center">
                <Mail className="w-7 h-7 text-primary-400" />
              </div>
              <p className="text-white text-xl font-display font-bold mt-4 break-all">
                {siteInfo.email}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                工作日 24 小时内回复，方案咨询请附上需求说明
              </p>
              <div className="flex gap-2 mt-5">
                <CopyButton value={siteInfo.email} label="复制邮箱" />
                <a
                  href={`mailto:${siteInfo.email}`}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  发邮件
                </a>
              </div>
            </div>
          ) : null}

          {tab === "github" ? (
            <div className="text-center">
              <div className="w-14 h-14 mx-auto bg-slate-800 rounded-xl flex items-center justify-center">
                <Github className="w-7 h-7 text-white" />
              </div>
              <p className="text-white text-base font-display font-bold mt-4 break-all">
                {siteInfo.github}
              </p>
              <p className="text-slate-400 text-sm mt-2">
                源码、示例工程与问题反馈都在这里
              </p>
              <a
                href={siteInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                打开 GitHub
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
