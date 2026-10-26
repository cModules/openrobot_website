import { useState, type FormEvent } from 'react';
import { KeyRound, LogIn, AlertCircle, Eye } from 'lucide-react';
import { useContent } from '@/lib/store';
import { config, hasPassword, repoUrl } from '@/lib/config';
import { inputClass } from '@/components/Field';

export default function Login() {
  const { login, loginLocal } = useContent();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token.trim()) {
      setError('请填写 GitHub Token');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await login(token.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setBusy(false);
    }
  };

  const enterDemo = () => {
    setBusy(true);
    setError('');
    try {
      loginLocal(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : '进入失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-display font-bold text-white mb-2">
          内容后台
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          改动发布后会提交到{' '}
          <a
            href={repoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-400 hover:underline"
          >
            {config.owner}/{config.repo}
          </a>
          ，EdgeOne 自动重建站点。
        </p>

        {hasPassword ? (
          <div className="mb-5">
            <span className="block text-white font-medium mb-2">登录口令</span>
            <input
              type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              className={inputClass}
              placeholder="输入后台登录口令"
            />
          </div>
        ) : (
          <div className="mb-5 flex items-start gap-2 px-4 py-3 bg-yellow-900/20 border border-yellow-700/40 rounded-lg text-yellow-200 text-xs">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              未配置 VITE_ADMIN_PASSWORD，任何人打开此页面都能编辑。部署前请在
              .env 中设置口令。
            </span>
          </div>
        )}

        <div className="mb-6">
          <span className="block text-white font-medium mb-2">
            GitHub Token
          </span>
          <input
            type="password"
            value={token}
            onChange={event => setToken(event.target.value)}
            className={inputClass}
            placeholder="github_pat_... 或 ghp_..."
          />
          <span className="block text-slate-500 text-xs mt-1.5">
            需要对目标仓库有 Contents 读写权限；Token
            只保存在本机浏览器，不会写入仓库。
            <a
              href="https://github.com/settings/tokens?type=beta"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-accent-400 hover:underline"
            >
              去创建
            </a>
          </span>
        </div>

        {error ? (
          <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="w-full px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
        >
          {busy ? <KeyRound className="w-5 h-5 animate-pulse" /> : <LogIn className="w-5 h-5" />}
          {busy ? '正在连接…' : '连接 GitHub'}
        </button>

        <div className="mt-5 pt-5 border-t border-slate-800">
          <button
            type="button"
            onClick={enterDemo}
            disabled={busy}
            className="w-full px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            先看看界面（本地试用）
          </button>
          <span className="block text-slate-500 text-xs mt-2">
            直接查看后台界面与仓库当前内容，改动只存在本机浏览器，
            <span className="text-slate-400">不会提交到 GitHub</span>。
            要正式使用请在上方填入 Token。
          </span>
        </div>
      </form>
    </div>
  );
}
