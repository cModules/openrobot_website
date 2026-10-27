import { guessContentType } from "../_shared/mime.js";
import {
  getBlobStore,
  checkAdmin,
  isValidKey,
  corsHeaders,
  STORE_NAME,
} from "../_shared/blob.js";

/**
 * 资源管理接口（需要管理口令）
 *
 *   GET    /api/blob?prefix=products/        列出资源
 *   POST   /api/blob                         申请预签名上传地址（大文件，浏览器直传 COS）
 *   POST   /api/blob  (octet-stream, ?key=)  小文件直接经函数写入
 *   DELETE /api/blob?key=xxx                 删除资源
 *
 * 鉴权：请求头带 x-admin-token，值等于环境变量 ADMIN_API_TOKEN。
 *
 * 为什么大文件要"预签名直传"：
 *   边缘函数对请求体有大小限制，100M 的安装包根本传不进来。
 *   createUploadUrl 会生成一个有时效的 COS 直传地址，
 *   浏览器直接 PUT 到 COS，字节流完全不经过函数。
 */

const DIRECT_UPLOAD_LIMIT = 4 * 1024 * 1024; // 4MB，超过就必须走预签名

/** 所有响应都带 CORS 头，否则后台跨站调用会被浏览器拦下 */
function json(request, env, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request, env),
    },
  });
}

/** 预检请求：浏览器在带自定义头（x-admin-token）时先发 OPTIONS */
export async function onRequestOptions({ request, env }) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(request, env),
  });
}

export async function onRequestGet({ request, env }) {
  const denied = checkAdmin(request, env);
  if (denied) return json(request, env, { ok: false, error: denied }, 401);

  const prefix = new URL(request.url).searchParams.get("prefix") || "";

  try {
    const store = getBlobStore(env);
    const result = await store.list({ prefix });
    const blobs = (result.blobs || []).map((blob) => ({ key: blob.key }));

    return json(request, env, { ok: true, store: STORE_NAME, count: blobs.length, blobs });
  } catch (error) {
    return json(request, env, { ok: false, error: error.message }, 500);
  }
}

export async function onRequestPost({ request, env }) {
  const denied = checkAdmin(request, env);
  if (denied) return json(request, env, { ok: false, error: denied }, 401);

  const store = getBlobStore(env);
  const url = new URL(request.url);

  // 小文件直传：body 是原始字节，key 放 query
  const directKey = url.searchParams.get("key");
  const isBinary =
    (request.headers.get("content-type") || "").startsWith("application/octet-stream");

  if (isBinary && directKey) {
    if (!isValidKey(directKey)) {
      return json(request, env, { ok: false, error: "非法 key" }, 400);
    }
    try {
      const buffer = await request.arrayBuffer();
      if (buffer.byteLength > DIRECT_UPLOAD_LIMIT) {
        return json(
          request,
          env,
          { ok: false, error: "文件超过 4MB，请改用预签名直传" },
          413,
        );
      }
      await store.set(directKey, buffer, {
        contentType: guessContentType(directKey),
        cacheControl: "public, max-age=31536000, immutable",
      });
      return json(request, env, { ok: true, key: directKey, size: buffer.byteLength });
    } catch (error) {
      return json(request, env, { ok: false, error: error.message }, 500);
    }
  }

  // 预签名直传：body 是 JSON { key, contentType? }
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(request, env, { ok: false, error: "请求格式不正确" }, 400);
  }

  const key = String(payload.key || "").trim();
  if (!isValidKey(key)) {
    return json(request, env, { ok: false, error: "缺少或非法的 key" }, 400);
  }

  try {
    const contentType = payload.contentType || guessContentType(key);
    const result = await store.createUploadUrl(key, {
      contentType,
      expireSeconds: Number(payload.expireSeconds) || 3600,
    });

    return json(request, env, {
      ok: true,
      uploadUrl: result.url,
      key: result.key,
      expiresAt: result.expiresAt,
      contentType,
    });
  } catch (error) {
    return json(request, env, { ok: false, error: error.message }, 500);
  }
}

export async function onRequestDelete({ request, env }) {
  const denied = checkAdmin(request, env);
  if (denied) return json(request, env, { ok: false, error: denied }, 401);

  const key = new URL(request.url).searchParams.get("key");
  if (!isValidKey(key)) {
    return json(request, env, { ok: false, error: "缺少或非法的 key" }, 400);
  }

  try {
    const store = getBlobStore(env);
    await store.delete(key);
    return json(request, env, { ok: true, key });
  } catch (error) {
    return json(request, env, { ok: false, error: error.message }, 500);
  }
}
