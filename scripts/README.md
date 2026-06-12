# OpenRobot 网站脚本工具

本文档说明 `scripts` 目录下各脚本的功能和使用方法。

---

## 目录

- [upload-to-blob.js](#upload-to-blobjs---上传文件到-blob-storage)
- [clear-blob.js](#clear-blobjs---清除-blob-storage-内容)
- [Upload-Assets.ps1](#upload-assetsps1---powershell-版上传脚本)
- [blob-config.json](#blob-configjson---配置文件)

---

## upload-to-blob.js - 上传文件到 Blob Storage

将 `public` 目录下的文件上传到腾讯云 EdgeOne Blob Storage。

### 功能

- 上传 `public/downloads`、`public/images`、`public/docs` 文件夹
- 自动识别文件类型设置 Content-Type
- 支持预览模式（查看待上传文件）
- 显示上传进度和统计

### 使用方法

```bash
# 安装依赖（如尚未安装）
npm install @edgeone/pages-blob

# 上传文件
node scripts/upload-to-blob.js

# 列出存储内容
node scripts/upload-to-blob.js --list

# 显示帮助
node scripts/upload-to-blob.js --help
```

### 配置

创建 `scripts/blob-config.json`：

```json
{
  "projectId": "pages-xxxxxx",
  "token": "your-api-token"
}
```

获取方式：
- 登录 https://console.tencentcloud.com/edgeone/pages
- 进入项目设置 → API Token

---

## clear-blob.js - 清除 Blob Storage 内容

删除 Blob Storage 中的文件。

### 功能

- 按前缀删除文件
- 显示删除预览（确认后删除）
- 支持强制删除模式

### 使用方法

```bash
# 显示帮助
node scripts/clear-blob.js

# 预览删除（显示但不删除）
node scripts/clear-blob.js --prefix downloads/

# 删除指定前缀的文件（需输入 YES 确认）
node scripts/clear-blob.js --prefix downloads/

# 强制删除（跳过确认）
node scripts/clear-blob.js --prefix downloads/ --force

# 删除所有文件（需输入 YES 确认）
node scripts/clear-blob.js --all

# 强制删除所有文件
node scripts/clear-blob.js --all --force
```

### 配置

与 `upload-to-blob.js` 共用 `blob-config.json`。

---

## Upload-Assets.ps1 - PowerShell 版上传脚本

PowerShell 版本的资源上传脚本。

### 功能

- 使用 HTTP PUT 上传文件
- 支持按文件夹筛选上传
- 预览模式和详细输出

### 使用方法

```powershell
# 上传所有文件夹
.\scripts\Upload-Assets.ps1

# 仅上传 downloads 文件夹
.\scripts\Upload-Assets.ps1 -Folders downloads

# 预览模式（不实际上传）
.\scripts\Upload-Assets.ps1 -DryRun

# 指定目标 URL
.\scripts\Upload-Assets.ps1 -TargetUrl "https://your-storage.com"
```

### 配置

修改脚本中的配置区域：

```powershell
$config = @{
    StorageUrl = "https://pages.edgeone.ai/document/blob-storage"
    Folders = @("downloads", "images", "docs")
}
```

---

## blob-config.json - 配置文件

腾讯云 EdgeOne Blob Storage 凭证配置。

### 字段说明

| 字段 | 说明 |
|------|------|
| `projectId` | 项目 ID，格式：`pages-xxxxxx` |
| `token` | API Token（从 EdgeOne 控制台获取） |

### 获取方式

1. 登录 https://console.tencentcloud.com/edgeone/pages
2. 进入您的项目
3. 项目设置 → API Token

### 示例

```json
{
  "projectId": "pages-tw7pugxaldlj",
  "token": "your-api-token-here"
}
```

---

## 常见问题

### 上传失败：ECONNRESET

网络连接被重置，可能是：
- 网络不稳定
- 代理/VPN 干扰
- 防火墙拦截

解决：检查网络连接，暂时关闭代理/VPN 后重试。

### 凭证无效：Invalid credential

检查 `projectId` 格式是否正确，应为 `pages-xxxxxx` 格式，而非纯数字。

### 找不到配置文件

确保 `blob-config.json` 位于 `scripts/` 目录下，文件名为小写。
