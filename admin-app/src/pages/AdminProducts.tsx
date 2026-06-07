import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, X, ChevronDown, ChevronUp, DollarSign, Search, CheckSquare, Square, Eye, GripVertical } from "lucide-react";
import { useProducts } from "@/lib/useData";
import { useToast } from "@/components/Toast";
import type { Product, ProductCategory } from "@/lib/dataManager";

export default function AdminProducts() {
  const { products, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct } = useProducts();
  const { showToast } = useToast();
  
  const [expandedCategory, setExpandedCategory] = useState<string | null>(products[0]?.id || null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [categoryName, setCategoryName] = useState("");
  
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<{ categoryId: string; product: Product } | null>(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    image: "",
    price: "",
    specs: ["", "", "", ""],
  });
  
  // 搜索和筛选
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  
  // 批量选择
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  
  // 预览弹窗
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [previewCategory, setPreviewCategory] = useState<ProductCategory | null>(null);

  // 拖拽状态
  const [draggedItem, setDraggedItem] = useState<{ type: 'product' | 'category'; id: string; categoryId?: string } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<{ type: 'product' | 'category'; id: string; categoryId?: string } | null>(null);

  // 筛选后的产品
  const filteredProducts = useMemo(() => {
    return products.map(category => ({
      ...category,
      items: category.items.filter(product => 
        (filterCategory === "all" || category.id === filterCategory) &&
        (searchQuery === "" || 
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    })).filter(category => category.items.length > 0 || searchQuery === "");
  }, [products, searchQuery, filterCategory]);

  const handleOpenCategoryModal = (category?: { id: string; name: string }) => {
    if (category) {
      setEditingCategory(category);
      setCategoryName(category.name);
    } else {
      setEditingCategory(null);
      setCategoryName("");
    }
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (!categoryName.trim()) {
      showToast('error', '请输入分类名称');
      return;
    }
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryName);
      showToast('success', '分类已更新');
    } else {
      addCategory(categoryName);
      showToast('success', '分类已添加');
    }
    setShowCategoryModal(false);
    setCategoryName("");
    setEditingCategory(null);
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = products.find(c => c.id === categoryId);
    if (selectedCategories.has(categoryId)) {
      setSelectedCategories(prev => {
        const next = new Set(prev);
        next.delete(categoryId);
        return next;
      });
    }
    if (category && category.items.length > 0) {
      showToast('warning', '请先删除该分类下的所有产品');
      return;
    }
    deleteCategory(categoryId);
    showToast('success', '分类已删除');
  };

  const handleBatchDeleteCategories = () => {
    if (selectedCategories.size === 0) return;
    const categoriesToDelete = products.filter(cat => 
      selectedCategories.has(cat.id) && cat.items.length === 0
    );
    if (categoriesToDelete.length === 0) {
      showToast('warning', '选中的分类中无可删除的空分类');
      return;
    }
    categoriesToDelete.forEach(cat => deleteCategory(cat.id));
    showToast('success', `已删除 ${categoriesToDelete.length} 个分类`);
    setSelectedCategories(new Set());
  };

  void handleBatchDeleteCategories; // 保留功能以备后用

  const handleOpenProductModal = (categoryId: string, product?: Product) => {
    if (product) {
      setEditingProduct({ categoryId, product });
      setProductData({
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        specs: [...product.specs, ...Array(4 - product.specs.length).fill("")],
      });
    } else {
      setEditingProduct(null);
      setProductData({
        name: "",
        description: "",
        image: "",
        price: "",
        specs: ["", "", "", ""],
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!productData.name.trim()) {
      showToast('error', '请输入产品名称');
      return;
    }
    const specs = productData.specs.filter(s => s.trim());
    if (editingProduct) {
      updateProduct(editingProduct.categoryId, editingProduct.product.id, { ...productData, specs });
      showToast('success', '产品已更新');
    } else {
      if (!expandedCategory) {
        showToast('error', '请先选择一个分类');
        return;
      }
      addProduct(expandedCategory, { ...productData, specs });
      showToast('success', '产品已添加');
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (categoryId: string, productId: string) => {
    if (selectedProducts.has(productId)) {
      setSelectedProducts(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
    deleteProduct(categoryId, productId);
    showToast('success', '产品已删除');
  };

  const handleBatchDeleteProducts = () => {
    if (selectedProducts.size === 0) return;
    let deleted = 0;
    products.forEach(category => {
      category.items.forEach(product => {
        if (selectedProducts.has(product.id)) {
          deleteProduct(category.id, product.id);
          deleted++;
        }
      });
    });
    showToast('success', `已删除 ${deleted} 个产品`);
    setSelectedProducts(new Set());
  };

  const toggleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  const toggleSelectCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const selectAllInCategory = (categoryId: string) => {
    const category = products.find(c => c.id === categoryId);
    if (!category) return;
    setSelectedProducts(prev => {
      const next = new Set(prev);
      const allSelected = category.items.every(item => next.has(item.id));
      if (allSelected) {
        category.items.forEach(item => next.delete(item.id));
      } else {
        category.items.forEach(item => next.add(item.id));
      }
      return next;
    });
  };

  const updateSpec = (index: number, value: string) => {
    const newSpecs = [...productData.specs];
    newSpecs[index] = value;
    setProductData({ ...productData, specs: newSpecs });
  };

  // 拖拽处理
  const handleDragStart = (type: 'product' | 'category', id: string, categoryId?: string) => {
    setDraggedItem({ type, id, categoryId });
  };

  const handleDragOver = (e: React.DragEvent, type: 'product' | 'category', id: string, categoryId?: string) => {
    e.preventDefault();
    setDragOverItem({ type, id, categoryId });
  };

  const handleDragEnd = () => {
    if (draggedItem && dragOverItem && draggedItem.id !== dragOverItem.id) {
      // 实现排序逻辑
      // 这里需要更新 DataManager 的排序方法
      // 由于当前使用 localStorage，可以重新排列数组
    }
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="space-y-6">
      {/* 头部工具栏 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">产品管理</h3>
          <p className="text-sm text-slate-400">管理产品分类和产品信息</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBatchDeleteProducts}
            disabled={selectedProducts.size === 0}
            className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
              selectedProducts.size > 0 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            批量删除 ({selectedProducts.size})
          </button>
          <button
            onClick={() => handleOpenCategoryModal()}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            添加分类
          </button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索产品名称或描述..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
        >
          <option value="all">全部分类</option>
          {products.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.category}</option>
          ))}
        </select>
        {(searchQuery || filterCategory !== "all") && (
          <button
            onClick={() => { setSearchQuery(""); setFilterCategory("all"); }}
            className="px-3 py-2 text-slate-400 hover:text-white transition-colors"
          >
            清除筛选
          </button>
        )}
      </div>

      {/* 产品列表 */}
      <div className="space-y-4">
        {filteredProducts.map((category) => (
          <div 
            key={category.id} 
            className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all ${
              dragOverItem?.id === category.id && dragOverItem?.type === 'category' ? 'border-primary-500' : ''
            }`}
            draggable
            onDragStart={() => handleDragStart('category', category.id)}
            onDragOver={(e) => handleDragOver(e, 'category', category.id)}
            onDragLeave={() => setDragOverItem(null)}
            onDragEnd={handleDragEnd}
          >
            <div
              className="flex items-center justify-between px-6 py-4 bg-slate-800/50 cursor-pointer hover:bg-slate-800 transition-all"
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelectCategory(category.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {selectedCategories.has(category.id) ? (
                    <CheckSquare className="w-5 h-5 text-primary-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                {expandedCategory === category.id ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
                <span className="font-semibold text-white">{category.category}</span>
                <span className="text-sm px-2 py-0.5 bg-slate-700 text-slate-300 rounded-full">
                  {category.items.length} 个产品
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAllInCategory(category.id);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                  title="全选"
                >
                  <CheckSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewCategory(category);
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                  title="预览"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCategoryModal({ id: category.id, name: category.category });
                  }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(category.id);
                  }}
                  className={`p-2 rounded-lg transition-all ${
                    category.items.length === 0
                      ? "text-red-400 hover:text-red-300 hover:bg-red-900/30"
                      : "text-slate-600 cursor-not-allowed"
                  }`}
                  disabled={category.items.length > 0}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {expandedCategory === category.id && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-400">产品列表</span>
                  <button
                    onClick={() => handleOpenProductModal(category.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent-600 hover:bg-accent-700 text-white text-sm font-medium rounded-lg transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    添加产品
                  </button>
                </div>

                {category.items.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    {searchQuery ? '没有找到匹配的产品' : '暂无产品，请点击上方按钮添加'}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.items.map((product) => (
                      <div 
                        key={product.id} 
                        className={`bg-slate-800 rounded-xl p-4 transition-all ${
                          dragOverItem?.id === product.id && dragOverItem?.type === 'product' ? 'border-primary-500' : ''
                        } ${selectedProducts.has(product.id) ? 'ring-2 ring-primary-500' : ''}`}
                        draggable
                        onDragStart={() => handleDragStart('product', product.id, category.id)}
                        onDragOver={(e) => handleDragOver(e, 'product', product.id, category.id)}
                        onDragLeave={() => setDragOverItem(null)}
                        onDragEnd={handleDragEnd}
                      >
                        <div className="flex gap-4">
                          <div 
                            className="w-20 h-20 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer group"
                            onClick={() => setPreviewProduct(product)}
                          >
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleSelectProduct(product.id)}
                                  className="p-1 text-slate-400 hover:text-white"
                                >
                                  {selectedProducts.has(product.id) ? (
                                    <CheckSquare className="w-4 h-4 text-primary-400" />
                                  ) : (
                                    <Square className="w-4 h-4" />
                                  )}
                                </button>
                                <h4 className="font-semibold text-white truncate">{product.name}</h4>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => setPreviewProduct(product)}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-all"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenProductModal(category.id, product)}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-all"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(category.id, product.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <p className="text-sm text-slate-400 mt-1 line-clamp-2">{product.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <DollarSign className="w-4 h-4 text-accent-400" />
                              <span className="text-sm font-medium text-white">{product.price}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.specs.slice(0, 4).map((spec, idx) => (
                                <span key={idx} className="text-xs px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                                  {spec}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 分类模态框 */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingCategory ? "编辑分类" : "添加分类"}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">分类名称</label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveCategory()}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="输入分类名称"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
                >
                  {editingCategory ? "保存" : "添加"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 产品模态框 */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl m-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingProduct ? "编辑产品" : "添加产品"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">产品名称</label>
                <input
                  type="text"
                  value={productData.name}
                  onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="输入产品名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">产品描述</label>
                <textarea
                  value={productData.description}
                  onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="输入产品描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">产品图片 URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={productData.image}
                    onChange={(e) => setProductData({ ...productData, image: e.target.value })}
                    className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    placeholder="输入图片 URL"
                  />
                  {productData.image && (
                    <div className="w-12 h-12 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={productData.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">产品价格</label>
                <input
                  type="text"
                  value={productData.price}
                  onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="例如：¥1,299"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">产品参数（最多4个）</label>
                <div className="grid grid-cols-2 gap-3">
                  {productData.specs.map((spec, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={spec}
                      onChange={(e) => updateSpec(idx, e.target.value)}
                      className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                      placeholder={`参数 ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
                >
                  {editingProduct ? "保存" : "添加"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 产品预览弹窗 */}
      {previewProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewProduct(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-3xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">产品详情预览</h3>
              <button
                onClick={() => setPreviewProduct(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3">
                <div className="aspect-square bg-slate-800 rounded-xl overflow-hidden">
                  <img src={previewProduct.image} alt={previewProduct.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-2">{previewProduct.name}</h4>
                  <p className="text-slate-400 leading-relaxed">{previewProduct.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-6 h-6 text-accent-400" />
                  <span className="text-2xl font-bold text-white">{previewProduct.price}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {previewProduct.specs.map((spec, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 分类预览弹窗 */}
      {previewCategory && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewCategory(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-4xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">{previewCategory.category} - 产品列表</h3>
              <button
                onClick={() => setPreviewCategory(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
              {previewCategory.items.map((product) => (
                <div key={product.id} className="bg-slate-800 rounded-xl p-4">
                  <div className="w-full h-32 bg-slate-700 rounded-lg overflow-hidden mb-3">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-semibold text-white mb-1 truncate">{product.name}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-accent-400 font-medium">{product.price}</span>
                    <span className="text-xs text-slate-500">{product.specs.length} 个参数</span>
                  </div>
                </div>
              ))}
              {previewCategory.items.length === 0 && (
                <div className="col-span-full text-center py-8 text-slate-500">
                  该分类暂无产品
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
