/**
 * 后台配置。
 *
 * 所有值都来自构建期环境变量（见 .env.example），不在代码里写死：
 *   VITE_GITHUB_OWNER   仓库拥有者
 *   VITE_GITHUB_REPO    仓库名
 *   VITE_GITHUB_BRANCH  目标分支
 *   VITE_CONTENT_PATH   内容文件在仓库中的路径
 *   VITE_ADMIN_PASSWORD 登录口令
 *
 * 注意：静态部署时这些变量（含登录口令）会被打进 JS 产物。
 * 真正的写入凭证是管理员在登录页输入的 GitHub Token，
 * 它只存在浏览器里，不会进入仓库。
 */
export const config = {
  owner: import.meta.env.VITE_GITHUB_OWNER || 'cModules',
  repo: import.meta.env.VITE_GITHUB_REPO || 'openrobot_website',
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  contentPath: import.meta.env.VITE_CONTENT_PATH || 'src/data/content.json',
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD || '',
};

/** 后台是否有配置登录口令；没配就跳过口令校验 */
export const hasPassword = config.adminPassword.length > 0;

export function repoUrl(): string {
  return `https://github.com/${config.owner}/${config.repo}`;
}
