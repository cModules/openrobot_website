import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/lib/store';
import { Field, TextInput, SelectInput } from '@/components/Field';
import { generateId, ICON_OPTIONS } from '@/lib/types';
import type { Documentation } from '@/lib/types';

const panelClass = 'bg-slate-900 border border-slate-800 rounded-xl p-6';
const dangerClass =
  'px-3 py-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-900/20 transition-all flex items-center gap-1.5 text-xs flex-shrink-0';

function emptyDoc(): Documentation {
  return {
    id: generateId('doc'),
    title: '新文档',
    description: '',
    icon: 'BookOpen',
    link: '',
  };
}

export default function AdminDocs() {
  const { content, update } = useContent();

  if (!content) return null;

  const patch = (id: string, changes: Partial<Documentation>) => {
    update(c => ({
      ...c,
      documentation: c.documentation.map(doc =>
        doc.id === id ? { ...doc, ...changes } : doc,
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            文档资源
          </h1>
          <p className="text-slate-400 text-sm">
            下载页底部的文档入口卡片，链接可填网盘、GitHub 或任意地址。
          </p>
        </div>
        <button
          type="button"
          onClick={() =>
            update(c => ({
              ...c,
              documentation: [...c.documentation, emptyDoc()],
            }))
          }
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增文档
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {content.documentation.map(doc => (
          <div key={doc.id} className={`${panelClass} space-y-4`}>
            <Field label="标题">
              <TextInput
                value={doc.title}
                onChange={value => patch(doc.id, { title: value })}
                placeholder="例如：快速入门"
              />
            </Field>
            <Field label="描述">
              <TextInput
                value={doc.description}
                onChange={value => patch(doc.id, { description: value })}
                placeholder="例如：5 分钟上手指南"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="图标">
                <SelectInput
                  value={doc.icon}
                  onChange={value => patch(doc.id, { icon: value })}
                  options={ICON_OPTIONS}
                />
              </Field>
              <Field label="链接地址">
                <TextInput
                  value={doc.link}
                  onChange={value => patch(doc.id, { link: value })}
                  placeholder="https://..."
                />
              </Field>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm('确定删除该文档入口？')) return;
                  update(c => ({
                    ...c,
                    documentation: c.documentation.filter(
                      item => item.id !== doc.id,
                    ),
                  }));
                }}
                className={dangerClass}
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>
          </div>
        ))}
        {content.documentation.length === 0 ? (
          <div className={panelClass}>
            <p className="text-slate-500 text-sm">还没有文档入口</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
