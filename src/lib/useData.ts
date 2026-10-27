/**
 * 主站内容读取 hooks。
 *
 * 内容在构建时打包进产物（见 src/data/content.json），因此这些 hook
 * 只是把常量暴露给组件：无网络请求、无运行时状态。
 *
 * 后台管理系统改动内容后，需要重新构建/部署才会在线上生效。
 */
import {
  products,
  downloads,
  documentation,
  cases,
} from './dataManager';
import type {
  ProductCategory,
  DownloadItem,
  Documentation,
  CaseItem,
} from './dataManager';

export function useProducts(): { products: ProductCategory[] } {
  return { products };
}

export function useDownloads(): { downloads: DownloadItem[] } {
  return { downloads };
}

export function useDocumentation(): { documentation: Documentation[] } {
  return { documentation };
}

export function useCases(): { cases: CaseItem[] } {
  return { cases };
}
