import { useContent } from '@/lib/store';
import { Field, TextInput, TextAreaInput } from '@/components/Field';
import type { SiteInfo } from '@/lib/types';

const panelClass = 'bg-slate-900 border border-slate-800 rounded-xl p-6';

const FIELDS: Array<{
  key: keyof SiteInfo;
  label: string;
  placeholder: string;
  hint?: string;
}> = [
  { key: 'name', label: '站点名称', placeholder: 'OpenRobot' },
  { key: 'logoText', label: 'Logo 文案', placeholder: 'OpenRobot' },
  { key: 'email', label: '联系邮箱', placeholder: 'you@example.com' },
  {
    key: 'github',
    label: 'GitHub 地址',
    placeholder: 'https://github.com/cModules/roboWorld',
    hint: '页脚 GitHub 图标与联系弹窗都指向这里',
  },
  {
    key: 'wechatId',
    label: '微信号',
    placeholder: '例如：openrobot2024',
    hint: '填写后联系弹窗会出现「复制微信号」按钮',
  },
  {
    key: 'wechatQr',
    label: '微信二维码图片地址',
    placeholder: '/wechat-qrcode.jpg',
    hint: '把图片放到 public/ 目录下；文件不存在时二维码区域会自动隐藏',
  },
  { key: 'address', label: '地址', placeholder: '省市区街道' },
  { key: 'workTime', label: '工作时间', placeholder: '周一至周五: 9:00 - 18:00' },
  { key: 'workTimeNote', label: '工作时间补充说明', placeholder: '周六至周日: 休息' },
];

export default function AdminSettings() {
  const { content, update } = useContent();

  if (!content) return null;

  const patch = (changes: Partial<SiteInfo>) => {
    update(c => ({ ...c, site: { ...c.site, ...changes } }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-white mb-2">
          站点设置
        </h1>
        <p className="text-slate-400 text-sm">
          站点名、Logo 文案与联系方式，改动会同步到导航、页脚与右下角联系弹窗。
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {FIELDS.map(field => (
          <div key={field.key} className={panelClass}>
            <Field label={field.label} hint={field.hint}>
              <TextInput
                value={content.site[field.key]}
                onChange={value => patch({ [field.key]: value })}
                placeholder={field.placeholder}
              />
            </Field>
          </div>
        ))}
      </div>

      <div className={panelClass}>
        <h2 className="text-white font-semibold mb-3">页脚简介</h2>
        <Field label="显示在页脚 Logo 下方的介绍文字">
          <TextAreaInput
            value={content.site.footerDescription}
            onChange={value => patch({ footerDescription: value })}
            rows={3}
          />
        </Field>
      </div>
    </div>
  );
}
