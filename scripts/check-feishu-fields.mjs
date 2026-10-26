/**
 * 飞书多维表格字段自检
 *
 * 用途：确认表格列名能被反馈接口识别，避免提交时报 1254045 FieldNameNotFound。
 *
 * 用法：
 *   node --env-file=.env scripts/check-feishu-fields.mjs
 *
 * 需要 .env 里有 FEISHU_APP_ID 与 FEISHU_APP_SECRET，
 * 且应用已开通 bitable:app 权限、已被添加为该多维表格的协作者。
 */

const FEISHU_BASE = "https://open.feishu.cn/open-apis";

const APP_TOKEN = process.env.FEISHU_APP_TOKEN || "Yjsxbe3JtaooPcsnqw8cjoDKnLc";
const TABLE_ID = process.env.FEISHU_TABLE_ID || "tblqXi1w70G8dEHx";

const TYPE_NAME = {
  1: "多行文本",
  2: "数字",
  3: "单选",
  4: "多选",
  5: "日期",
  7: "复选框",
  11: "人员",
  13: "电话号码",
  15: "超链接",
  17: "附件",
  18: "关联",
  20: "公式",
  21: "双向关联",
  1001: "创建时间",
  1002: "最后更新时间",
  1003: "创建人",
  1004: "修改人",
  1005: "自动编号",
};

const READONLY = new Set([20, 1001, 1002, 1003, 1004, 1005]);

// 必须与 functions/api/feedback.js 里的 FIELD_ALIASES 保持一致
const FIELD_ALIASES = {
  name: ["姓名", "名字", "称呼", "Name"],
  email: ["邮箱", "电子邮箱", "邮件", "Email"],
  type: ["反馈类型", "类型", "分类", "Type"],
  subject: ["主题", "标题", "问题", "Subject"],
  message: ["详细描述", "反馈详情", "描述", "内容", "详情", "反馈内容", "Message"],
  submittedAt: ["提交时间", "创建时间", "反馈时间", "时间", "Submitted At"],
};

// 表单里「反馈类型」的三个取值，必须和表格单选列的选项完全一致
const TYPE_OPTIONS = ["功能建议", "问题报告", "其他"];

const appId = process.env.FEISHU_APP_ID;
const appSecret = process.env.FEISHU_APP_SECRET;

if (!appId || !appSecret) {
  console.error("缺少 FEISHU_APP_ID / FEISHU_APP_SECRET");
  console.error("请先准备 .env，再用：node --env-file=.env scripts/check-feishu-fields.mjs");
  process.exit(1);
}

const normalize = (value) => String(value).replace(/\s+/g, "").toLowerCase();

function pickField(meta, aliases) {
  for (const alias of aliases) {
    const hit = meta.find((field) => field.field_name === alias);
    if (hit) return hit;
  }
  for (const alias of aliases) {
    const hit = meta.find((field) => normalize(field.field_name) === normalize(alias));
    if (hit) return hit;
  }
  return null;
}

async function main() {
  console.log(`表格 app_token: ${APP_TOKEN}`);
  console.log(`数据表 table_id: ${TABLE_ID}\n`);

  const authRes = await fetch(`${FEISHU_BASE}/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
  });
  const auth = await authRes.json();

  if (auth.code !== 0) {
    console.error(`鉴权失败(${auth.code}): ${auth.msg}`);
    console.error("检查 App ID / Secret 是否正确。");
    process.exit(1);
  }
  console.log("鉴权成功\n");

  const fieldsRes = await fetch(
    `${FEISHU_BASE}/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/fields?page_size=200`,
    { headers: { Authorization: `Bearer ${auth.tenant_access_token}` } },
  );
  const fieldsData = await fieldsRes.json();

  if (fieldsData.code !== 0) {
    console.error(`读取字段失败(${fieldsData.code}): ${fieldsData.msg}`);
    console.error("常见原因：应用没有被添加为该多维表格的协作者，或未开通 bitable:app 权限。");
    process.exit(1);
  }

  const meta = fieldsData.data?.items ?? [];
  console.log(`表格共 ${meta.length} 个字段：\n`);

  for (const field of meta) {
    const readonly = READONLY.has(field.type) ? "（只读，跳过）" : "";
    console.log(
      `  ${field.field_name.padEnd(14, " ")} ${TYPE_NAME[field.type] ?? field.type}${readonly}`,
    );
    const options = field.property?.options?.map((option) => option.name);
    if (options?.length) {
      console.log(`  ${"".padEnd(14, " ")}   选项：${options.join(" / ")}`);
    }
  }

  console.log("\n表单字段映射结果：\n");

  let writable = 0;
  for (const [key, aliases] of Object.entries(FIELD_ALIASES)) {
    const field = pickField(meta, aliases);
    if (!field) {
      console.log(`  ✗ ${key.padEnd(12)} 未匹配 — 建议把某一列改名为「${aliases[0]}」`);
      continue;
    }
    if (READONLY.has(field.type)) {
      console.log(
        `  ○ ${key.padEnd(12)} 匹配到只读列「${field.field_name}」，由飞书自动记录，无需写入`,
      );
      continue;
    }
    writable += 1;
    console.log(`  ✓ ${key.padEnd(12)} → 「${field.field_name}」`);
  }

  // 单选列只能填已有选项，必须提前核对
  const typeField = pickField(meta, FIELD_ALIASES.type);
  if (typeField && typeField.type === 3) {
    const options = (typeField.property?.options ?? []).map((option) => option.name);
    console.log(`\n「反馈类型」是单选列，现有选项：${options.join(" / ") || "（无）"}`);
    const missing = TYPE_OPTIONS.filter((value) => !options.includes(value));
    if (missing.length) {
      console.log(`  ⚠ 表格里缺少这些选项：${missing.join(" / ")}`);
      console.log("    请在飞书表格中把单选选项补齐，否则对应反馈会写入失败。");
    } else {
      console.log("  ✓ 表单的三个类型值都能对应上");
    }
  }

  console.log("");
  if (writable === 0) {
    console.error("没有任何字段可写入，反馈接口会直接报错。请按上面提示改列名。");
    process.exit(1);
  }
  console.log(`共 ${writable} 个字段可写入，配置可用。`);
}

main().catch((error) => {
  console.error("执行失败：", error);
  process.exit(1);
});
