import { useState, useMemo } from "react";
import { Plus, Edit2, Trash2, X, Code, Terminal, BookOpen, FileText, Monitor, Apple, Server, Download, Eye, CheckSquare, Square, Search } from "lucide-react";
import { useDownloads, useDocumentation } from "@/lib/useData";
import { useToast } from "@/components/Toast";
import type { DownloadItem, Documentation } from "@/lib/dataManager";

const IconMap: Record<string, any> = {
  FileText, Code, BookOpen, Monitor, Apple, Server, Terminal,
  Download
};

const availableIcons = [
  { name: "Code", label: "代码" },
  { name: "Terminal", label: "终端" },
  { name: "BookOpen", label: "书籍" },
  { name: "FileText", label: "文档" },
  { name: "Download", label: "下载" },
  { name: "Monitor", label: "显示器" },
  { name: "Apple", label: "苹果" },
  { name: "Server", label: "服务器" },
];

const availablePlatforms = [
  { name: "Windows", icon: "Monitor" },
  { name: "macOS", icon: "Apple" },
  { name: "Linux", icon: "Server" },
  { name: "ORV-Cam Pro", icon: "Monitor" },
  { name: "ORV-Cam Lite", icon: "Monitor" },
  { name: "ORV-Controller", icon: "Monitor" },
];

