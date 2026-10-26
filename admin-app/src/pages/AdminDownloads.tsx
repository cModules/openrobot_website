import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/lib/store';
import {
  Field,
  TextInput,
  TextAreaInput,
  SelectInput,
  inputClass,
} from '@/components/Field';
import { generateId, ICON_OPTIONS } from '@/lib/types';
import type { DownloadItem, Platform } from '@/lib/types';

const panelClass = 'bg-slate-900 border border-slate-800 rounded-xl p-6';
const subPanelClass = 'border border-slate-800 rounded-lg p-4 space-y-3';
const dangerClass =
  'px-3 py-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-900/20 transition-all flex items-center gap-1.5 text-xs flex-shrink-0';

function emptyPlatform(): Platform {
  return {
    name: '百度网盘下载',
    icon: 'CloudDownload',
    link: '',
    code: '',
  };
}

function emptyDownload(): DownloadItem {
  return {
    id: generateId('dl'),
    title: '新下载项',
    description: '',
    icon: 'Code',
    platforms: [emptyPlatform()],
    version: '',
    date: new Date().toISOString().slice(0, 10),
  };
}

export default function AdminDownloads() {
  const { content, update } = useContent();

  if (!content) return null;

  const patch = (id: string, changes: Partial<DownloadItem>) => {
    update(c => ({
      ...c,
      downloads: c.downloads.map(dl =>
        dl.id === id ? { ...dl, ...changes } : dl,
      ),
    }));
  };

  const patchPlatform = (
    dlId: string,
    index: number,
    changes: Partial<Platform>,
  ) => {
    update(c => ({
      ...c,
      downloads: c.downloads.map(dl =>
        dl.id === dlId
          ? {
              ...dl,
              platforms: dl.platforms.map((pl, i) =>
                i === index ? { ...pl, ...changes } : pl,
              ),
            }
          : dl,
      ),
    }));
  };

  const addPlatform = (dlId: string) => {
    update(c => ({
      ...c,
      downloads: c.downloads.map(dl =>
        dl.id === dlId
          ? { ...dl, platforms: [...dl.platforms, emptyPlatform()] }
          : dl,
      ),
    }));
  };

  const removePlatform = (dlId: string, index: number) => {
    update(c => ({
      ...c,
      downloads: c.downloads.map(dl =>
        dl.id === dlId
          ? {
              ...dl,
              platforms: dl.platforms.filter((_, i) => i !== index),
            }
          : dl,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            下载管理
          </h1>
          <p className="text-slate-400 text-sm">
            安装包与资料走百度网盘外链，提取码会展示在下载页并支持一键复制。
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            update(c => ({ ...c, downloads: [...c.downloads, emptyDownload()] }))
          }
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增下载项
        </button>
      </div>

      <div className="space-y-5">
        {content.downloads.map(dl => (
          <div key={dl.id} className={panelClass}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Field label="标题">
                  <TextInput
                    value={dl.title}
                    onChange={value => patch(dl.id, { title: value })}
                    placeholder="例如：roboWorld 软件"
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm('确定删除该下载项？')) return;
                  update(c => ({
                    ...c,
                    downloads: c.downloads.filter(item => item.id !== dl.id),
                  }));
                }}
                className={dangerClass}
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>

            <div className="mb-4">
              <Field label="描述">
                <TextAreaInput
                  value={dl.description}
                  onChange={value => patch(dl.id, { description: value })}
                  rows={2}
                  placeholder="一句话说明这个下载项"
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Field label="图标">
                <SelectInput
                  value={dl.icon}
                  onChange={value => patch(dl.id, { icon: value })}
                  options={ICON_OPTIONS}
                />
              </Field>
              <Field label="版本号">
                <TextInput
                  value={dl.version}
                  onChange={value => patch(dl.id, { version: value })}
                  placeholder="v0.1.1"
                />
              </Field>
              <Field label="更新日期">
                <input
                  type="date"
                  value={dl.date}
                  onChange={event => patch(dl.id, { date: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium text-sm">
                  下载入口（{dl.platforms.length}）
                </span>
                <button
                  type="button"
                  onClick={() => addPlatform(dl.id)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  新增入口
                </button>
              </div>
              {dl.platforms.map((pl, index) => (
                <div key={index} className={subPanelClass}>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Field label="按钮名称">
                      <TextInput
                        value={pl.name}
                        onChange={value =>
                          patchPlatform(dl.id, index, { name: value })
                        }
                        placeholder="百度网盘下载"
                      />
                    </Field>
                    <Field label="按钮图标">
                      <SelectInput
                        value={pl.icon}
                        onChange={value =>
                          patchPlatform(dl.id, index, { icon: value })
                        }
                        options={ICON_OPTIONS}
                      />
                    </Field>
                  </div>
                  <div className="grid md:grid-cols-[1fr_160px] gap-3 items-end">
                    <Field label="链接地址" hint="网盘地址或 /contact 等站内路径">
                      <TextInput
                        value={pl.link}
                        onChange={value =>
                          patchPlatform(dl.id, index, { link: value })
                        }
                        placeholder="https://pan.baidu.com/s/..."
                      />
                    </Field>
                    <div className="flex gap-2">
                      <Field label="提取码">
                        <TextInput
                          value={pl.code}
                          onChange={value =>
                            patchPlatform(dl.id, index, { code: value })
                          }
                          placeholder="留空则不显示"
                        />
                      </Field>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePlatform(dl.id, index)}
                    className={dangerClass}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    移除该入口
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {content.downloads.length === 0 ? (
          <div className={panelClass}>
            <p className="text-slate-500 text-sm">还没有下载项</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
