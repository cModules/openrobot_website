/**
 * 站点内容数据层。
 *
 * 全站内容集中在 src/data/content.json 一个文件里，构建时直接打进产物：
 *   - 访客侧零额外网络请求，不占用 EdgeOne 免费版额度
 *   - 不需要任何后端服务
 *   - 内容变更有完整的 git 历史
 *
 * 内容由后台管理系统（admin-app）通过 GitHub Contents API 直接提交更新，
 * 提交后 EdgeOne 自动重建，约 1-2 分钟生效。
 */
import content from '@/data/content.json';

// 站点信息
export interface SiteInfo {
  name: string;
  logoText: string;
  email: string;
  /** roboWorld 源码仓库地址 */
  github: string;
  wechatId: string;
  wechatQr: string;
  footerDescription: string;
  address: string;
  workTime: string;
  workTimeNote: string;
}

// 产品数据类型定义
export interface ProductItem {
  id: string;
  name: string;
  description: string;
  /** 留空时页面会渲染图标占位块，避免外链图片失效导致破图 */
  image?: string;
  price: string;
  /** 外部下单/购买链接（如闲鱼商品页）。有值时产品卡展示购买按钮 */
  purchaseUrl?: string;
  /**
   * 产品介绍页在 Blob Storage 里的路径。
   * 填了之后产品卡会出现「产品介绍」入口，点进去用 iframe 加载
   * /api/asset/<introPath>，例如 products/roboworld/index.html
   */
  introPath?: string;
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
  /** 网盘提取码；有值时下载页会展示并支持一键复制 */
  code?: string;
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
  /** 文档地址，可填网盘、GitHub 或任意外链 */
  link: string;
}

/**
 * 客户案例。
 *
 * image/coverPath 二选一：
 *   image     —— 资源库里的图片路径，会经 /api/asset 读取
 *   coverPath —— 一个完整 HTML 案例页（和产品介绍页同理），点进详情页用 iframe 加载
 */
export interface CaseItem {
  id: string;
  /** 案例标题 */
  title: string;
  /** 客户或项目方名称 */
  client: string;
  /** 所属行业，用于筛选 */
  industry: string;
  /** 一句话摘要，卡片上展示 */
  summary: string;
  /** 详细正文，支持多段，每段一个字符串 */
  details: string[];
  /** 卡片配图，填资源库路径（不含 /api/asset 前缀也可） */
  image: string;
  /** 案例详情页路径（HTML），填了才会出现「查看详情」 */
  coverPath?: string;
  /** 达成的效果，如「效率提升 40%」 */
  results: string[];
  /** 使用的产品，如 RoboWorld、SO-ARM-101 */
  tags: string[];
  date: string;
}

/** 内容文件的顶层结构 */
export interface SiteContent {
  site: SiteInfo;
  products: ProductCategory[];
  downloads: DownloadItem[];
  documentation: Documentation[];
  cases: CaseItem[];
}

export const contentData = content as SiteContent;

export const siteInfo: SiteInfo = contentData.site;
export const products: ProductCategory[] = contentData.products;
export const downloads: DownloadItem[] = contentData.downloads;
export const documentation: Documentation[] = contentData.documentation;
export const cases: CaseItem[] = contentData.cases ?? [];

/** 生成唯一 ID */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export default {
  getProducts: () => products,
  getDownloads: () => downloads,
  getDocumentation: () => documentation,
};