export default function AdminDownloads() {
  const { downloads, addDownload, updateDownload, deleteDownload } = useDownloads();
  const { documentation, addDoc, updateDoc, deleteDoc } = useDocumentation();
  const { showToast } = useToast();
  
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null);
  const [downloadData, setDownloadData] = useState({
    title: "",
    description: "",
    icon: "Code",
    platforms: [{ name: "", icon: "Monitor", link: "#" }],
    version: "",
    date: "",
  });
  
  const [showDocModal, setShowDocModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Documentation | null>(null);
  const [docData, setDocData] = useState({
    title: "",
    description: "",
    icon: "BookOpen",
  });

  // 搜索和筛选
  const [searchQuery, setSearchQuery] = useState("");
  
  // 批量选择
  const [selectedDownloads, setSelectedDownloads] = useState<Set<string>>(new Set());
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  
  // 预览
  const [previewDownload, setPreviewDownload] = useState<DownloadItem | null>(null);
  const [previewDoc, setPreviewDoc] = useState<Documentation | null>(null);
  
  // 筛选后的数据
  const filteredDownloads = useMemo(() => {
    if (!searchQuery) return downloads;
    return downloads.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [downloads, searchQuery]);

  const filteredDocs = useMemo(() => {
    if (!searchQuery) return documentation;
    return documentation.filter(d => 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [documentation, searchQuery]);

  const handleOpenDownloadModal = (download?: DownloadItem) => {
    if (download) {
      setEditingDownload(download);
      setDownloadData({
        title: download.title,
        description: download.description,
        icon: download.icon,
        platforms: [...download.platforms],
        version: download.version,
        date: download.date,
      });
    } else {
      setEditingDownload(null);
      setDownloadData({
        title: "",
        description: "",
        icon: "Code",
        platforms: [{ name: "", icon: "Monitor", link: "#" }],
        version: "",
        date: new Date().toISOString().split('T')[0],
      });
    }
    setShowDownloadModal(true);
  };

  const handleSaveDownload = () => {
    if (!downloadData.title.trim()) {
      showToast('error', '请输入下载项标题');
      return;
    }
    if (editingDownload) {
      updateDownload(editingDownload.id, downloadData);
      showToast('success', '下载项已更新');
    } else {
      addDownload(downloadData);
      showToast('success', '下载项已添加');
    }
    setShowDownloadModal(false);
    setEditingDownload(null);
  };

  const handleDeleteDownload = (id: string) => {
    if (selectedDownloads.has(id)) {
      setSelectedDownloads(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    deleteDownload(id);
    showToast('success', '下载项已删除');
  };

  const handleBatchDeleteDownloads = () => {
    if (selectedDownloads.size === 0) return;
    selectedDownloads.forEach(id => deleteDownload(id));
    showToast('success', `已删除 ${selectedDownloads.size} 个下载项`);
    setSelectedDownloads(new Set());
  };

  const toggleSelectDownload = (id: string) => {
    setSelectedDownloads(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleOpenDocModal = (doc?: Documentation) => {
    if (doc) {
      setEditingDoc(doc);
      setDocData({
        title: doc.title,
        description: doc.description,
        icon: doc.icon,
      });
    } else {
      setEditingDoc(null);
      setDocData({
        title: "",
        description: "",
        icon: "BookOpen",
      });
    }
    setShowDocModal(true);
  };

  const handleSaveDoc = () => {
    if (!docData.title.trim()) {
      showToast('error', '请输入文档标题');
      return;
    }
    if (editingDoc) {
      updateDoc(editingDoc.id, docData);
      showToast('success', '文档已更新');
    } else {
      addDoc(docData);
      showToast('success', '文档已添加');
    }
    setShowDocModal(false);
    setEditingDoc(null);
  };

  const handleDeleteDoc = (id: string) => {
    if (selectedDocs.has(id)) {
      setSelectedDocs(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
    deleteDoc(id);
    showToast('success', '文档已删除');
  };

  const handleBatchDeleteDocs = () => {
    if (selectedDocs.size === 0) return;
    selectedDocs.forEach(id => deleteDoc(id));
    showToast('success', `已删除 ${selectedDocs.size} 个文档`);
    setSelectedDocs(new Set());
  };

  const toggleSelectDoc = (id: string) => {
    setSelectedDocs(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addPlatform = () => {
    if (downloadData.platforms.length < 6) {
      setDownloadData({
        ...downloadData,
        platforms: [...downloadData.platforms, { name: "", icon: "Monitor", link: "#" }],
      });
    }
  };

  const removePlatform = (index: number) => {
    setDownloadData({
      ...downloadData,
      platforms: downloadData.platforms.filter((_, idx) => idx !== index),
    });
  };

  const updatePlatform = (index: number, field: string, value: string) => {
    const newPlatforms = [...downloadData.platforms];
    newPlatforms[index] = { ...newPlatforms[index], [field]: value };
    setDownloadData({ ...downloadData, platforms: newPlatforms });
  };

  return (
    <div className="space-y-8">
      {/* 下载管理 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">下载管理</h3>
            <p className="text-sm text-slate-400">管理下载资源和版本信息</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchDeleteDownloads}
              disabled={selectedDownloads.size === 0}
              className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
                selectedDownloads.size > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              批量删除 ({selectedDownloads.size})
            </button>
            <button
              onClick={() => handleOpenDownloadModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              添加下载项
            </button>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索下载项..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* 下载列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDownloads.map((download) => {
            const Icon = IconMap[download.icon] || Download;
            return (
              <div 
                key={download.id} 
                className={`bg-slate-900 border border-slate-800 rounded-xl p-5 transition-all ${
                  selectedDownloads.has(download.id) ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSelectDownload(download.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {selectedDownloads.has(download.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewDownload(download)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDownloadModal(download)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDownload(download.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-white mb-1">{download.title}</h4>
                <p className="text-sm text-slate-400 line-clamp-2 mb-3">{download.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-1 bg-primary-600/20 text-primary-400 rounded-lg">{download.version}</span>
                  <span className="text-slate-500">{download.date}</span>
                </div>
              </div>
            );
          })}
          {filteredDownloads.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              {searchQuery ? '没有找到匹配的下载项' : '暂无下载项'}
            </div>
          )}
        </div>
      </div>

      {/* 文档管理 */}
      <div className="space-y-6" id="docs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">文档管理</h3>
            <p className="text-sm text-slate-400">管理文档和教程资源</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBatchDeleteDocs}
              disabled={selectedDocs.size === 0}
              className={`flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-all ${
                selectedDocs.size > 0 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              批量删除 ({selectedDocs.size})
            </button>
            <button
              onClick={() => handleOpenDocModal()}
              className="flex items-center gap-2 px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white font-medium rounded-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              添加文档
            </button>
          </div>
        </div>

        {/* 文档列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => {
            const Icon = IconMap[doc.icon] || BookOpen;
            return (
              <div 
                key={doc.id} 
                className={`bg-slate-900 border border-slate-800 rounded-xl p-5 transition-all ${
                  selectedDocs.has(doc.id) ? 'ring-2 ring-primary-500' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleSelectDoc(doc.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {selectedDocs.has(doc.id) ? (
                        <CheckSquare className="w-5 h-5 text-primary-400" />
                      ) : (
                        <Square className="w-5 h-5" />
                      )}
                    </button>
                    <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-400" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleOpenDocModal(doc)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h4 className="font-semibold text-white mb-1">{doc.title}</h4>
                <p className="text-sm text-slate-400 line-clamp-2">{doc.description}</p>
              </div>
            );
          })}
          {filteredDocs.length === 0 && (
            <div className="col-span-full text-center py-12 text-slate-500">
              {searchQuery ? '没有找到匹配的文档' : '暂无文档'}
            </div>
          )}
        </div>
      </div>

      {/* 下载项模态框 */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl m-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingDownload ? "编辑下载项" : "添加下载项"}
              </h3>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">标题</label>
                <input
                  type="text"
                  value={downloadData.title}
                  onChange={(e) => setDownloadData({ ...downloadData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="输入标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">描述</label>
                <textarea
                  value={downloadData.description}
                  onChange={(e) => setDownloadData({ ...downloadData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="输入描述"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">版本</label>
                  <input
                    type="text"
                    value={downloadData.version}
                    onChange={(e) => setDownloadData({ ...downloadData, version: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    placeholder="例如：v1.0.0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">发布日期</label>
                  <input
                    type="date"
                    value={downloadData.date}
                    onChange={(e) => setDownloadData({ ...downloadData, date: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">图标</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon.name}
                      onClick={() => setDownloadData({ ...downloadData, icon: icon.name })}
                      className={`p-3 rounded-lg transition-all ${
                        downloadData.icon === icon.name 
                          ? 'bg-primary-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {icon.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-300">
                    平台 ({downloadData.platforms.length}/6)
                  </label>
                  {downloadData.platforms.length < 6 && (
                    <button
                      onClick={addPlatform}
                      className="text-sm text-primary-400 hover:text-primary-300"
                    >
                      + 添加平台
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {downloadData.platforms.map((platform) => {
                    const idx = downloadData.platforms.indexOf(platform);
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <select
                          value={platform.icon}
                          onChange={(e) => updatePlatform(idx, "icon", e.target.value)}
                          className="w-20 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary-500"
                        >
                          {availablePlatforms.map((p) => (
                            <option key={p.name} value={p.icon}>{p.name}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={platform.name}
                          onChange={(e) => updatePlatform(idx, "name", e.target.value)}
                          className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                          placeholder="平台名称"
                        />
                        {downloadData.platforms.length > 1 && (
                          <button
                            onClick={() => removePlatform(idx)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDownloadModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveDownload}
                  className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
                >
                  {editingDownload ? "保存" : "添加"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文档模态框 */}
      {showDocModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">
                {editingDoc ? "编辑文档" : "添加文档"}
              </h3>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">标题</label>
                <input
                  type="text"
                  value={docData.title}
                  onChange={(e) => setDocData({ ...docData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  placeholder="输入文档标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">描述</label>
                <textarea
                  value={docData.description}
                  onChange={(e) => setDocData({ ...docData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 resize-none"
                  placeholder="输入文档描述"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">图标</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((icon) => (
                    <button
                      key={icon.name}
                      onClick={() => setDocData({ ...docData, icon: icon.name })}
                      className={`p-3 rounded-lg transition-all ${
                        docData.icon === icon.name 
                          ? 'bg-green-600 text-white' 
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {icon.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowDocModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveDoc}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all"
                >
                  {editingDoc ? "保存" : "添加"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 下载项预览弹窗 */}
      {previewDownload && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewDownload(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">下载项详情</h3>
              <button
                onClick={() => setPreviewDownload(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-600/20 rounded-xl flex items-center justify-center">
                  {(() => {
                    const Icon = IconMap[previewDownload.icon] || Download;
                    return <Icon className="w-8 h-8 text-primary-400" />;
                  })()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{previewDownload.title}</h4>
                  <p className="text-slate-400">{previewDownload.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="px-3 py-1 bg-primary-600/20 text-primary-400 rounded-lg">{previewDownload.version}</span>
                <span className="text-slate-500">发布日期：{previewDownload.date}</span>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-300 mb-2">可用平台</h5>
                <div className="flex flex-wrap gap-2">
                  {previewDownload.platforms.map((platform, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm">
                      {platform.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 文档预览弹窗 */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setPreviewDoc(null)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">文档详情</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center">
                  {(() => {
                    const Icon = IconMap[previewDoc.icon] || BookOpen;
                    return <Icon className="w-8 h-8 text-green-400" />;
                  })()}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{previewDoc.title}</h4>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed">{previewDoc.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
