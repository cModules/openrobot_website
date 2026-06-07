import { Mail, Phone, MapPin, Clock, Send, Check } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <div className="text-center mb-16">
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              联系我们
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              无论是商务合作还是技术支持，我们都会尽快回复您
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8">
                <h2 className="text-2xl font-display font-bold text-white mb-8">
                  联系方式
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">邮箱</h4>
                      <p className="text-slate-400">jay.cn@outlook.com</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">飞书联系</h4>
                      <p className="text-slate-400 mb-2">扫描二维码添加联系</p>
                      <img
                        src="/feishu-qrcode.jpg"
                        alt="飞书二维码"
                        className="w-48 h-48 object-contain bg-white rounded-lg"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">地址</h4>
                      <p className="text-slate-400">上海市浦东新区张江高科技园区</p>
                      <p className="text-slate-400">科苑路 88 号</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-accent-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium mb-1">工作时间</h4>
                      <p className="text-slate-400">周一至周五: 9:00 - 18:00</p>
                      <p className="text-slate-400">周六至周日: 休息</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                <h2 className="text-2xl font-display font-bold text-white mb-6">
                  商务合作
                </h2>
                <div className="space-y-4 text-slate-400">
                  <p>
                    我们提供多种合作形式，包括但不限于：
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500" />
                      <span>软件定制开发服务</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500" />
                      <span>工业机器人系统集成</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500" />
                      <span>技术培训与咨询服务</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500" />
                      <span>硬件产品代理销售</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-accent-500" />
                      <span>社区生态共建</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
              <h2 className="text-2xl font-display font-bold text-white mb-8">
                发送消息
              </h2>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-accent-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-accent-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    消息已发送！
                  </h3>
                  <p className="text-slate-400 mb-8">
                    我们会尽快与您取得联系。
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: "", email: "", company: "", subject: "", message: "" });
                    }}
                    className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-lg transition-all"
                  >
                    继续发送
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        姓名 *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
                        placeholder="您的姓名"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        邮箱 *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-white font-medium mb-2">
                      公司
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
                      placeholder="公司名称（选填）"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-white font-medium mb-2">
                      主题 *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all"
                      placeholder="咨询主题"
                    />
                  </div>

                  <div className="mb-8">
                    <label className="block text-white font-medium mb-2">
                      消息内容 *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-accent-500 transition-all resize-none"
                      placeholder="请详细描述您的需求..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    发送消息
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
