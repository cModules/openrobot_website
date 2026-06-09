import { Link } from "react-router-dom";
import { Cpu, ArrowRight, Layers, Bot, Settings, Code, GitBranch } from "lucide-react";
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
    title: "离线编程",
    description: "Python API + 可链式运动指令，支持 MoveJ/MoveL 等多种运动模式",
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

const products = [
  {
    name: "UR5e 协作机器人",
    description: "5kg 负载，850mm 臂展，支持 ROS/ROS2",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20cobot%20robot%20arm%20UR5%20white%20background&image_size=square",
    price: "¥98,000",
  },
  {
    name: "工业 3D 视觉传感器",
    description: "精度 0.1mm，支持结构光和双目立体视觉",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%203D%20vision%20sensor%20camera%20robotics&image_size=square",
    price: "¥45,000",
  },
  {
    name: "电动平行夹爪",
    description: "行程 50mm，夹持力 200N，适合精密装配",
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20parallel%20gripper%20robot%20end%20effector&image_size=square",
    price: "¥8,800",
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
              免费 · 专业 · 工业级
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              高性能工业机器人
              <span className="bg-gradient-to-r from-accent-400 via-primary-500 to-accent-400 bg-clip-text text-transparent">
                {" "}离线编程软件
              </span>
            </h1>
            <p className="text-xl text-slate-400 mb-4 max-w-2xl mx-auto">
              OpenRoboOLP 是一款免费、可扩展且由社区驱动的商业 OLP 工具替代品，
              可替代 RoboDK、Robotmaster 和 Delmia。
            </p>
            <p className="text-2xl font-light text-accent-300 mb-10 max-w-2xl mx-auto italic">
              We Build the Factory Automation Future
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
              配套硬件产品
            </h2>
            <p className="text-slate-400 text-lg">
              高性能工业机器人、视觉传感器、夹爪等完整解决方案
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-primary-500/50 transition-all group"
              >
                <div className="aspect-square bg-slate-800 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent-400">
                      {product.price}
                    </span>
                    <Link
                      to="/products"
                      className="text-primary-400 hover:text-primary-300 font-medium flex items-center gap-1"
                    >
                      了解更多
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
              <div className="aspect-video bg-slate-900 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Cpu className="w-16 h-16 text-accent-500 mx-auto mb-4" />
                  <p className="text-slate-400">仿真环境预览</p>
                </div>
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
              下载 OpenRoboOLP，探索工业机器人离线编程的无限可能
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
