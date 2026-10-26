import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, ArrowRight, ExternalLink, Zap, Cpu, Box, Users, ClipboardList, Compass, LineChart, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/lib/useData";
import { useContact } from "@/lib/contact";

export default function Products() {
  const { products } = useProducts();
  const contact = useContact();

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
              仿真编程软件、开源机器人套件与方案顾问服务
            </p>
          </div>

          {products.map((category, catIdx) => (
            <div key={category.id} className="mb-20">
              <h2 className="text-3xl font-display font-bold text-white mb-10 flex items-center gap-3">
                {catIdx === 0 && <Cpu className="w-8 h-8 text-accent-500" />}
                {catIdx === 1 && <Box className="w-8 h-8 text-primary-500" />}
                {catIdx === 2 && <Users className="w-8 h-8 text-accent-400" />}
                {category.category}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {category.items.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all group"
                  >
                    <div className="md:flex">
                      <div className="md:w-1/2 aspect-square md:aspect-auto bg-gradient-to-br from-primary-900/40 to-accent-900/40 flex items-center justify-center">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <Box className="w-20 h-20 text-accent-400/70 group-hover:scale-110 transition-transform duration-500" />
                        )}
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
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <span className="text-3xl font-bold text-accent-400">
                            {product.price}
                          </span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {product.introPath ? (
                              <Link
                                to={`/product/${product.id}`}
                                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold rounded-lg transition-all flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                产品介绍
                              </Link>
                            ) : null}
                          {product.purchaseUrl ? (
                            <a
                              href={product.purchaseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                            >
                              前往闲鱼购买
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          ) : (
                            <button
                              type="button"
                              onClick={() => contact.open("wechat")}
                              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
                            >
                              立即咨询
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                          </div>
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
              为什么选择我们？
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <Zap className="w-12 h-12 text-accent-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">软件免费</h3>
              <p className="text-slate-400">
                roboWorld 永久免费使用，无功能限制，无订阅费用
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <Cpu className="w-12 h-12 text-primary-500 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">开源可改</h3>
              <p className="text-slate-400">
                套件基于开源 SO-ARM101 方案，图纸、BOM 与源码全部开放
              </p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
              <Box className="w-12 h-12 text-accent-400 mb-6" />
              <h3 className="text-xl font-semibold text-white mb-3">先仿真后采购</h3>
              <p className="text-slate-400">
                方案顾问服务在仿真里先验证可达性与节拍，再决定买什么
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              方案顾问
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              面向机器人自动化项目的咨询服务，帮你在采购硬件之前先把方案跑通
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">需求梳理</h3>
              <p className="text-slate-400">
                明确应用场景、工艺要求与验收指标，把模糊的想法收敛成可执行的方案边界。
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Compass className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">选型与布局</h3>
              <p className="text-slate-400">
                结合负载、臂展、节拍与预算，给出机器人选型、末端执行器与产线布局建议。
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-accent-500/50 transition-all group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-3">仿真验证</h3>
              <p className="text-slate-400">
                用 roboWorld 搭建仿真环境，提前验证可达性、干涉情况与生产节拍。
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
            <h3 className="text-2xl font-display font-bold text-white mb-6">
              合作方式
            </h3>
            <ol className="grid md:grid-cols-4 gap-6">
              {[
                "沟通需求与场景",
                "输出方案与报价",
                "仿真验证与评审",
                "落地陪跑与答疑",
              ].map((step, idx) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-accent-600 text-white font-semibold flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 pt-1">{step}</span>
                </li>
              ))}
            </ol>
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
              <button type="button" onClick={() => contact.open("wechat")} className="px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                立即咨询
                <ArrowRight className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => contact.open("wechat")} className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all">
                联系方式
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
