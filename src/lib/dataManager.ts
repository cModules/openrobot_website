// 产品数据类型定义
export interface ProductItem {
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
  items: ProductItem[];
}

// 下载数据类型定义
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

// 初始产品数据 - OpenRobot 硬件产品
export const initialProducts: ProductCategory[] = [
  {
    id: 'cat-1',
    category: '工业机器人',
    items: [
      {
        id: 'prod-1',
        name: 'UR5e 协作机器人',
        description: 'Universal Robots 5kg 协作机器人，示教器编程，支持 ROS/ROS2',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20cobot%20robot%20arm%20UR5%20white%20background&image_size=square',
        price: '¥98,000',
        specs: ['负载 5kg', '臂展 850mm', '重复精度 ±0.03mm', 'ROS/ROS2 支持'],
      },
      {
        id: 'prod-2',
        name: 'UR10e 协作机器人',
        description: 'Universal Robots 10kg 协作机器人，适合中大型负载任务',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%20robot%20arm%20cobot%2010kg%20white%20background&image_size=square',
        price: '¥128,000',
        specs: ['负载 10kg', '臂展 1300mm', '重复精度 ±0.05mm', 'IP54 防护'],
      },
    ],
  },
  {
    id: 'cat-2',
    category: '视觉传感器',
    items: [
      {
        id: 'prod-3',
        name: '工业 3D 视觉传感器',
        description: '高精度 3D 视觉系统，支持结构光和双目立体视觉',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=industrial%203D%20vision%20sensor%20camera%20robotics&image_size=square',
        price: '¥45,000',
        specs: ['精度 0.1mm', '视野 300x200mm', '采集速度 2fps', 'RGB-D 输出'],
      },
      {
        id: 'prod-4',
        name: '智能工业相机',
        description: '内置 AI 推理引擎的工业级智能相机，支持多种视觉算法',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20industrial%20camera%20machine%20vision&image_size=square',
        price: '¥18,000',
        specs: ['分辨率 5MP', 'AI 加速单元', '千兆网口', '支持二次开发'],
      },
    ],
  },
  {
    id: 'cat-3',
    category: '夹爪',
    items: [
      {
        id: 'prod-5',
        name: '电动平行夹爪',
        description: '高精度电动夹爪，适合精密装配和抓取任务',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=electric%20parallel%20gripper%20robot%20end%20effector&image_size=square',
        price: '¥8,800',
        specs: ['行程 50mm', '夹持力 200N', '重复精度 ±0.02mm', '支持 IO 控制'],
      },
      {
        id: 'prod-6',
        name: '气动真空夹爪',
        description: '真空吸取式夹爪，适合玻璃、板材等平整物体搬运',
        image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=vacuum%20gripper%20suction%20cup%20robotics&image_size=square',
        price: '¥5,200',
        specs: ['吸力 50N', '反应时间 <50ms', '适配多种吸盘', '即插即用'],
      },
    ],
  },
];

