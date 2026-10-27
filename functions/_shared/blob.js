import { getStore } from "@edgeone/pages-blob";

export const STORE_NAME = "openrobot";

/**
 * 获取 Blob Store。
 *
 * 线上（Pages Functions）：环境变量里有 PAGES_BLOB_DEPLOY_CREDENTIAL，
 *   getStore(name) 会自动认证，不需要任何配置。
 * 本地（vite dev）：没有那个变量，改用显式 token 模式，
 *   需要在 .env 里配 EDGEONE_PROJECT_ID 和 EDGEONE_TOKEN。
 */
export function getBlobStore(env) {
  if (env?.EDGEONE_PROJECT_ID && env?.EDGEONE_TOKEN) {
    return getStore({
      name: STORE_NAME,
      projectId: env.EDGEONE_PROJECT_ID,
      token: env.EDGEONE_TOKEN,
    });
  }
  return getStore(STORE_NAME);
}

/** 校验管理口令；未配置时一律拒绝，避免接口裸奔 */
export function checkAdmin(request, env) {
  const expected = env?.ADMIN_API_TOKEN;
  if (!expected) {
    return "服务端未配置 ADMIN_API_TOKEN，资源管理接口已禁用";
  }
  const provided = request.headers.get("x-admin-token") || "";
  if (provided !== expected) {
    return "管理口令不正确";
  }
  return null;
}

/**
 * CORS 响应头。
 *
 * 后台部署在独立域名（如 admin.openrobot.work），跨站调用本接口时
 * 浏览器会先发 OPTIONS 预检，且要求响应带 Access-Control-Allow-Origin。
 * 缺少这些头时，后台的资源库页面在浏览器里会直接失败。
 *
 * 想限定来源可配环境变量 ALLOWED_ORIGIN（逗号分隔多个），
 * 例如：https://admin.openrobot.work,http://localhost:5174
 * 未配置时回显请求来源（即允许任意源）。
 * 注意：真正的访问控制靠 x-admin-token，CORS 本身不是安全边界。
 */
export function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = (env?.ALLOWED_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  let allowOrigin = origin;
  if (allowed.length > 0) {
    allowOrigin = allowed.includes(origin) ? origin : allowed[0];
  }

  return {
    "Access-Control-Allow-Origin": allowOrigin || "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
    "Access-Control-Max-Age": "86400",
  };
}

export function isValidKey(key) {
  return (
    typeof key === "string" &&
    key.length > 0 &&
    !key.startsWith("/") &&
    !key.includes("..")
  );
}
