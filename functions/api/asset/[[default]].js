import { getBlobStore } from "../../_shared/blob.js";
import { guessContentType, isInlineType } from "../../_shared/mime.js";

/**
 * 资源读取（公开）
 *
 * 路由：GET /api/asset/<key>
 * 例：  /api/asset/products/roboworld/index.html
 *
 * 为什么用路径而不是 ?key=：
 *   产品介绍是完整 HTML 站点，页面内部用相对路径引用 assets/xxx.png。
 *   用 /api/asset/products/roboworld/index.html 这种路径形式时，
 *   浏览器会把它解析成 /api/asset/products/roboworld/assets/xxx.png，
 *   正好能命中同一个函数；用 ?key= 则会解析到 /assets/xxx.png 而 404。
 *
 * Blob Storage 没有公开直链（SDK 走 STS + COS），所以资源必须经过这里中转。
 * 响应带了一年强缓存，首次回源后由 EdgeOne CDN 直接命中，不会每次都走函数。
 */

const CACHE_MAX_AGE = 31536000; // 1 年

export async function onRequestGet({ params, env }) {
  const rawKey = params?.default;
  if (!rawKey) {
    return new Response("缺少资源路径", { status: 400 });
  }

  // [[default]] 可能给数组（多级路径），统一转成字符串
  const key = Array.isArray(rawKey) ? rawKey.join("/") : String(rawKey);

  // 防目录穿越
  if (key.includes("..")) {
    return new Response("非法路径", { status: 400 });
  }

  try {
    const store = getBlobStore(env);

    const meta = await store.getMetadata(key).catch(() => null);
    if (!meta) {
      return new Response("资源不存在", { status: 404 });
    }

    const body = await store.get(key, { type: "arrayBuffer" });
    if (!body) {
      return new Response("资源不存在", { status: 404 });
    }

    const contentType = meta.contentType || guessContentType(key);
    const headers = {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${CACHE_MAX_AGE}, immutable`,
    };

    // 压缩包、安装包等不在浏览器里打开，强制下载
    if (!isInlineType(contentType)) {
      const filename = key.split("/").pop() || "download";
      headers["Content-Disposition"] = `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`;
    }

    return new Response(body, { headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(`读取资源失败: ${message}`, { status: 500 });
  }
}
