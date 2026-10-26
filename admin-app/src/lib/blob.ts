/**
 * 资源管理接口封装。
 *
 * 后台和主站是分开部署的，/api/blob 跑在主站域名下，
 * 所以这里需要知道主站地址。管理口令只存浏览器 localStorage，
 * 不进仓库、不打进 JS 产物，和 GitHub Token 的处理方式一致。
 */

const BASE_KEY = 'or_blob_base';
const TOKEN_KEY = 'or_blob_token';

const DEFAULT_BASE = import.meta.env.VITE_SITE_API_BASE || '';

export interface BlobConfig {
  baseUrl: string;
  token: string;
}

export function getBlobConfig(): BlobConfig {
  return {
    baseUrl: localStorage.getItem(BASE_KEY) || DEFAULT_BASE,
    token: localStorage.getItem(TOKEN_KEY) || '',
  };
}

export function saveBlobConfig(baseUrl: string, token: string) {
  localStorage.setItem(BASE_KEY, baseUrl.trim());
  localStorage.setItem(TOKEN_KEY, token.trim());
}

export function assetUrl(key: string): string {
  const { baseUrl } = getBlobConfig();
  return `${baseUrl}/api/asset/${key}`;
}

function guessContentType(name: string): string {
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  const map: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.ttf': 'font/ttf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.docx':
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };
  return map[ext] || 'application/octet-stream';
}

async function request<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const { baseUrl, token } = getBlobConfig();
  if (!baseUrl) {
    throw new Error('还没填主站地址，先在上方连接设置里配置');
  }
  if (!token) {
    throw new Error('还没填管理口令，先在上方连接设置里配置');
  }

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...(init.headers || {}), 'x-admin-token': token },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) {
    throw new Error(data?.error || `请求失败（HTTP ${res.status}）`);
  }
  return data;
}

export function listAssets(prefix = '') {
  return request<{ ok: true; blobs: { key: string }[] }>(
    `/api/blob?prefix=${encodeURIComponent(prefix)}`,
  );
}

export function deleteAsset(key: string) {
  return request(`/api/blob?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
  });
}

export interface UploadResult {
  ok: boolean;
  key: string;
}

/**
 * 上传单个文件。
 * 小文件（≤4MB）直接经函数写入；大文件走预签名 URL 直传 COS，
 * 字节流不经过边缘函数，否则 100M 的安装包根本传不上去。
 */
export async function uploadAsset(file: File, key: string): Promise<UploadResult> {
  if (file.size <= 4 * 1024 * 1024) {
    return request(`/api/blob?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/octet-stream' },
      body: file,
    });
  }

  const contentType = file.type || guessContentType(file.name);
  const signed = await request<{ uploadUrl: string; key: string }>('/api/blob', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, contentType }),
  });

  const res = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: file,
  });

  if (!res.ok) {
    throw new Error(`直传失败（HTTP ${res.status}）`);
  }

  return { ok: true, key: signed.key };
}

/** 从 File 上取相对路径：选择目录上传时浏览器会给出 webkitRelativePath */
export function relativePathOf(file: File): string {
  return (
    (file as File & { webkitRelativePath?: string }).webkitRelativePath ||
    file.name
  );
}
