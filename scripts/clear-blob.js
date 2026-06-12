/**
 * OpenRobot Blob Storage 清除脚本
 * 
 * 使用 @edgeone/pages-blob 库清除腾讯云EdgeOne Blob Storage中的文件
 * 
 * 使用方式:
 *   node scripts/clear-blob.js              # 显示帮助信息
 *   node scripts/clear-blob.js --all        # 清除所有文件（需确认）
 *   node scripts/clear-blob.js --prefix downloads/   # 清除指定前缀的文件
 *   node scripts/clear-blob.js --force      # 强制删除（跳过确认）
 * 
 * 环境变量配置:
 *   EDGEONE_PROJECT_ID=your-project-id
 *   EDGEONE_TOKEN=your-api-token
 */

import { getStore } from "@edgeone/pages-blob";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CONFIG_FILE = path.join(__dirname, "blob-config.json");

const args = process.argv.slice(2);
const options = {
  mode: "help",
  prefix: "",
  force: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--all") options.mode = "all";
  if (args[i] === "--prefix" && args[i + 1]) {
    options.mode = "prefix";
    options.prefix = args[i + 1];
    i++;
  }
  if (args[i] === "--force") options.force = true;
  if (args[i] === "--help") options.mode = "help";
}

function loadConfig() {
  const envConfig = {
    projectId: process.env.EDGEONE_PROJECT_ID,
    token: process.env.EDGEONE_TOKEN,
  };

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

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function listFiles(store, prefix = "") {
  const result = await store.list({ prefix });
  return result.blobs || [];
}

async function confirmDelete(count, force) {
  if (force) return true;
  
  console.log(`\n⚠️  确认删除 ${count} 个文件？`);
  console.log("输入 'YES' 确认删除，其他任意键取消：");
  
  return new Promise(resolve => {
    const stdin = process.openStdin();
    stdin.once('data', data => {
      stdin.destroy();
      resolve(data.toString().trim() === 'YES');
    });
  });
}

async function main() {
  console.log("\n========================================");
  console.log("  OpenRobot Blob Storage 清除脚本");
  console.log("========================================");

  if (options.mode === "help") {
    console.log(`

使用方式:
  node scripts/clear-blob.js              # 显示帮助信息
  node scripts/clear-blob.js --all        # 清除所有文件（需确认）
  node scripts/clear-blob.js --prefix downloads/   # 清除指定前缀的文件
  node scripts/clear-blob.js --force      # 强制删除（跳过确认）

示例:
  node scripts/clear-blob.js --all        # 清除所有文件
  node scripts/clear-blob.js --prefix downloads/ --force  # 强制清除downloads目录

注意:
  - 默认需要输入 YES 确认删除
  - 使用 --force 参数可跳过确认

配置文件: scripts/blob-config.json
{
  "projectId": "pages-xxxxxx",
  "token": "your-api-token"
}
    `);
    return;
  }

  const config = loadConfig();

  if (!config.projectId || !config.token) {
    console.error("\n❌ 错误: 未配置腾讯云凭证");
    console.error("请设置环境变量或创建 blob-config.json 配置文件");
    console.error("环境变量: EDGEONE_PROJECT_ID, EDGEONE_TOKEN");
    process.exit(1);
  }

  const store = getStore({
    name: "openrobot",
    projectId: config.projectId,
    token: config.token,
  });

  console.log(`\n项目ID: ${config.projectId}`);
  console.log(`存储命名空间: openrobot`);
  
  if (options.mode === "prefix") {
    console.log(`清除前缀: ${options.prefix}`);
  } else {
    console.log(`清除模式: 全部文件`);
  }

  console.log("\n正在扫描文件...");
  const files = await listFiles(store, options.prefix);

  if (files.length === 0) {
    console.log("\n✓ 没有找到需要删除的文件。");
    return;
  }

  console.log(`\n找到 ${files.length} 个文件待删除:`);
  console.log("----------------------------------------");
  
  let totalSize = 0;
  for (const file of files) {
    const size = file.size || 0;
    totalSize += size;
    console.log(`  ${file.key.padEnd(60)} ${formatSize(size).padStart(12)}`);
    if (files.length > 20 && files.indexOf(file) === 19) {
      console.log(`  ... 还有 ${files.length - 20} 个文件...`);
      break;
    }
  }
  console.log("----------------------------------------");
  console.log(`总计: ${files.length} 个文件, ${formatSize(totalSize)}`);

  const confirmed = await confirmDelete(files.length, options.force);
  
  if (!confirmed) {
    console.log("\n✓ 操作已取消。");
    return;
  }

  console.log("\n开始删除...");
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    process.stdout.write(`  删除: ${file.key} ... `);
    try {
      await store.delete(file.key);
      console.log("✅");
      successCount++;
    } catch (err) {
      console.log("❌");
      console.error(`     错误: ${err.message}`);
      failCount++;
    }
  }

  console.log("\n========================================");
  console.log(`删除完成: ${successCount} 成功, ${failCount} 失败`);
  console.log("========================================");
}

main().catch((err) => {
  console.error("\n❌ 删除失败:", err);
  process.exit(1);
});
