import { Link } from "react-router-dom";
import { ArrowRight, Layers, Bot, Settings, Code, GitBranch, Box, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const features = [
  {
    icon: Bot,
    title: "多品牌机器人支持",
    description: "基于 URDF 统一建模，支持 UR、KUKA、ABB、FANUC、汇川等主流品牌",
  },
  {
    icon: Code,
    title: "仿真与离线编程",
    description: "在仿真环境里完成轨迹规划与碰撞检测，再导出到真实机器人执行",
  },
  {
    icon: GitBranch,
    title: "后处理器生态",
    description: "基于 Jinja2 模板的代码生成，社区可扩展，添加新品牌不到 30 分钟",
  },
];

const supportedBrands = [
  { name: "Universal Robots", model: "UR5e/UR10e" },
  { name: "KUKA", model: "KRC4" },
  { name: "ABB", model: "IRC5" },
  { name: "FANUC", model: "R-30iB" },
  { name: "汇川", model: "InoTeach" },
];

const offerings = [
  {
    name: "roboWorld",
    description: "机器人仿真编程软件，免费使用，支持多品牌后处理",
    icon: Code,
    price: "免费",
    to: "/download",
  },
  {
    name: "SO101 开源机器人套件",
    description: "6 自由度开源机械臂，兼容 LeRobot 生态，闲鱼下单",
    icon: Box,
    price: "见闲鱼",
    to: "/products",
  },
  {
    name: "方案顾问",
    description: "机器人自动化项目选型与方案设计咨询，按项目面议",
    icon: Users,
    price: "面议",
    to: "/products",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar />

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-950/50 to-slate-950" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-950/50 border border-accent-800 rounded-full text-accent-400 text-sm mb-8">
              <span className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
              仿真编程 · 开源套件 · 方案咨询
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              机器人
              <span className="bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">
                {" "}仿真编程
              </span>
              {" "}与开源套件
            </h1>
            <p className="text-xl text-slate-400 mb-4 max-w-2xl mx-auto">
              roboWorld 是一款免费、可扩展的机器人仿真编程软件，为商业 OLP 工具提供替代方案；
              配合 SO101 开源机器人套件与方案顾问服务，帮你把想法真正跑起来。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/download"
                className="px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-primary-500/25 flex items-center justify-center gap-2"
              >
                开始下载
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/products"
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all border border-slate-700"
              >
                查看产品
              </Link>
            </div>
          </div>

          <div className="mt-20 grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8 hover:border-accent-500/50 transition-all hover:shadow-xl hover:shadow-accent-500/10 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              支持的机器人品牌
            </h2>
            <p className="text-slate-400 text-lg">
              基于 URDF 统一建模，轻松扩展新品牌
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {supportedBrands.map((brand, idx) => (
              <div
                key={idx}
                className="bg-slate-800 border border-slate-700 rounded-xl px-8 py-4 hover:border-accent-500/50 transition-all"
              >
                <div className="text-lg font-semibold text-white">{brand.name}</div>
                <div className="text-sm text-slate-400">{brand.model}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              产品与服务
            </h2>
            <p className="text-slate-400 text-lg">
              仿真编程软件、开源机器人套件与方案咨询，覆盖从选型到落地的完整链路
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {offerings.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={idx}
                  to={item.to}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all group"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary-900/40 to-accent-900/40 flex items-center justify-center">
                    <Icon className="w-20 h-20 text-accent-400 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-accent-400">
                        {item.price}
                      </span>
                      <span className="text-primary-400 group-hover:text-primary-300 font-medium flex items-center gap-1">
                        了解更多
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-white mb-6">
                强大的开发工具链
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Layers className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      运动学求解
                    </h4>
                    <p className="text-slate-400">
                      基于 Pinocchio 的正/逆运动学，解析 + 数值求解器
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-accent-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-accent-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      碰撞检测
                    </h4>
                    <p className="text-slate-400">
                      FCL 集成，实时碰撞检测与避障
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Code className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      Python API
                    </h4>
                    <p className="text-slate-400">
                      简洁的链式 API，快速编写机器人程序
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700">
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  src="/images/olp_demo.mp4"
                  controls
                  loop
                  muted
                  playsInline
                  preload="none"
                  poster="/robot-logo.png"
                >
                  您的浏览器不支持视频播放
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto">
          <div className="bg-gradient-to-r from-primary-900 to-accent-900 rounded-3xl p-12 text-center">
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              准备好开始了吗？
            </h2>
            <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
              下载 roboWorld，开启你的机器人仿真编程之旅
            </p>
            <Link
              to="/download"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-all"
            >
              立即下载
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
