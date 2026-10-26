/**
 * 反馈提交接口 —— EdgeOne Pages Function
 *
 * 路由：POST /api/feedback
 *
 * 为什么需要这一层：
 *   飞书多维表格的写入接口必须先用 app_id + app_secret 换 tenant_access_token，
 *   secret 一旦放进前端 JS 就等于公开。所以由边缘函数持有密钥，浏览器只跟本站通信。
 *
 * 需要配置的环境变量（EdgeOne 控制台 → 项目设置 → 环境变量）：
 *   FEISHU_APP_ID      飞书自建应用的 App ID
 *   FEISHU_APP_SECRET  飞书自建应用的 App Secret
 *   FEISHU_APP_TOKEN   多维表格 app_token（默认已填，见下方常量）
 *   FEISHU_TABLE_ID    数据表 table_id（默认已填，见下方常量）
 *
 * 表格列名不需要完全一致：下面 FIELD_ALIASES 里列了几个常见写法，
 * 会拿表格真实字段去匹配，匹配不上的字段自动跳过，不会整体失败。
 */

const FEISHU_BASE = "https://open.feishu.cn/open-apis";

// https://hvn7b8lgxuw.feishu.cn/base/Yjsxbe3JtaooPcsnqw8cjoDKnLc?table=tblqXi1w70G8dEHx
const DEFAULT_APP_TOKEN = "Yjsxbe3JtaooPcsnqw8cjoDKnLc";
const DEFAULT_TABLE_ID = "tblqXi1w70G8dEHx";

/**
 * 表单字段 → 表格列名候选。
 * 顺序即优先级，匹配到第一个就用。
 */
const FIELD_ALIASES = {
  name: ["姓名", "名字", "称呼", "Name"],
  email: ["邮箱", "电子邮箱", "邮件", "Email"],
  type: ["反馈类型", "类型", "分类", "Type"],
  subject: ["主题", "标题", "问题", "Subject"],
  message: ["详细描述", "反馈详情", "描述", "内容", "详情", "反馈内容", "Message"],
  submittedAt: ["提交时间", "创建时间", "反馈时间", "时间", "Submitted At"],
};

/**
 * 这些是飞书自动维护的字段，写入会被拒绝，必须跳过。
 * 20 公式 / 1001 创建时间 / 1002 最后更新时间 / 1003 创建人 / 1004 修改人 / 1005 自动编号
 */
const READONLY_FIELD_TYPES = new Set([20, 1001, 1002, 1003, 1004, 1005]);

// 边缘函数实例会被复用，缓存 token 和字段结构可以少两次外部请求
const cache = {
  token: null,
  tokenExpireAt: 0,
  fields: null,
  fieldsExpireAt: 0,
};