// 初始下载数据 - OpenRoboOLP 软件
export const initialDownloads: DownloadItem[] = [
  {
    id: 'dl-1',
    title: 'OpenRoboOLP',
    description: '智能工业机器人离线编程软件，支持多品牌机器人后处理',
    icon: 'Code',
    platforms: [
      { name: 'Windows', icon: 'Monitor', link: '/downloads/OpenRoboOLP windows版下载地址.txt' },
      { name: 'Linux', icon: 'Server', link: '#' },
      { name: 'macOS', icon: 'Apple', link: '#' },
    ],
    version: 'v0.1.1',
    date: '2024-01-15',
  },
  {
    id: 'dl-2',
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
    id: 'dl-3',
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

export const initialDocumentation: Documentation[] = [
  { id: 'doc-1', title: '快速入门', description: '5 分钟上手指南', icon: 'BookOpen' },
  { id: 'doc-2', title: 'API 参考', description: '完整的函数和类说明', icon: 'Code' },
  { id: 'doc-3', title: '后处理器开发指南', description: '添加新机器人品牌的教程', icon: 'FileText' },
  { id: 'doc-4', title: '硬件规格', description: '支持的机器人型号和规格', icon: 'Terminal' },
];

// 存储键常量
const STORAGE_KEYS = {
  PRODUCTS: 'orolp_products',
  DOWNLOADS: 'orolp_downloads',
  DOCUMENTATION: 'orolp_documentation',
};

// 生成唯一ID
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// 本地存储帮助函数
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error loading from storage: ${key}`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
  }
}

// 数据管理类
class DataManager {
  // 产品管理
  static getProducts(): ProductCategory[] {
    return loadFromStorage(STORAGE_KEYS.PRODUCTS, initialProducts);
  }

  static saveProducts(products: ProductCategory[]): void {
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }

  static addProduct(categoryId: string, product: Omit<ProductItem, 'id'>): ProductCategory[] {
    const products = this.getProducts();
    const category = products.find(cat => cat.id === categoryId);
    if (category) {
      category.items.push({ ...product, id: generateId('prod') });
    }
    this.saveProducts(products);
    return products;
  }

  static updateProduct(categoryId: string, productId: string, updates: Partial<ProductItem>): ProductCategory[] {
    const products = this.getProducts();
    const category = products.find(cat => cat.id === categoryId);
    if (category) {
      const productIndex = category.items.findIndex(item => item.id === productId);
      if (productIndex !== -1) {
        category.items[productIndex] = { ...category.items[productIndex], ...updates };
      }
    }
    this.saveProducts(products);
    return products;
  }

  static deleteProduct(categoryId: string, productId: string): ProductCategory[] {
    const products = this.getProducts();
    const category = products.find(cat => cat.id === categoryId);
    if (category) {
      category.items = category.items.filter(item => item.id !== productId);
    }
    this.saveProducts(products);
    return products;
  }

  static addCategory(category: Omit<ProductCategory, 'id' | 'items'>): ProductCategory[] {
    const products = this.getProducts();
    products.push({ ...category, id: generateId('cat'), items: [] });
    this.saveProducts(products);
    return products;
  }

  static deleteCategory(categoryId: string): ProductCategory[] {
    const products = this.getProducts().filter(cat => cat.id !== categoryId);
    this.saveProducts(products);
    return products;
  }

  // 下载管理
  static getDownloads(): DownloadItem[] {
    return loadFromStorage(STORAGE_KEYS.DOWNLOADS, initialDownloads);
  }

  static saveDownloads(downloads: DownloadItem[]): void {
    saveToStorage(STORAGE_KEYS.DOWNLOADS, downloads);
  }

  static addDownload(download: Omit<DownloadItem, 'id'>): DownloadItem[] {
    const downloads = this.getDownloads();
    downloads.push({ ...download, id: generateId('dl') });
    this.saveDownloads(downloads);
    return downloads;
  }

  static updateDownload(id: string, updates: Partial<DownloadItem>): DownloadItem[] {
    const downloads = this.getDownloads();
    const index = downloads.findIndex(dl => dl.id === id);
    if (index !== -1) {
      downloads[index] = { ...downloads[index], ...updates };
    }
    this.saveDownloads(downloads);
    return downloads;
  }

  static deleteDownload(id: string): DownloadItem[] {
    const downloads = this.getDownloads().filter(dl => dl.id !== id);
    this.saveDownloads(downloads);
    return downloads;
  }

  // 文档管理
  static getDocumentation(): Documentation[] {
    return loadFromStorage(STORAGE_KEYS.DOCUMENTATION, initialDocumentation);
  }

  static saveDocumentation(docs: Documentation[]): void {
    saveToStorage(STORAGE_KEYS.DOCUMENTATION, docs);
  }

  static addDocumentation(doc: Omit<Documentation, 'id'>): Documentation[] {
    const docs = this.getDocumentation();
    docs.push({ ...doc, id: generateId('doc') });
    this.saveDocumentation(docs);
    return docs;
  }

  static updateDocumentation(id: string, updates: Partial<Documentation>): Documentation[] {
    const docs = this.getDocumentation();
    const index = docs.findIndex(doc => doc.id === id);
    if (index !== -1) {
      docs[index] = { ...docs[index], ...updates };
    }
    this.saveDocumentation(docs);
    return docs;
  }

  static deleteDocumentation(id: string): Documentation[] {
    const docs = this.getDocumentation().filter(doc => doc.id !== id);
    this.saveDocumentation(docs);
    return docs;
  }
}

export default DataManager;
