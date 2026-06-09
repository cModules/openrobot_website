import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight, Bot, Eye, Hand, Zap, Cpu, Box, Users, GraduationCap, Headphones, Globe, TrendingUp, ShieldCheck } from "lucide-react";
import { useProducts } from "@/lib/useData";

export default function Products() {
  const { products } = useProducts();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-display font-bold text-white mb-4">
              产品系列
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              智能工业机器人、视觉传感器、夹爪等完整解决方案
            </p>
          </div>

          {products.map((category, catIdx) => (
            <div key={category.id} className="mb-20">
              <h2 className="text-3xl font-display font-bold text-white mb-10 flex items-center gap-3">
                {catIdx === 0 && <Bot className="w-8 h-8 text-accent-500" />}
                {catIdx === 1 && <Eye className="w-8 h-8 text-primary-500" />}
                {catIdx === 2 && <Hand className="w-8 h-8 text-accent-400" />}
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {category.items.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all group"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/2 aspect-square md:aspect-auto bg-slate-800">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="md:w-1/2 p-8 flex flex-col">
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          {product.name}
                        </h3>
                        <p className="text-slate-400 mb-6 flex-grow">
                          {product.description}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {product.specs.map((spec, specIdx) => (
                            <li
                              key={specIdx}
                              className="flex items-center gap-2 text-slate-300"
                            >
                              <Check className="w-4 h-4 text-accent-500 flex-shrink-0" />
                              <span className="text-sm">{spec}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-accent-400">
                            {product.price}
                          </span>
                          <button className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2">
                            立即咨询
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              为什么选择 OpenRoboOLP？
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <Zap className="w-12 h-12 text-accent-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">免费使用</h3>
              <p className="text-slate-400">
                永久免费使用，无功能限制，无订阅费用
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <Cpu className="w-12 h-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">高性能</h3>
              <p className="text-slate-400">
                基于 Pinocchio 的高性能运动学求解，支持实时仿真
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <Box className="w-12 h-12 text-accent-400 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">易扩展</h3>
              <p className="text-slate-400">
                模块化架构，基于 Jinja2 的后处理器，添加新品牌不到 30 分钟
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              我们的服务
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              专业的技术支持与服务，助力您的机器人项目取得成功
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">技术培训</h3>
              <p className="text-slate-400 mb-6">
                提供专业的工业机器人离线编程培训课程，从入门到精通。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>现场培训服务</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>在线学习平台</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>定制化课程</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">技术支持</h3>
              <p className="text-slate-400 mb-6">
                专业的技术支持团队，提供及时的技术咨询和解决方案。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>在线技术咨询</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>远程调试支持</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>问题快速响应</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">定制开发</h3>
              <p className="text-slate-400 mb-6">
                根据您的需求提供定制化的软硬件解决方案。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>后处理器定制</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>算法优化</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>系统集成</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">硬件采购</h3>
              <p className="text-slate-400 mb-6">
                配套的工业机器人、视觉传感器、夹爪等硬件产品供应。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>品牌机器人</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>视觉传感器</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>夹爪配件</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">咨询服务</h3>
              <p className="text-slate-400 mb-6">
                专业的工业机器人应用咨询，帮助您规划最佳解决方案。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>技术方案评估</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>项目可行性分析</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>成本效益分析</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">维护服务</h3>
              <p className="text-slate-400 mb-6">
                定期的设备维护与升级服务，确保系统始终保持最佳状态。
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>定期巡检</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>固件升级</span>
                </li>
                <li className="flex items-center gap-2 text-slate-300">
                  <Check className="w-5 h-5 text-accent-500" />
                  <span>故障修复</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary-900 to-accent-900 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              准备开始您的机器人项目？
            </h2>
            <p className="text-slate-300 text-xl mb-8 max-w-2xl mx-auto">
              联系我们的专业团队，获取免费的技术咨询和方案评估
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                立即咨询
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link to="/contact" className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                联系方式
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