const FIELDS_CACHE_MS = 5 * 60 * 1000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function getTenantToken(appId, appSecret) {
  if (cache.token && Date.now() < cache.tokenExpireAt) {
    return cache.token;
  }

  const res = await fetch(`${FEISHU_BASE}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const data = await res.json();

  if (data.code !== 0) {
    throw new Error(`飞书鉴权失败(${data.code}): ${data.msg || "未知错误"}`);
  }

  cache.token = data.tenant_access_token;
  // 提前 2 分钟过期，避免边界时间戳上刚好失效
  cache.tokenExpireAt = Date.now() + Math.max(60, (data.expire || 7200) - 120) * 1000;
  return cache.token;
}

async function getFields(token, appToken, tableId) {
  if (cache.fields && Date.now() < cache.fieldsExpireAt) {
    return cache.fields;
  }

  const res = await fetch(
    `${FEISHU_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/fields?page_size=200`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();

  if (data.code !== 0) {
    throw new Error(`读取表格字段失败(${data.code}): ${data.msg || "未知错误"}`);
  }

  cache.fields = data.data?.items ?? [];
  cache.fieldsExpireAt = Date.now() + FIELDS_CACHE_MS;
  return cache.fields;
}

const normalize = (value) => String(value).replace(/\s+/g, "").toLowerCase();

function pickField(meta, aliases) {
  for (const alias of aliases) {
    const hit = meta.find((field) => field.field_name === alias);
    if (hit) return hit;
  }
  // 列名可能有空格或大小写差异，再宽松匹配一轮
  for (const alias of aliases) {
    const hit = meta.find((field) => normalize(field.field_name) === normalize(alias));
    if (hit) return hit;
  }
  return null;
}

/** 按飞书字段类型转换取值，类型不对会被接口整条拒绝 */
function coerce(field, raw) {
  if (raw === undefined || raw === null || raw === "") return undefined;

  switch (field.type) {
    case 2: {
      const num = Number(raw);
      return Number.isFinite(num) ? num : undefined;
    }
    case 3:
      return String(raw);
    case 4:
      return [String(raw)];
    case 5: {
      const num = Number(raw);
      return Number.isFinite(num) ? num : Date.now();
    }
    case 7:
      return raw === true || raw === "true";
    case 13:
      return String(raw);
    case 15:
      return { link: String(raw), text: String(raw) };
    default:
      return String(raw);
  }
}

function buildFields(meta, payload) {
  const fields = {};
  const skipped = [];

  for (const [key, aliases] of Object.entries(FIELD_ALIASES)) {
    const field = pickField(meta, aliases);
    if (!field || READONLY_FIELD_TYPES.has(field.type)) {
      skipped.push(key);
      continue;
    }

    const value = coerce(field, payload[key]);
    if (value === undefined) {
      skipped.push(key);
      continue;
    }

    fields[field.field_name] = value;
  }

  return { fields, skipped };
}

function validate(payload) {
  const subject = String(payload.subject ?? "").trim();
  const message = String(payload.message ?? "").trim();
  const email = String(payload.email ?? "").trim();

  if (!subject) return "请填写主题";
  if (!message) return "请填写详细描述";
  if (subject.length > 200) return "主题太长，请控制在 200 字以内";
  if (message.length > 5000) return "详细描述太长，请控制在 5000 字以内";
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "邮箱格式不正确";

  return null;
}

export async function onRequestPost({ request, env }) {
  const appId = env.FEISHU_APP_ID;
  const appSecret = env.FEISHU_APP_SECRET;

  if (!appId || !appSecret) {
    return json(
      {
        ok: false,
        error: "服务端未配置飞书应用凭证，请在 EdgeOne 环境变量中设置 FEISHU_APP_ID 与 FEISHU_APP_SECRET",
      },
      500,
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "请求格式不正确" }, 400);
  }

  // 蜜罐字段：页面上被 CSS 隐藏，真人填不到，机器人会填
  if (payload.website) {
    return json({ ok: true });
  }

  const invalid = validate(payload);
  if (invalid) {
    return json({ ok: false, error: invalid }, 400);
  }

  const appToken = env.FEISHU_APP_TOKEN || DEFAULT_APP_TOKEN;
  const tableId = env.FEISHU_TABLE_ID || DEFAULT_TABLE_ID;

  try {
    const token = await getTenantToken(appId, appSecret);
    const meta = await getFields(token, appToken, tableId);

    const { fields, skipped } = buildFields(meta, {
      ...payload,
      submittedAt: Date.now(),
    });

    if (Object.keys(fields).length === 0) {
      return json(
        {
          ok: false,
          error:
            "表格里没有找到能写入的列，请把列名改成：" +
            Object.values(FIELD_ALIASES)
              .map((aliases) => aliases[0])
              .join(" / "),
          availableFields: meta.map((field) => field.field_name),
        },
        500,
      );
    }

    const res = await fetch(
      `${FEISHU_BASE}/bitable/v1/apps/${appToken}/tables/${tableId}/records`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ fields }),
      },
    );
    const data = await res.json();

    if (data.code !== 0) {
      return json(
        {
          ok: false,
          error: `写入飞书表格失败(${data.code}): ${data.msg || "未知错误"}`,
          writtenFields: Object.keys(fields),
          skipped,
        },
        502,
      );
    }

    return json({ ok: true, recordId: data.data?.record?.record_id ?? null });
  } catch (error) {
    return json(
      { ok: false, error: error instanceof Error ? error.message : "提交失败" },
      502,
    );
  }
}

export async function onRequestGet() {
  return json({ ok: false, error: "请使用 POST 提交反馈" }, 405);
}
