import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send, Check, MessageSquare, AlertCircle, Lightbulb, Bug } from "lucide-react";

export default function Feedback() {
  const [feedbackType, setFeedbackType] = useState<"suggestion" | "bug" | "other">("suggestion");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoLink = `mailto:jay.cn@outlook.com?subject=${encodeURIComponent(formData.subject || '反馈建议')}&body=${encodeURIComponent(`姓名: ${formData.name}\n邮箱: ${formData.email}\n类型: ${feedbackType === 'suggestion' ? '功能建议' : feedbackType === 'bug' ? '问题报告' : '其他'}\n\n${formData.message}`)}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", subject: "", message: "" });
                    }}
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
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
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
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
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
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
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
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all resize-none"
                      placeholder="请详细描述您遇到的问题或建议..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    提交反馈
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
