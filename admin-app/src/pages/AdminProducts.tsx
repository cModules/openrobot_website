import { useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { useContent } from "@/lib/store";
import { Field, TextInput, TextAreaInput } from "@/components/Field";
import { generateId, parseLines, toLines } from "@/lib/types";
import type { ProductCategory, ProductItem } from "@/lib/types";

const panelClass = "bg-slate-900 border border-slate-800 rounded-xl p-6";
const dangerClass =
  "px-3 py-2 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-900/20 transition-all flex items-center gap-1.5 text-xs flex-shrink-0";

function emptyProduct(): ProductItem {
  return {
    id: generateId("prod"),
    name: "新产品",
    description: "",
    image: "",
    price: "",
    purchaseUrl: "",
    introPath: "",
    specs: [],
  };
}

export default function AdminProducts() {
  const { content, update } = useContent();
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!content) return null;

  const categories = content.products;
  const active: ProductCategory | undefined =
    categories.find((cat) => cat.id === activeId) ?? categories[0];

  const patchCategory = (id: string, changes: Partial<ProductCategory>) => {
    update((c) => ({
      ...c,
      products: c.products.map((cat) =>
        cat.id === id ? { ...cat, ...changes } : cat
      ),
    }));
  };

  const patchItem = (
    catId: string,
    itemId: string,
    changes: Partial<ProductItem>
  ) => {
    update((c) => ({
      ...c,
      products: c.products.map((cat) =>
        cat.id === catId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, ...changes } : item
              ),
            }
          : cat
      ),
    }));
  };

  const addCategory = () => {
    const created: ProductCategory = {
      id: generateId("cat"),
      category: "新分类",
      items: [],
    };
    update((c) => ({ ...c, products: [...c.products, created] }));
    setActiveId(created.id);
  };

  const deleteCategory = (id: string) => {
    if (!window.confirm("确定删除该分类及其下所有产品？")) return;
    update((c) => ({
      ...c,
      products: c.products.filter((cat) => cat.id !== id),
    }));
    if (active?.id === id) setActiveId(null);
  };

  const addItem = (catId: string) => {
    update((c) => ({
      ...c,
      products: c.products.map((cat) =>
        cat.id === catId
          ? { ...cat, items: [...cat.items, emptyProduct()] }
          : cat
      ),
    }));
  };

  const deleteItem = (catId: string, itemId: string) => {
    update((c) => ({
      ...c,
      products: c.products.map((cat) =>
        cat.id === catId
          ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) }
          : cat
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
          产品管理
          </h1>
          <p className="text-slate-400 text-sm">
          编辑产品分类与产品条目，改完点右上角「发布到线上」。
          </p>
        </div>
        <button
          type="button"
          onClick={addCategory}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg border border-slate-700 transition-all flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增分类
        </button>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <div className={panelClass}>
          <h2 className="text-white font-semibold mb-4">分类</h2>
          <div className="space-y-1.5">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveId(cat.id)}
                className={
                  active?.id === cat.id
                    ? 'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all bg-primary-600/20 text-accent-400'
                    : 'w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all text-slate-400 hover:bg-slate-800 hover:text-white'
                }
              >
                <span className="flex items-center gap-2 min-w-0 truncate">
                  <Package className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{cat.category}</span>
                </span>
                <span className="text-xs text-slate-500 flex-shrink-0">
                  {cat.items.length}
                </span>
              </button>
            ))}
            {categories.length === 0 ? (
              <p className="text-slate-500 text-sm">还没有分类</p>
            ) : null}
          </div>
        </div>

        <div className="space-y-5">
          {active ? (
            <div className={panelClass}>
              <div className="flex items-end justify-between gap-4">
                <div className="flex-1">
                  <Field label="分类名称">
                    <TextInput
                      value={active.category}
                      onChange={(value) =>
                        patchCategory(active.id, { category: value })
                      }
                      placeholder="例如：软件产品"
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCategory(active.id)}
                  className={dangerClass}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  删除该分类
                </button>
              </div>
            </div>
          ) : null}

          {active ? (
            <div className={panelClass}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-semibold">
                  产品条目（{active.items.length}）
                </h2>
                <button
                  type="button"
                  onClick={() => addItem(active.id)}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增产品
                </button>
              </div>
              <div className="space-y-4">
                {active.items.map(item => (
                  <div
                    key={item.id}
                    className="border border-slate-800 rounded-lg p-5 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <Field label="产品名称">
                          <TextInput
                            value={item.name}
                            onChange={(value) =>
                              patchItem(active.id, item.id, { name: value })
                          }
                            placeholder="例如：roboWorld"
                          />
                        </Field>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteItem(active.id, item.id)}
                        className={dangerClass}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        删除
                      </button>
                    </div>
                    <Field label="产品简介">
                      <TextAreaInput
                        value={item.description}
                        onChange={(value) =>
                          patchItem(active.id, item.id, { description: value })
                      }
                        rows={3}
                        placeholder="一两句话说清这个产品"
                      />
                    </Field>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Field label="价格">
                        <TextInput
                          value={item.price}
                          onChange={(value) =>
                            patchItem(active.id, item.id, { price: value })
                      }
                          placeholder="免费 / 面议 / ¥1,299"
                        />
                      </Field>
                      <Field label="图片地址" hint="留空则显示图标占位">
                        <TextInput
                          value={item.image}
                          onChange={(value) =>
                            patchItem(active.id, item.id, { image: value })
                        }
                          placeholder="/images/xxx.png"
                        />
                      </Field>
                      <Field
                        label="下单链接（闲鱼等）"
                        hint="留空则显示「立即咨询」"
                      >
                        <TextInput
                          value={item.purchaseUrl}
                          onChange={(value) =>
                            patchItem(active.id, item.id, { purchaseUrl: value })
                        }
                          placeholder="https://..."
                        />
                      </Field>
                      <Field
                        label="产品介绍页路径"
                        hint="填资源库里的路径，填了主站才会出现「产品介绍」入口"
                      >
                        <TextInput
                          value={item.introPath || ''}
                          onChange={(value) =>
                            patchItem(active.id, item.id, { introPath: value })
                        }
                          placeholder="products/roboworld/index.html"
                        />
                      </Field>
                    </div>
                    <Field label="规格列表" hint="每行一条">
                      <TextAreaInput
                        value={toLines(item.specs)}
                        onChange={(value) =>
                          patchItem(active.id, item.id, { specs: parseLines(value) })
                        }
                          rows={4}
                        placeholder="6 自由度，舵机驱动"
                      />
                    </Field>
                  </div>
                ))}
                {active.items.length === 0 ? (
                  <p className="text-slate-500 text-sm">该分类下还没有产品</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
