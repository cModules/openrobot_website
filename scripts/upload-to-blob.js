/**
 * OpenRobot Blob Storage 上传脚本
 * 
 * 使用 @edgeone/pages-blob 库上传文件到腾讯云EdgeOne Blob Storage
 * 
 * 前置条件：
 * 1. 安装依赖: npm install @edgeone/pages-blob
 * 2. 配置凭证
 * 
 * 使用方式:
 *   node scripts/upload-to-blob.js              # 上传文件
 *   node scripts/upload-to-blob.js --list       # 列出存储内容
 * 
 * 环境变量配置:
 *   EDGEONE_PROJECT_ID=your-project-id
 *   EDGEONE_TOKEN=your-api-token
 * 
 * 或创建 scripts/blob-config.json:
 * {
 *   "projectId": "pages-xxxxxx",
 *   "token": "your-api-token"
 * }
 */

import { getStore } from "@edgeone/pages-blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES模块兼容：获取当前文件目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 配置常量
const FOLDERS_TO_UPLOAD = ["downloads", "images", "docs"];
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const CONFIG_FILE = path.join(__dirname, "blob-config.json");

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  mode: "upload",
};

for (const arg of args) {
  if (arg === "--list") options.mode = "list";
  if (arg === "--help") {
    console.log(`
OpenRobot Blob Storage 上传脚本

使用方式:
  node scripts/upload-to-blob.js              # 上传文件到 Blob Storage
  node scripts/upload-to-blob.js --list       # 列出存储中的文件
  node scripts/upload-to-blob.js --help       # 显示帮助信息

配置文件: scripts/blob-config.json
{
  "projectId": "pages-xxxxxx",
  "token": "your-api-token"
}
    `);
    process.exit(0);
  }
}

/**
 * 加载配置
 */
function loadConfig() {
  // 优先从环境变量读取
  const envConfig = {
    projectId: process.env.EDGEONE_PROJECT_ID,
    token: process.env.EDGEONE_TOKEN,
  };

  // 如果环境变量不完整，尝试从配置文件读取
  const hasEnvConfig = envConfig.projectId && envConfig.token;
  if (!hasEnvConfig && fs.existsSync(CONFIG_FILE)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
      return { ...envConfig, ...fileConfig };
    } catch (error) {
      console.warn(`配置文件解析失败: ${error.message}`);
    }
  }

  return envConfig;
}

/**
 * 递归获取目录下的所有文件
 */
function getFiles(dir, baseDir = dir) {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getFiles(fullPath, baseDir));
    } else if (entry.isFile()) {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, "/");
      files.push({
        fullPath,
        relativePath,
        size: fs.statSync(fullPath).size,
      });
    }
  }

  return files;
}

/**
 * 根据扩展名推断 Content-Type
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    ".pdf": "application/pdf",
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".tar": "application/x-tar",
    ".gz": "application/gzip",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".mp4": "video/mp4",
    ".exe": "application/octet-stream",
    ".doc": "application/msword",
    ".docx":
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx":
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx":
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ".txt": "text/plain",
    ".json": "application/json",
    ".xml": "application/xml",
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".ts": "application/typescript",
  };
  return types[ext] || "application/octet-stream";
}

/**
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

/**
 * 列出存储中的文件
 */
async function listFiles(store) {
  console.log("\n========================================");
  console.log("  列出 Blob Storage 文件");
  console.log("========================================");

  try {
    const result = await store.list({ prefix: "" });
    const files = result.blobs || [];

    console.log(`\n找到 ${files.length} 个文件:\n`);
    console.log("----------------------------------------");

    files.sort((a, b) => a.key.localeCompare(b.key));

    for (const file of files) {
      const size = file.size ? formatSize(file.size) : "未知";
      console.log(`  ${file.key.padEnd(60)} ${size.padStart(12)}`);
    }

    console.log("----------------------------------------");
    console.log(`总计: ${files.length} 个文件`);
  } catch (err) {
    console.error("\n❌ 列出文件失败:", err.message);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log("\n========================================");
  console.log("  OpenRobot Blob Storage 上传脚本");
  console.log("========================================");

  const config = loadConfig();

  if (!config.projectId || !config.token) {
    console.error("\n❌ 错误: 未配置腾讯云凭证");
    console.error("请设置环境变量或创建 blob-config.json 配置文件");
    console.error("环境变量: EDGEONE_PROJECT_ID, EDGEONE_TOKEN");
    console.error("配置文件: scripts/blob-config.json");
    console.error("\n获取方式:");
    console.error("  1. 登录 https://console.tencentcloud.com/edgeone");
    console.error("  2. 进入 EdgeOne Pages 控制台");
    console.error("  3. 查找项目 ID 和 API Token");
    process.exit(1);
  }

  // 使用外部访问模式：需要提供 projectId 和 token
  const store = getStore({
    name: "openrobot",
    projectId: config.projectId,
    token: config.token,
  });

  if (options.mode === "list") {
    await listFiles(store);
    return;
  }

  // 默认模式：上传
  console.log(`\n项目ID: ${config.projectId}`);
  console.log(`存储命名空间: openrobot`);
  console.log(`源目录: ${PUBLIC_DIR}`);
  console.log(`要上传的文件夹: ${FOLDERS_TO_UPLOAD.join(", ")}\n`);

  const allFiles = [];

  for (const folder of FOLDERS_TO_UPLOAD) {
    const folderPath = path.join(PUBLIC_DIR, folder);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      const files = getFiles(folderPath);
      const filesWithPrefix = files.map((f) => ({
        ...f,
        blobPath: `${folder}/${f.relativePath}`,
      }));
      allFiles.push(...filesWithPrefix);
      console.log(`✓ 找到文件夹: ${folder} (${files.length} 个文件)`);
    } else {
      console.log(`○ 跳过不存在的文件夹: ${folder}`);
    }
  }

  if (allFiles.length === 0) {
    console.log("\n没有找到要上传的文件。\n");
    return;
  }

  console.log(`\n找到 ${allFiles.length} 个文件待上传:\n`);
  console.log("----------------------------------------");

  for (const file of allFiles) {
    console.log(
      `  ${file.blobPath.padEnd(50)} ${formatSize(file.size).padStart(10)}`
    );
  }
  console.log("----------------------------------------");
  console.log(`总计: ${allFiles.length} 个文件`);
  const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`大小: ${formatSize(totalSize)}\n`);

  console.log("开始上传...\n");
  let successCount = 0;
  let failCount = 0;

  for (const file of allFiles) {
    process.stdout.write(`  📄 上传: ${file.blobPath} ... `);
    try {
      const fileBuffer = fs.readFileSync(file.fullPath);
      await store.set(file.blobPath, fileBuffer, {
        contentType: getContentType(file.fullPath),
      });
      console.log("✅");
      successCount++;
    } catch (err) {
      console.log("❌");
      console.error(`     错误: ${err.message}`);
      failCount++;
    }
  }

  console.log("\n========================================");
  console.log(`上传完成: ${successCount} 成功, ${failCount} 失败`);
  console.log("========================================");
  console.log("\n上传的文件结构:");
  console.log("  Blob Storage/openrobot/");
  for (const folder of FOLDERS_TO_UPLOAD) {
    console.log(`    └── ${folder}/`);
  }
  console.log("");
}

main().catch((err) => {
  console.error("\n❌ 上传失败:", err);
  process.exit(1);
});
