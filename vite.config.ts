import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// 禁用颜色输出以解决 Windows 终端乱码问题
process.env.FORCE_COLOR = '0'
process.env.NO_COLOR = '1'

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FUNCTIONS_DIR = path.join(ROOT, 'functions');

/**
 * 本地开发时模拟 EdgeOne Pages Functions。
 *
 * 直接复用 functions/ 下的真实文件，保证本地和线上是同一份逻辑。
 * 路由规则和 EdgeOne 一致：
 *   /api/feedback            → functions/api/feedback.js
 *   /api/blob                → functions/api/blob.js
 *   /api/asset/a/b/c.png     → functions/api/asset/[[default]].js（params.default = a/b/c.png）
 *
 * 密钥从 .env 读取 —— loadEnv 第三个参数传 '' 才会读到非 VITE_ 前缀的变量，
 * 这样 FEISHU_APP_SECRET 之类不会被注入到前端产物里。
 */
function edgeoneFunctionsPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'edgeone-functions-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res) => {
        const raw = req.url || '';
        const [urlPath, query = ''] = raw.split('?');
        const rel = urlPath.replace(/^\/+/, '').replace(/\/+$/, '');

        const handler = await resolveHandler(rel);
        if (!handler) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(JSON.stringify({ ok: false, error: `找不到函数: /api/${rel}` }));
          return;
        }

        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        const body = Buffer.concat(chunks);

        const method = (req.method || 'GET').toUpperCase();
        const request = new Request(
          `http://localhost/api/${rel}${query ? `?${query}` : ''}`,
          {
            method,
            headers: req.headers as Record<string, string>,
            body: ['GET', 'HEAD'].includes(method) ? undefined : body,
          },
        );

        try {
          const response = await handler.fn({
            request,
            env,
            params: { default: handler.param },
          });

          res.statusCode = response.status;
          response.headers.forEach((value, key) => res.setHeader(key, value));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (error) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : String(error),
            }),
          );
        }
      });
    },
  };
}

/**
 * 按 EdgeOne 的规则找到处理函数：
 * 先试精确文件，再逐级向上找 [[default]].js 动态路由。
 */
async function resolveHandler(rel: string) {
  const candidates: { file: string; param: string }[] = [
    { file: path.join(FUNCTIONS_DIR, 'api', `${rel}.js`), param: '' },
  ];

  const parts = rel.split('/');
  for (let i = parts.length - 1; i >= 1; i--) {
    const dir = parts.slice(0, i).join('/');
    const rest = parts.slice(i).join('/');
    candidates.push({
      file: path.join(FUNCTIONS_DIR, 'api', dir, '[[default]].js'),
      param: rest,
    });
  }

  for (const candidate of candidates) {
    if (!fs.existsSync(candidate.file)) continue;

    const mod: any = await import(pathToFileURL(candidate.file).href);
    if (!mod) continue;

    // 返回模块本身，让调用方按 HTTP 方法挑 handler
    return {
      param: candidate.param,
      fn: async (ctx: any) => {
        const methodName =
          'onRequest' +
          ctx.request.method.charAt(0).toUpperCase() +
          ctx.request.method.slice(1).toLowerCase();
        const fn = mod[methodName] || mod.onRequest;
        if (!fn) {
          return new Response(JSON.stringify({ ok: false, error: '方法不被支持' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          });
        }
        return fn(ctx);
      },
    };
  }

  return null;
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      sourcemap: 'hidden',
    },
    server: {
      port: 5173,
      strictPort: false,
    },
    logLevel: 'info',
    plugins: [
      react({
        babel: {
          plugins: [
            'react-dev-locator',
          ],
        },
      }),
      tsconfigPaths(),
      edgeoneFunctionsPlugin(env),
    ],
  }
})
