import { Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/lib/store';
import { Field, TextInput, TextAreaInput, inputClass } from '@/components/Field';
import { generateId, parseLines, toLines } from '@/lib/types';
import type { CaseItem } from '@/lib/types';

const panelClass = 'bg-slate-900 border border-slate-800 rounded-xl p-6';
const dangerClass =
  'px-3 py-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-900/20 transition-all flex items-center gap-1.5 text-xs flex-shrink-0';

function emptyCase(): CaseItem {
  return {
    id: generateId('case'),
    title: '新案例',
    client: '',
    industry: '',
    summary: '',
    details: [],
    image: '',
    coverPath: '',
    results: [],
    tags: [],
    date: new Date().toISOString().slice(0, 10),
  };
}

export default function AdminCases() {
  const { content, update } = useContent();

  if (!content) return null;

  const list = content.cases ?? [];

  const patch = (id: string, changes: Partial<CaseItem>) => {
    update(c => ({
      ...c,
      cases: list.map(item => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            案例管理
          </h1>
          <p className="text-slate-400 text-sm">
            展示在「案例」页。行业会自动聚合成筛选按钮，不必单独维护行业列表。
          </p>
        </div>
        <button
          type="button"
          onClick={() => update(c => ({ ...c, cases: [...list, emptyCase()] }))}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增案例
        </button>
      </div>

      <div className="space-y-5">
        {list.map(item => (
          <div key={item.id} className={panelClass}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <Field label="案例标题">
                  <TextInput
                    value={item.title}
                    onChange={value => patch(item.id, { title: value })}
                    placeholder="例如：协作机器人离线编程工作站"
                  />
                </Field>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm('确定删除该案例？')) return;
                  update(c => ({
                    ...c,
                    cases: list.filter(entry => entry.id !== item.id),
                  }));
                }}
                className={dangerClass}
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Field label="客户 / 项目方">
                <TextInput
                  value={item.client}
                  onChange={value => patch(item.id, { client: value })}
                  placeholder="例如：某汽车零部件制造商"
                />
              </Field>
              <Field label="行业" hint="用于页面筛选">
                <TextInput
                  value={item.industry}
                  onChange={value => patch(item.id, { industry: value })}
                  placeholder="例如：汽车制造"
                />
              </Field>
              <Field label="日期">
                <input
                  type="date"
                  value={item.date}
                  onChange={event => patch(item.id, { date: event.target.value })}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="mb-4">
              <Field label="一句话摘要" hint="展示在卡片上">
                <TextAreaInput
                  value={item.summary}
                  onChange={value => patch(item.id, { summary: value })}
                  rows={2}
                  placeholder="用一句话说清这个案例解决了什么问题"
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <Field
                label="配图路径"
                hint="资源库里的路径，或完整的 /api/asset/... 地址"
              >
                <TextInput
                  value={item.image}
                  onChange={value => patch(item.id, { image: value })}
                  placeholder="/api/asset/products/roboworld/assets/main-ur5e.png"
                />
              </Field>
              <Field
                label="案例详情页路径"
                hint="填 HTML 资源路径后，卡片会出现「查看详情」，留空则不显示"
              >
                <TextInput
                  value={item.coverPath || ''}
                  onChange={value => patch(item.id, { coverPath: value })}
                  placeholder="cases/xxx/index.html"
                />
              </Field>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Field label="详细正文" hint="每行一段">
                <TextAreaInput
                  value={toLines(item.details)}
                  onChange={value => patch(item.id, { details: parseLines(value) })}
                  rows={6}
                  placeholder={'背景\n我们的做法\n最终效果'}
                />
              </Field>
              <Field label="达成的效果" hint="每行一条">
                <TextAreaInput
                  value={toLines(item.results)}
                  onChange={value => patch(item.id, { results: parseLines(value) })}
                  rows={6}
                  placeholder={'换型停机时间减少 85%\n路径规划零碰撞事故'}
                />
              </Field>
              <Field label="标签" hint="每行一个，如 RoboWorld">
                <TextAreaInput
                  value={toLines(item.tags)}
                  onChange={value => patch(item.id, { tags: parseLines(value) })}
                  rows={6}
                  placeholder={'RoboWorld\n离线编程'}
                />
              </Field>
            </div>
          </div>
        ))}

        {list.length === 0 ? (
          <div className={panelClass}>
            <p className="text-slate-500 text-sm">还没有案例</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
