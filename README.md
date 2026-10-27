# OpenRobot 官网

机器人视觉与自动化控制的开源平台官网。前端展示 + 后台管理，部署在腾讯云 EdgeOne Pages。

线上：https://openrobot.work

## 架构：两条独立通道

网站的更新分两条路，互不干扰：

| | 内容通道 | 资源通道 |
|---|---|---|
| 承载 | 文案、价格、规格 | 图片、视频、介绍页、安装包 |
| 改动方式 | 后台编辑 `content.json` → commit GitHub | 后台上传到 Blob Storage |
| 生效时间 | EdgeOne 重建，1-2 分钟 | **即时**，无需重建 |
| 落地位置 | `src/data/content.json` | EdgeOne Blob Storage |

拆开的好处：换张产品图不用再走一次全站重建，上传完刷新就能看到。

## 技术栈

- **前端**：React 18 + TypeScript + Vite + Tailwind CSS
- **图标**：Lucide React
- **后端**：EdgeOne Pages Functions（`functions/` 目录，边缘函数）
- **存储**：EdgeOne Blob Storage（STS + COS，无公开直链）
- **后台**：独立的 Vite 项目，见 `admin-app/`

## 项目结构

```
├── src/                  主站源码
│   ├── pages/            页面（首页/产品/下载/反馈/产品介绍）
│   ├── components/       组件（导航/页脚/联系弹窗）
│   ├── data/             content.json —— 全站文案与配置
│   └── lib/              数据加载与类型定义
├── functions/            边缘函数，随主站一起部署
│   ├── api/feedback.js       反馈写入飞书多维表格
│   ├── api/asset/            资源读取（公开，一年强缓存）
│   ├── api/blob.js           资源上传/列表/删除（需鉴权）
│   └── _shared/              公共逻辑（存储、鉴权、MIME）
├── admin-app/            后台管理（独立项目，独立部署）
├── scripts/              运维脚本
│   └── upload-assets.mjs     批量导入资源到 Blob
├── public/               静态资源
└── 部署指南.md            完整的部署与环境配置说明
```

## 快速开始

```bash
npm install
npm run dev          # 主站 http://localhost:5173
```

后台：

```bash
cd admin-app
npm install
npm run dev
```

开发服务器会**直接复用 `functions/` 下的真实函数文件**（见 `vite.config.ts` 里的中间件），所以本地能完整测试接口，不必先部署。

注意：`npm run preview` 只服务静态产物，`/api/*` 会 404。要测接口用 `npm run dev`。

## 环境变量

本地复制模板后填写（`.env` 已在 `.gitignore` 中）：

```bash
cp .env.example .env
```

| 变量 | 用途 |
|---|---|
| `FEISHU_APP_ID` / `FEISHU_APP_SECRET` | 反馈写入飞书 |
| `EDGEONE_PROJECT_ID` / `EDGEONE_TOKEN` | 本地上传脚本连存储（线上不需要） |
| `ADMIN_API_TOKEN` | 资源管理接口鉴权 |

后台另有 `admin-app/.env.example`。完整说明见 `部署指南.md`。

## 资源访问规则

Blob Storage 没有公开直链，资源统一经边缘函数中转：

```
/api/asset/products/roboworld/index.html
```

用**路径形式**而非 `?key=`，这样介绍页内部的相对路径 `assets/x.png` 会被浏览器解析成 `/api/asset/products/roboworld/assets/x.png`，正好命中同一个函数。

单文件上传上限约 **25MB**。更大的文件（如软件安装包）请放 GitHub Releases。

## 批量导入资源

```bash
node --env-file=.env scripts/upload-assets.mjs \
  --dir "<资源目录>" --upload --max-size=25
```

中文目录会自动映射为英文路径，且对目录改名免疫。

## 部署

推送到 `main` 分支，EdgeOne Pages 自动构建部署。详细步骤（含构建配置、环境变量、常见故障）见 `部署指南.md`。

## 许可证

MIT License
