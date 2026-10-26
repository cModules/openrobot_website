/**
 * 批量导入网站展示资源到 EdgeOne Blob Storage
 *
 * 用法：
 *   node --env-file=.env scripts/upload-assets.mjs --dir "<资源目录>"           预览
 *   node --env-file=.env scripts/upload-assets.mjs --dir "<资源目录>" --upload  真正上传
 *
 * 可选参数：
 *   --max-size=10   跳过超过 10MB 的文件（大文件直传会失败，建议先只传小的）
 *   --delay=600     每次上传间隔毫秒数，默认 600，太小容易触发 HTTP/2 限流
 *   --retry=3       单文件失败重试次数，默认 3
 *
 * 需要 .env 里有 EDGEONE_PROJECT_ID 和 EDGEONE_TOKEN。
 *
 * 两个约定：
 *   1. 中文目录映射成英文路径，避免 URL 里出现百分号编码
 *   2. 跳过隐藏文件/目录（.DS_Store、.trae-html-share-packages 等）
 */

import { getStore } from '@edgeone/pages-blob';
import fs from 'fs';
import path from 'path';

const STORE_NAME = 'openrobot';

/**
 * 中文资源目录 → 英文 blob 路径。
 *
 * dropNext 表示跳过紧跟的一个目录名。产品介绍是按「产品/打包目录/文件」三层放的，
 * 而打包目录名会变（roboworld-product-intro → roboworld-product-page），
 * 跳过它才能让输出路径稳定在 products/roboworld/index.html，改名不用改代码。
 */
const DIR_MAP = [
  { from: '产品介绍/RoboWorld', to: 'products/roboworld', dropNext: true },
  { from: '产品介绍/SO-ARM-101', to: 'products/so-arm101', dropNext: true },
  { from: '下载/RoboWorld', to: 'downloads/roboworld', dropNext: false },
  { from: '下载/SO-ARM-101', to: 'downloads/so-arm101', dropNext: false },
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.zip': 'application/zip',
  '.pdf': 'application/pdf',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.exe': 'application/octet-stream',
};

const args = process.argv.slice(2);

/** 同时支持 --dir=xxx 和 --dir xxx 两种写法 */
const getArg = name => {
  const withEquals = args.find(a => a.startsWith(`--${name}=`));
  if (withEquals) return withEquals.slice(name.length + 3);
  const index = args.indexOf(`--${name}`);
  if (index !== -1 && args[index + 1] && !args[index + 1].startsWith('--')) {
    return args[index + 1];
  }
  return null;
};
const hasFlag = name => args.includes(`--${name}`);

const SOURCE_DIR = getArg('dir');
const DO_UPLOAD = hasFlag('upload');

/**
 * 超过这个体积就跳过（MB）。
 * COS 网关对单次 PUT 有上限，100MB 的安装包直接 PUT 会 NGHTTP2_INTERNAL_ERROR，
 * 而且会把连接搞坏，导致后面所有小文件也一起失败。用 --max-size=10 跳过它。
 */
const MAX_SIZE_MB = Number(getArg('max-size')) || Infinity;

/** 每次上传之间的间隔（毫秒），避免触发 HTTP/2 限流 */
const DELAY_MS = Number(getArg('delay')) || 600;

/** 单个文件失败后的重试次数 */
const MAX_RETRY = Number(getArg('retry')) || 3;

function mapKey(relPath) {
  const p = relPath.replace(/\\/g, '/');

  // 取最长匹配，避免「下载/RoboWorld」误吃掉「下载/RoboWorldXxx」
  let best = null;
  for (const rule of DIR_MAP) {
    if (p === rule.from || p.startsWith(rule.from + '/')) {
      if (!best || rule.from.length > best.from.length) best = rule;
    }
  }
  if (!best) return p;

  let rest = p.slice(best.from.length);
  if (best.dropNext) {
    // 去掉 /打包目录名，只留后面的内容
    rest = rest.replace(/^\/[^/]+/, '');
  }
  return best.to + rest;
}

