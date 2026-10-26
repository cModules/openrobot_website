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

export function isValidKey(key) {
  return (
    typeof key === "string" &&
    key.length > 0 &&
    !key.startsWith("/") &&
    !key.includes("..")
  );
}
