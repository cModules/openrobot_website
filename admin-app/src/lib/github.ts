/**
 * GitHub Contents API 客户端。
 *
 * 后台是纯静态页面，没有自己的服务端。内容的读取与发布
 * 都直接由管理员浏览器调用 GitHub API 完成：
 *   读取 GET  /repos/{owner}/{repo}/contents/{path}?ref={branch}
 *   发布 PUT  /repos/{owner}/{repo}/contents/{path}
 *
 * Token 只保存在管理员本机浏览器，不会写入仓库。
 */
import { config } from './config';
import type { SiteContent } from './types';

const API_BASE = 'https://api.github.com';

export interface ContentFile {
  content: SiteContent;
  sha: string;
}

interface ContentsResponse {
  content?: string;
  sha?: string;
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };
}

/** TextEncoder → base64，保证中文正确编码 */
function utf8ToBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

/** base64 → UTF-8 字符串 */
function base64ToUtf8(input: string): string {
  const binary = atob(input.replace(/\n/g, ''));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function parseError(res: Response): Promise<string> {
  const data = (await res.json().catch(() => ({}))) as ErrorResponse;
  return data.message || `请求失败 (${res.status})`;
}

/** 校验 Token 是否有权访问目标仓库 */
export async function verifyToken(token: string): Promise<void> {
  const res = await fetch(`${API_BASE}/repos/${config.owner}/${config.repo}`, {
    headers: authHeaders(token),
  });
  if (res.ok) return;
  if (res.status === 401) throw new Error('Token 无效或已过期');
  if (res.status === 404) throw new Error(`找不到仓库 ${config.owner}/${config.repo}，请检查 Token 权限`);
  throw new Error(await parseError(res));
}

/** 拉取内容文件，连同 sha（发布时需要） */
export async function fetchContent(token: string): Promise<ContentFile> {
  const url = `${API_BASE}/repos/${config.owner}/${config.repo}/contents/${config.contentPath}?ref=${config.branch}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error(`仓库里没有 ${config.contentPath}`);
    }
    throw new Error(await parseError(res));
  }
  const data = (await res.json()) as ContentsResponse;
  if (!data.content || !data.sha) {
    throw new Error('GitHub 返回的内容格式异常');
  }
  try {
    return {
      content: JSON.parse(base64ToUtf8(data.content)) as SiteContent,
      sha: data.sha,
    };
  } catch {
    throw new Error('内容文件不是合法 JSON');
  }
}

/** 把内容提交到仓库，返回 commit 页面地址 */
export async function commitContent(
  token: string,
  content: SiteContent,
  sha: string,
  message: string,
): Promise<string> {
  const res = await fetch(
    `${API_BASE}/repos/${config.owner}/${config.repo}/contents/${config.contentPath}`,
    {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({
        message,
        content: utf8ToBase64(`${JSON.stringify(content, null, 2)}\n`),
        sha,
        branch: config.branch,
      }),
    },
  );
  if (!res.ok) {
    if (res.status === 409) {
      throw new Error('仓库内容已被其他地方修改，请刷新后重新编辑');
    }
    throw new Error(await parseError(res));
  }
  const data = (await res.json()) as {
    content?: { sha?: string };
    commit?: { html_url?: string };
  };
  return data.commit?.html_url || '';
}
