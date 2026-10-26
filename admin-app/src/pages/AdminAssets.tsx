import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Upload,
  FolderUp,
  RefreshCw,
  Trash2,
  Copy,
  ExternalLink,
  Link2,
  Loader2,
  File as FileIcon,
} from 'lucide-react';
import { useToast } from '@/components/Toast';
import { Field } from '@/components/Field';
import { inputClass } from '@/components/Field';
import {
  getBlobConfig,
  saveBlobConfig,
  listAssets,
  uploadAsset,
  deleteAsset,
  assetUrl,
  relativePathOf,
  type BlobConfig,
} from '@/lib/blob';

/** 常用目录，选目录上传时可以直接套用 */
const PRESET_PREFIXES = [
  'products/roboworld',
  'products/so-arm101',
  'downloads/roboworld',
  'downloads/so-arm101',
  'images',
  'docs',
];

const panelClass = 'bg-slate-900 border border-slate-800 rounded-xl p-6';

export default function AdminAssets() {
  const { showToast } = useToast();

  const [config, setConfig] = useState<BlobConfig>(() => getBlobConfig());
  const [filter, setFilter] = useState('');
  const [uploadPrefix, setUploadPrefix] = useState('products/roboworld');
  const [blobs, setBlobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  const fileRef = useRef<HTMLInputElement>(null);
  const dirRef = useRef<HTMLInputElement>(null);

  const connected = Boolean(config.baseUrl && config.token);

  const refresh = useCallback(async () => {
    if (!connected) return;
    setLoading(true);
    try {
      const data = await listAssets('');
      setBlobs((data.blobs || []).map(item => item.key).sort());
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : '读取资源列表失败');
    } finally {
      setLoading(false);
    }
  }, [connected, showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveConnection = () => {
    saveBlobConfig(config.baseUrl, config.token);
    showToast('success', '连接设置已保存到本机');
    refresh();
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!connected) {
      showToast('error', '先填写主站地址和管理口令');
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: files.length });

    let done = 0;
    let failed = 0;

    for (const file of Array.from(files)) {
      const rel = relativePathOf(file).replace(/\\/g, '/');
      // 去掉第一层目录名，改用页面上的目标目录
      const withoutRoot = rel.includes('/') ? rel.slice(rel.indexOf('/') + 1) : rel;
      const cleanPrefix = uploadPrefix.replace(/\/+$/, '');
      const key = cleanPrefix ? `${cleanPrefix}/${withoutRoot}` : withoutRoot;

      try {
        await uploadAsset(file, key);
        done += 1;
      } catch (error) {
        failed += 1;
        showToast(
          'error',
          `${file.name} 上传失败：${error instanceof Error ? error.message : '未知错误'}`,
        );
      }
      setProgress({ done: done + failed, total: files.length });
    }

    setUploading(false);
    if (failed === 0) {
      showToast('success', `上传完成，共 ${done} 个文件`);
    } else {
      showToast('warning', `上传结束：成功 ${done} 个，失败 ${failed} 个`);
    }
    refresh();
  };

  const handleDelete = async (key: string) => {
    if (!window.confirm(`确定删除资源「${key}」？此操作不可恢复。`)) return;
    try {
      await deleteAsset(key);
      showToast('success', '已删除');
      refresh();
    } catch (error) {
      showToast('error', error instanceof Error ? error.message : '删除失败');
    }
  };

  const copyUrl = async (key: string) => {
    const url = assetUrl(key);
    try {
      await navigator.clipboard.writeText(url);
      showToast('success', '资源地址已复制');
    } catch {
      showToast('info', url);
    }
  };

  const visible = filter
    ? blobs.filter(key => key.toLowerCase().includes(filter.toLowerCase()))
    : blobs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">资源库</h1>
        <p className="text-slate-400 text-sm">
          产品图片、视频、安装包与产品介绍页。上传后即时生效，
          <span className="text-slate-300">不需要重新构建网站</span>。
        </p>
      </div>

      {/* 连接设置 */}
      <div className={panelClass}>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-accent-400" />
          连接设置
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          <Field
            label="主站地址"
            hint="资源接口跑在主站域名下，例如 https://xxx.edgeone.app"
          >
            <input
              type="text"
              value={config.baseUrl}
              onChange={event =>
                setConfig({ ...config, baseUrl: event.target.value })
              }
              placeholder="https://your-site.edgeone.app"
              className={inputClass}
            />
          </Field>
          <Field
            label="管理口令"
            hint="EdgeOne 环境变量 ADMIN_API_TOKEN 的值，只存在本机浏览器"
          >
            <input
              type="password"
              value={config.token}
              onChange={event =>
                setConfig({ ...config, token: event.target.value })
              }
              placeholder="ADMIN_API_TOKEN"
              className={inputClass}
            />
          </Field>
        </div>
        <button
          type="button"
          onClick={saveConnection}
          className="mt-4 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-all"
        >
          保存并连接
        </button>
        {!connected ? (
          <p className="text-amber-400 text-xs mt-3">
            还没配置，填写并保存后才能上传和读取资源。
          </p>
        ) : null}
      </div>

      {/* 上传 */}
      <div className={panelClass}>
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-4 h-4 text-accent-400" />
          上传资源
        </h2>
        <div className="mb-4">
          <Field
            label="目标目录"
            hint="决定资源的访问路径。例如 products/roboworld 下的 index.html 会变成 /api/asset/products/roboworld/index.html"
          >
            <input
              type="text"
              value={uploadPrefix}
              onChange={event => setUploadPrefix(event.target.value)}
              list="preset-prefixes"
              placeholder="products/roboworld"
              className={inputClass}
            />
          </Field>
          <datalist id="preset-prefixes">
            {PRESET_PREFIXES.map(item => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading || !connected}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            选择文件
          </button>
          <button
            type="button"
            onClick={() => dirRef.current?.click()}
            disabled={uploading || !connected}
            className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-2"
          >
            <FolderUp className="w-4 h-4" />
            选择整个目录（推荐）
          </button>
          {uploading ? (
            <span className="flex items-center gap-2 text-sm text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              上传中 {progress.done}/{progress.total}
            </span>
          ) : null}
        </div>

        <p className="text-slate-500 text-xs mt-3">
          选目录上传会保留子目录结构，适合整个产品介绍站点（HTML + assets）。
          大文件走直传，不经过边缘函数，100M 的安装包也能传。
        </p>

        <input
          ref={fileRef}
          type="file"
          multiple
          className="hidden"
          onChange={event => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
        <input
          ref={dirRef}
          type="file"
          multiple
          className="hidden"
          {...({ webkitdirectory: '', directory: '' } as any)}
          onChange={event => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {/* 列表 */}
      <div className={panelClass}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-white font-semibold flex items-center gap-2">
            <FileIcon className="w-4 h-4 text-accent-400" />
            已有资源
            <span className="text-slate-500 text-sm font-normal">
              {visible.length} 个
            </span>
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={filter}
              onChange={event => setFilter(event.target.value)}
              placeholder="按路径筛选…"
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:border-accent-500"
            />
            <button
              type="button"
              onClick={refresh}
              disabled={loading || !connected}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg border border-slate-700 transition-all flex items-center gap-2 text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>

        {!connected ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            填写上方连接设置后，这里会显示已上传的资源。
          </p>
        ) : visible.length === 0 ? (
          <p className="text-slate-500 text-sm py-8 text-center">
            {loading ? '正在读取…' : '还没有资源，用上面的按钮上传。'}
          </p>
        ) : (
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {visible.map(key => (
              <div
                key={key}
                className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5"
              >
                <span className="flex-1 text-slate-200 text-sm font-mono break-all">
                  {key}
                </span>
                <button
                  type="button"
                  onClick={() => copyUrl(key)}
                  title="复制访问地址"
                  className="p-1.5 text-slate-400 hover:text-accent-400 hover:bg-slate-700 rounded transition-all"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={assetUrl(key)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="在新标签打开"
                  className="p-1.5 text-slate-400 hover:text-accent-400 hover:bg-slate-700 rounded transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => handleDelete(key)}
                  title="删除"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
