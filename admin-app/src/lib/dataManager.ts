export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  specs: string[];
}

export interface ProductCategory {
  id: string;
  category: string;
  items: Product[];
}

export interface Platform {
  name: string;
  icon: string;
  link: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  platforms: Platform[];
  version: string;
  date: string;
}

export interface Documentation {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const PRODUCTS_KEY = 'orolp_products';
const DOWNLOADS_KEY = 'orolp_downloads';
const DOCUMENTATION_KEY = 'orolp_documentation';

const defaultProducts: ProductCategory[] = [
  {
    id: '1',
    category: '工业机器人',
    items: [
      {
        id: 'p1',
        name: 'UR5e 协作机器人',
        description: 'Universal Robots 5kg 协作机器人，示教器编程，支持 ROS/ROS2',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20cobot%20robot%20arm%20UR5%20white%20background&image_size=square',
        price: '¥98,000',
        specs: ['负载 5kg', '臂展 850mm', '重复精度 ±0.03mm', 'ROS/ROS2 支持'],
      },
      {
        id: 'p2',
        name: 'UR10e 协作机器人',
        description: 'Universal Robots 10kg 协作机器人，适合中大型负载任务',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20robot%20arm%20cobot%2010kg%20white%20background&image_size=square',
        price: '¥128,000',
        specs: ['负载 10kg', '臂展 1300mm', '重复精度 ±0.05mm', 'IP54 防护'],
      },
    ],
  },
  {
    id: '2',
    category: '视觉传感器',
    items: [
      {
        id: 'p3',
        name: '工业 3D 视觉传感器',
        description: '高精度 3D 视觉系统，支持结构光和双目立体视觉',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%203D%20vision%20sensor%20camera%20robotics&image_size=square',
        price: '¥45,000',
        specs: ['精度 0.1mm', '视野 300x200mm', '采集速度 2fps', 'RGB-D 输出'],
      },
      {
        id: 'p4',
        name: '智能工业相机',
        description: '内置 AI 推理引擎的工业级智能相机，支持多种视觉算法',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20industrial%20camera%20machine%20vision&image_size=square',
        price: '¥18,000',
        specs: ['分辨率 5MP', 'AI 加速单元', '千兆网口', '支持二次开发'],
      },
    ],
  },
  {
    id: '3',
    category: '夹爪',
    items: [
      {
        id: 'p5',
        name: '电动平行夹爪',
        description: '高精度电动夹爪，适合精密装配和抓取任务',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20parallel%20gripper%20robot%20end%20effector&image_size=square',
        price: '¥8,800',
        specs: ['行程 50mm', '夹持力 200N', '重复精度 ±0.02mm', '支持 IO 控制'],
      },
      {
        id: 'p6',
        name: '气动真空夹爪',
        description: '真空吸取式夹爪，适合玻璃、板材等平整物体搬运',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vacuum%20gripper%20suction%20cup%20robotics&image_size=square',
        price: '¥5,200',
        specs: ['吸力 50N', '反应时间 <50ms', '适配多种吸盘', '即插即用'],
      },
    ],
  },
];

const defaultDownloads: DownloadItem[] = [
  {
    id: 'd1',
    title: 'OpenRoboOLP',
    description: '开源工业机器人离线编程软件，支持多品牌机器人后处理',
    icon: 'Code',
    platforms: [
      { name: 'Windows', icon: 'Monitor', link: '#' },
      { name: 'macOS', icon: 'Apple', link: '#' },
      { name: 'Linux', icon: 'Server', link: '#' },
    ],
    version: 'v0.1.0 Alpha',
    date: '2024-01-15',
  },
  {
    id: 'd2',
    title: 'Python API',
    description: 'OpenRoboOLP Python 包，通过 pip 安装',
    icon: 'Terminal',
    platforms: [
      { name: 'Python 3.9+', icon: 'Terminal', link: '#' },
    ],
    version: 'v0.1.0',
    date: '2024-01-15',
  },
  {
    id: 'd3',
    title: '示例代码',
    description: '抓取放置、焊接路径、多机器人同步等示例',
    icon: 'FileText',
    platforms: [
      { name: 'GitHub', icon: 'Code', link: 'https://github.com' },
    ],
    version: '-',
    date: '2024-01-15',
  },
];

const defaultDocumentation: Documentation[] = [
  { id: 'doc1', title: '快速入门', description: '5 分钟上手指南', icon: 'BookOpen' },
  { id: 'doc2', title: 'API 参考', description: '完整的函数和类说明', icon: 'Code' },
  { id: 'doc3', title: '后处理器开发指南', description: '添加新机器人品牌的教程', icon: 'FileText' },
  { id: 'doc4', title: '硬件规格', description: '详细的硬件参数文档', icon: 'Terminal' },
];

export class DataManager {
  static getProducts(): ProductCategory[] {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return defaultProducts;
      }
    }
    this.saveProducts(defaultProducts);
    return defaultProducts;
  }

  static saveProducts(products: ProductCategory[]): void {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  }

  static getDownloads(): DownloadItem[] {
    const data = localStorage.getItem(DOWNLOADS_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return defaultDownloads;
      }
    }
    this.saveDownloads(defaultDownloads);
    return defaultDownloads;
  }

  static saveDownloads(downloads: DownloadItem[]): void {
    localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
  }

  static getDocumentation(): Documentation[] {
    const data = localStorage.getItem(DOCUMENTATION_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return defaultDocumentation;
      }
    }
    this.saveDocumentation(defaultDocumentation);
    return defaultDocumentation;
  }

  static saveDocumentation(documentation: Documentation[]): void {
    localStorage.setItem(DOCUMENTATION_KEY, JSON.stringify(documentation));
  }

  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static clearAll(): void {
    localStorage.removeItem(PRODUCTS_KEY);
    localStorage.removeItem(DOWNLOADS_KEY);
    localStorage.removeItem(DOCUMENTATION_KEY);
  }

  static resetToDefault(): void {
    this.saveProducts(defaultProducts);
    this.saveDownloads(defaultDownloads);
    this.saveDocumentation(defaultDocumentation);
  }
}
