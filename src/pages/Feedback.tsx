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
} from "lucide-react";

const TYPE_LABEL = {
  suggestion: "功能建议",
  bug: "问题报告",
  other: "其他",
} as const;

const inputClass =
  "w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-accent-500 transition-all";

export default function Feedback() {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-display font-bold text-white mb-4">
                反馈建议
              </h1>
              <p className="text-xl text-slate-400">
                您的反馈是我们改进的动力，欢迎提出宝贵建议
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-accent-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-accent-400" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white mb-4">
                    感谢您的反馈！
                  </h2>
                  <p className="text-slate-400 mb-8">
                    我们已收到您的反馈，会尽快处理并回复。
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-all"
                  >
                    返回
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label className="block text-white font-medium mb-4">
                      反馈类型
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setFeedbackType("suggestion")}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          feedbackType === "suggestion"
                            ? "bg-accent-900/30 border-accent-500 text-accent-400"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <Lightbulb className="w-6 h-6" />
                        <span className="text-sm">功能建议</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackType("bug")}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          feedbackType === "bug"
                            ? "bg-accent-900/30 border-accent-500 text-accent-400"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <Bug className="w-6 h-6" />
                        <span className="text-sm">问题报告</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackType("other")}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${
                          feedbackType === "other"
                            ? "bg-accent-900/30 border-accent-500 text-accent-400"
                            : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <MessageSquare className="w-6 h-6" />
                        <span className="text-sm">其他</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
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
                      <label className="block text-white font-medium mb-2">
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

                  <div className="mb-6">
                    <label className="block text-white font-medium mb-2">
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

                  <div className="mb-8">
                    <label className="block text-white font-medium mb-2">
                      详细描述
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
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
                    <div className="mb-6 px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-sm flex items-start gap-2">
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

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                <AlertCircle className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">问题报告</h3>
                <p className="text-slate-400 text-sm">
                  发现软件 bug？请详细描述复现步骤
                </p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                <Lightbulb className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">功能建议</h3>
                <p className="text-slate-400 text-sm">
                  有新功能想法？告诉我们您的需求
                </p>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center">
                <MessageSquare className="w-10 h-10 text-accent-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">其他反馈</h3>
                <p className="text-slate-400 text-sm">
                  文档错误、用户体验等
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