function isHidden(relPath) {
  return relPath
    .replace(/\\/g, '/')
    .split('/')
    .some(part => part.startsWith('.'));
}

function walk(dir, base = dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(base, full).replace(/\\/g, '/');
    if (entry.isDirectory()) {
      out.push(...walk(full, base));
    } else if (entry.isFile() && !isHidden(rel)) {
      out.push({ full, rel, size: fs.statSync(full).size });
    }
  }
  return out;
}

function fmt(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

async function main() {
  if (!SOURCE_DIR) {
    console.error('请指定资源目录：--dir "<路径>"');
    console.error('例：node --env-file=.env scripts/upload-assets.mjs --dir "/Volumes/home/当前项目文档/OpenRobot/网站展示资源"');
    process.exit(1);
  }
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`目录不存在：${SOURCE_DIR}`);
    process.exit(1);
  }

  const files = walk(SOURCE_DIR);
  if (files.length === 0) {
    console.error('目录里没有可用文件（隐藏文件已被跳过）');
    process.exit(1);
  }

  const limit = MAX_SIZE_MB * 1024 * 1024;
  const oversized = files.filter(f => f.size > limit);
  const targets = files.filter(f => f.size <= limit);

  console.log(`源目录：${SOURCE_DIR}`);
  console.log(`待处理：${files.length} 个文件`);
  if (oversized.length) {
    console.log(`已跳过 ${oversized.length} 个超过 ${MAX_SIZE_MB}MB 的文件：`);
    for (const f of oversized) {
      console.log(`  · ${mapKey(f.rel)}  ${fmt(f.size)}`);
    }
    console.log('  这些文件需要分片上传，见脚本末尾说明。');
  }
  console.log('\n路径映射：');
  for (const file of targets) {
    const key = mapKey(file.rel);
    console.log(`  ${key.padEnd(58)} ${fmt(file.size).padStart(10)}`);
  }
  const total = targets.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n合计：${fmt(total)}\n`);

  if (!DO_UPLOAD) {
    console.log('这是预览。确认无误后加 --upload 真正上传。');
    return;
  }

  const projectId = process.env.EDGEONE_PROJECT_ID;
  const token = process.env.EDGEONE_TOKEN;
  if (!projectId || !token) {
    console.error('缺少 EDGEONE_PROJECT_ID / EDGEONE_TOKEN');
    console.error('请在 .env 中配置，并用 node --env-file=.env 运行');
    process.exit(1);
  }

  const store = getStore({ name: STORE_NAME, projectId, token });

  let ok = 0;
  let fail = 0;

  for (let i = 0; i < targets.length; i++) {
    const file = targets[i];
    const key = mapKey(file.rel);
    const ext = path.extname(file.full).toLowerCase();
    let lastError = null;
    let done = false;

    for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
      try {
        await store.set(key, fs.readFileSync(file.full), {
          contentType: MIME[ext] || 'application/octet-stream',
          cacheControl: 'public, max-age=31536000, immutable',
        });
        console.log(`  ✓ ${key}`);
        ok += 1;
        done = true;
        break;
      } catch (err) {
        lastError = err;
        // 退避重试：失败多为 HTTP/2 限流，等一会儿再试通常就好
        if (attempt < MAX_RETRY) {
          await new Promise(r => setTimeout(r, 1500 * attempt));
        }
      }
    }

    if (!done) {
      console.log(`  ✗ ${key}`);
      console.error(`     ${lastError?.message}`);
      fail += 1;
    }

    // 控制速率，避免触发 NGHTTP2_ENHANCE_YOUR_CALM
    if (i < targets.length - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n完成：成功 ${ok}，失败 ${fail}`);

  if (ok > 0) {
    console.log('\n访问地址：');
    for (const file of targets.slice(0, 12)) {
      console.log(`  /api/asset/${mapKey(file.rel)}`);
    }
  }
}

main().catch(err => {
  console.error('执行失败：', err);
  process.exit(1);
});
