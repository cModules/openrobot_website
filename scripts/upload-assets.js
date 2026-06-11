#!/usr/bin/env node
/**
 * OpenRobot 网站资源上传脚本
 * 用于将 public 文件夹下的指定目录上传到 Blob Storage
 *
 * 使用方式:
 *   node scripts/upload-assets.js [options]
 *
 * 选项:
 *   --folders <names>  指定要上传的文件夹，逗号分隔 (默认: downloads,images,docs)
 *   --dry-run          仅显示要上传的文件，不实际执行上传
 *   --help             显示帮助信息
 *
 * 示例:
 *   node scripts/upload-assets.js                           # 上传 downloads,images,docs
 *   node scripts/upload-assets.js --folders downloads      # 仅上传 downloads
 *   node scripts/upload-assets.js --dry-run               # 预览要上传的文件
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 配置
const BLOB_STORAGE_URL = 'https://pages.edgeone.ai/document/blob-storage';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// 解析命令行参数
const args = process.argv.slice(2);
const options = {
  folders: ['downloads', 'images', 'docs'],
  dryRun: false,
};

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--folders' && args[i + 1]) {
    options.folders = args[i + 1].split(',').map(f => f.trim());
    i++;
  } else if (args[i] === '--dry-run') {
    options.dryRun = true;
  } else if (args[i] === '--help') {
    console.log(`
OpenRobot 网站资源上传脚本

使用方法:
  node scripts/upload-assets.js [options]

选项:
  --folders <names>  指定要上传的文件夹，逗号分隔 (默认: downloads,images,docs)
  --dry-run          仅显示要上传的文件，不实际执行上传
  --help             显示帮助信息

示例:
  node scripts/upload-assets.js
  node scripts/upload-assets.js --folders downloads
  node scripts/upload-assets.js --dry-run
`);
    process.exit(0);
  }
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
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
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
 * 格式化文件大小
 */
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * 上传单个文件到 Blob Storage
 */
async function uploadFile(file, storageUrl) {
  const remoteUrl = `${storageUrl}/${file.relativePath}`;

  // 使用 curl 上传文件
  // 注意: 根据实际的 Blob Storage 服务，可能需要调整上传方法
  // 这里是使用 HTTP PUT 请求上传
  try {
    execSync(`curl -X PUT -T "${file.fullPath}" "${remoteUrl}" -H "Content-Type: application/octet-stream"`, {
      stdio: 'pipe',
    });
    return true;
  } catch (error) {
    console.error(`  上传失败: ${error.message}`);
    return false;
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('\n========================================');
  console.log('  OpenRobot 资源上传脚本');
  console.log('========================================\n');

  console.log(`Blob Storage: ${BLOB_STORAGE_URL}`);
  console.log(`要上传的文件夹: ${options.folders.join(', ')}`);
  console.log(`模式: ${options.dryRun ? '预览 (dry-run)' : '实际执行'}\n`);

  // 获取所有要上传的文件
  const allFiles = [];

  for (const folder of options.folders) {
    const folderPath = path.join(PUBLIC_DIR, folder);
    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      const files = getFiles(folderPath);
      allFiles.push(...files.map(f => ({ ...f, folder })));
      console.log(`✓ 找到文件夹: ${folder} (${files.length} 个文件)`);
    } else {
      console.log(`○ 跳过不存在的文件夹: ${folder}`);
    }
  }

  if (allFiles.length === 0) {
    console.log('\n没有找到要上传的文件。\n');
    return;
  }

  console.log(`\n找到 ${allFiles.length} 个文件待上传:\n`);
  console.log('----------------------------------------');

  // 显示文件列表
  for (const file of allFiles) {
    console.log(`  ${file.relativePath.padEnd(50)} ${formatSize(file.size).padStart(10)}`);
  }
  console.log('----------------------------------------');
  console.log(`总计: ${allFiles.length} 个文件`);
  const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`大小: ${formatSize(totalSize)}\n`);

  if (options.dryRun) {
    console.log('这是预览模式，不会实际上传文件。\n');
    return;
  }

  // 执行上传
  console.log('开始上传...\n');
  let successCount = 0;
  let failCount = 0;

  for (const file of allFiles) {
    process.stdout.write(`  上传: ${file.relativePath} ... `);
    const success = await uploadFile(file, BLOB_STORAGE_URL);
    if (success) {
      console.log('✓');
      successCount++;
    } else {
      console.log('✗');
      failCount++;
    }
  }

  console.log('\n========================================');
  console.log(`上传完成: ${successCount} 成功, ${failCount} 失败`);
  console.log('========================================\n');
}

main().catch(console.error);
