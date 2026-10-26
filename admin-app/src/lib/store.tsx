/**
 * 后台内容状态。
 *
 * 数据流：
 *   登录(Token) → 从 GitHub 拉取 content.json → 编辑(存本地草稿) → 发布(提交回 GitHub)
 *
 * Token 存在 localStorage，草稿存在 localStorage（防止刷新丢改动），
 * 两者都只在管理员本机浏览器里，不进仓库。
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { commitContent, fetchContent, verifyToken } from './github';
import { config, hasPassword } from './config';
import localContent from '@/data/content.json';
import type { SiteContent } from './types';

const TOKEN_KEY = 'or_admin_token';
const DRAFT_KEY = 'or_admin_draft';
// 本地试用：不连 GitHub，直接预览仓库里的内容快照，改动只存本机
const DEMO_TOKEN = 'local-demo';
const LOCAL_CONTENT = localContent as unknown as SiteContent;

interface ContentContextValue {
  token: string | null;
  content: SiteContent | null;
  loading: boolean;
  publishing: boolean;
  dirty: boolean;
  error: string;
  repoLabel: string;
  lastCommitUrl: string;
  isDemo: boolean;
  login: (token: string, password: string) => Promise<void>;
  loginLocal: (password: string) => void;
  logout: () => void;
  update: (updater: (current: SiteContent) => SiteContent) => void;
  reload: () => Promise<void>;
  discard: () => Promise<void>;
  publish: () => Promise<void>;
  clearError: () => void;
}

const ContentContext = createContext<ContentContextValue | undefined>(
  undefined,
);

export function useContent(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return ctx;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(TOKEN_KEY),
  );
  const [content, setContent] = useState<SiteContent | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [lastCommitUrl, setLastCommitUrl] = useState('');

  const load = useCallback(async (tok: string) => {
    if (tok === DEMO_TOKEN) {
      setLoading(true);
      setError('');
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          setContent(JSON.parse(draft) as SiteContent);
          setDirty(true);
        } catch {
          setContent(LOCAL_CONTENT);
        }
      } else {
        setContent(LOCAL_CONTENT);
      }
      setSha(DEMO_TOKEN);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const remote = await fetchContent(tok);
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          setContent(JSON.parse(draft) as SiteContent);
          setDirty(true);
        } catch {
          setContent(remote.content);
        }
      } else {
        setContent(remote.content);
      }
      setSha(remote.sha);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载内容失败');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  const login = useCallback(async (nextToken: string, password: string) => {
    if (hasPassword && password !== config.adminPassword) {
      throw new Error('登录口令不正确');
    }
    await verifyToken(nextToken);
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  }, []);

  const loginLocal = useCallback((password: string) => {
    if (hasPassword && password !== config.adminPassword) {
      throw new Error('登录口令不正确');
    }
    localStorage.setItem(TOKEN_KEY, DEMO_TOKEN);
    setToken(DEMO_TOKEN);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(DRAFT_KEY);
    setToken(null);
    setContent(null);
    setSha(null);
    setDirty(false);
    setLastCommitUrl('');
    setError('');
  }, []);

  const update = useCallback(
    (updater: (current: SiteContent) => SiteContent) => {
      setContent(prev => {
        if (!prev) return prev;
        const next = updater(prev);
        localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
        return next;
      });
      setDirty(true);
    },
    [],
  );

  const discard = useCallback(async () => {
    localStorage.removeItem(DRAFT_KEY);
    setDirty(false);
    if (token) await load(token);
  }, [token, load]);

  const publish = useCallback(async () => {
    if (token === DEMO_TOKEN) {
      const message =
        '演示模式只在本机预览，不会提交到 GitHub。请用真实 Token 登录后再发布。';
      setError(message);
      throw new Error(message);
    }
    if (!token || !content || !sha) return;
    setPublishing(true);
    setError('');
    try {
      const url = await commitContent(
        token,
        content,
        sha,
        `content: 更新站点内容 ${new Date().toLocaleString('zh-CN')}`,
      );
      // 发布成功后刷新 sha，并清掉本地草稿
      const fresh = await fetchContent(token);
      setContent(fresh.content);
      setSha(fresh.sha);
      localStorage.removeItem(DRAFT_KEY);
      setDirty(false);
      setLastCommitUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : '发布失败');
      throw e;
    } finally {
      setPublishing(false);
    }
  }, [token, content, sha]);

  const reload = useCallback(async () => {
    if (token) await load(token);
  }, [token, load]);

  const value: ContentContextValue = {
    token,
    content,
    loading,
    publishing,
    dirty,
    error,
    repoLabel: `${config.owner}/${config.repo}`,
    lastCommitUrl,
    isDemo: token === DEMO_TOKEN,
    login,
    loginLocal,
    logout,
    update,
    reload,
    discard,
    publish,
    clearError: () => setError(''),
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}
