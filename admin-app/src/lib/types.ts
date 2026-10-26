/** 后台与主站共用的内容结构，与 src/data/content.json 一一对应。 */

export interface SiteInfo {
  name: string;
  logoText: string;
  email: string;
  github: string;
  wechatId: string;
  wechatQr: string;
  footerDescription: string;
  address: string;
  workTime: string;
  workTimeNote: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  /** 留空时主站渲染图标占位块 */
  image: string;
  price: string;
  /** 外部下单链接（如闲鱼），有值时主站展示购买按钮 */
  purchaseUrl: string;
  /**
   * 产品介绍页在 Blob Storage 里的路径。
   * 填了之后主站会出现「产品介绍」入口，例如 products/roboworld/index.html
   */
  introPath?: string;
  specs: string[];
}

export interface ProductCategory {
  id: string;
  category: string;
  items: ProductItem[];
}

export interface Platform {
  name: string;
  icon: string;
  link: string;
  /** 网盘提取码，有值时下载页展示并可一键复制 */
  code: string;
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
  link: string;
}

export interface SiteContent {
  site: SiteInfo;
  products: ProductCategory[];
  downloads: DownloadItem[];
  documentation: Documentation[];
}

/**
 * 可选图标名。必须是主站 IconMap（src/pages/Download.tsx）
 * 里已注册的键，否则会静默回退成默认图标。
 */
export const ICON_OPTIONS = [
  'Code',
  'Terminal',
  'FileText',
  'BookOpen',
  'Monitor',
  'Server',
  'CloudDownload',
  'Mail',
  'Box',
  'Cpu',
  'Download',
] as const;

/** 生成唯一 ID */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** 把「一行一条」的文本解析成数组，自动去掉空行与首尾空格 */
export function parseLines(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

/** 把数组渲染成「一行一条」的文本 */
export function toLines(list: string[]): string {
  return (list || []).join('\n');
}
