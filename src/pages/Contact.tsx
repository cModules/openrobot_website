import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Send,
  Check,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Bug,
  Loader2,
  Mail,
  MessageCircle,
  Github,
  ExternalLink,
  Copy,
  Clock,
  MapPin,
} from "lucide-react";
import { siteInfo } from "@/lib/dataManager";

const TYPE_LABEL = {
  suggestion: "功能建议",
  bug: "问题报告",
  other: "其他",
} as const;

const inputClass =
  "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-500 transition-all";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  if (!value) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // 剪贴板不可用时值仍展示在页面上，可手动复制
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

export default function Contact() {
  const [feedbackType, setFeedbackType] =
    useState<keyof typeof TYPE_LABEL>("suggestion");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // 蜜罐字段，真人看不到
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.subject.trim()) {
      setError("请填写主题");
      return;
    }
    if (!formData.message.trim()) {
      setError("请填写详细描述");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, type: TYPE_LABEL[feedbackType] }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "提交失败，请稍后重试或直接微信联系");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "提交失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setSubmitted(false);
    setFeedbackType("suggestion");
    setFormData({ name: "", email: "", subject: "", message: "", website: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              联系我们
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              方案咨询、技术支持或产品建议，都能在这里找到我们
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* 左：联系方式 */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-accent-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">微信</h3>
                    {siteInfo.wechatId ? (
                      <>
                        <p className="text-white text-xl font-display font-bold break-all">
                          {siteInfo.wechatId}
                        </p>
                        <p className="text-slate-400 text-sm mt-1 mb-4">
                          扫码或搜索微信号添加，响应最快
                        </p>
                        <CopyButton value={siteInfo.wechatId} label="复制微信号" />
                      </>
                    ) : (
                      <p className="text-slate-500 text-sm mt-1">
                        微信号尚未填写，请先用邮箱或 GitHub 联系
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">邮箱</h3>
                    <p className="text-white text-lg font-display font-bold break-all">
                      {siteInfo.email}
                    </p>
                    <p className="text-slate-400 text-sm mt-1 mb-4">
                      工作日 24 小时内回复，方案咨询请附上需求说明
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <CopyButton value={siteInfo.email} label="复制邮箱" />
                      <a
                        href={`mailto:${siteInfo.email}`}
                        className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        发邮件
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      GitHub
                    </h3>
                    <p className="text-white text-sm font-display break-all">
                      {siteInfo.github}
                    </p>
                    <p className="text-slate-400 text-sm mt-1 mb-4">
                      源码、示例工程与问题反馈都在这里
                    </p>
                    <a
                      href={siteInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-all items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      打开 GitHub
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-3 text-sm">
                {siteInfo.workTime ? (
                  <div className="flex items-start gap-3 text-slate-400">
                    <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-300">{siteInfo.workTime}</p>
                      {siteInfo.workTimeNote ? (
                        <p className="text-slate-500">{siteInfo.workTimeNote}</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {siteInfo.address ? (
                  <div className="flex items-start gap-3 text-slate-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300">{siteInfo.address}</p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 右：反馈表单 */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-2">
                提交反馈
              </h2>
              <p className="text-slate-400 text-sm mb-8">
                功能建议、问题报告或其他想法，我们会认真看每一条
              </p>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-accent-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-accent-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    感谢您的反馈！
                  </h3>
                  <p className="text-slate-400 mb-8">
                    我们已收到您的反馈，会尽快处理并回复。
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-all"
                  >
                    再填一条
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-white font-medium mb-3">
                      反馈类型
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(
                        [
                          { id: "suggestion", label: "功能建议", Icon: Lightbulb },
                          { id: "bug", label: "问题报告", Icon: Bug },
                          { id: "other", label: "其他", Icon: MessageSquare },
                        ] as const
                      ).map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setFeedbackType(id)}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1.5 ${
                            feedbackType === id
                              ? "bg-accent-900/30 border-accent-500 text-accent-400"
                              : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        姓名
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="您的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        邮箱
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-white text-sm font-medium mb-2">
                      主题
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={inputClass}
                      placeholder="简要描述您的问题或建议"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-white text-sm font-medium mb-2">
                      详细描述
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`${inputClass} resize-none`}
                      placeholder="请详细描述您遇到的问题或建议..."
                    />
                  </div>

                  {/* 蜜罐：正常用户看不见，只有自动脚本会填 */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="hidden"
                  />

                  {error ? (
                    <div className="mb-5 px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-sm flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        提交中…
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        提交反馈
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
