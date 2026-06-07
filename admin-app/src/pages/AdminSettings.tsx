import { useState } from "react";
import { RotateCcw, Trash2, Save, Check, Settings, Palette, Database, Bell, Shield } from "lucide-react";
import { useSettings } from "@/lib/useData";
import { useToast } from "@/components/Toast";

export default function AdminSettings() {
  const { resetData, clearStorage } = useSettings();
  const { showToast } = useToast();
  const [resetConfirm, setResetConfirm] = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "OpenRobotVision",
    siteDescription: "开源机器人视觉系统",
    themeColor: "primary",
    enableNotifications: true,
    enableAnalytics: true,
  });
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = () => {
    localStorage.setItem('orv_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    showToast('success', '设置已保存');
  };

  const handleResetData = () => {
    resetData();
    setResetConfirm(false);
    showToast('success', '数据已恢复到默认状态');
  };

  const handleClearStorage = () => {
    clearStorage();
    setClearConfirm(false);
    showToast('success', '所有数据已清除');
  };

  const themeColors = [
    { id: "primary", name: "蓝色主题", color: "bg-blue-500" },
    { id: "accent", name: "紫色主题", color: "bg-purple-500" },
    { id: "green", name: "绿色主题", color: "bg-green-500" },
    { id: "orange", name: "橙色主题", color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">系统设置</h3>
          <p className="text-sm text-slate-400">管理系统配置和数据</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Settings className="w-5 h-5 text-primary-400" />
              <h4 className="font-semibold text-white">基本设置</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">站点名称</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">站点描述</label>
                <input
                  type="text"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>
              <button
                onClick={handleSaveSettings}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-all"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? "已保存" : "保存设置"}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-5 h-5 text-accent-400" />
              <h4 className="font-semibold text-white">外观设置</h4>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">主题颜色</label>
                <div className="flex gap-3">
                  {themeColors.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSettings({ ...settings, themeColor: theme.id })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                        settings.themeColor === theme.id
                          ? "bg-slate-700 border border-primary-500"
                          : "bg-slate-800 hover:bg-slate-700 border border-transparent"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full ${theme.color}`}></span>
                      <span className="text-sm text-white">{theme.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-green-400" />
              <h4 className="font-semibold text-white">通知设置</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">启用通知</div>
                  <div className="text-sm text-slate-400">接收系统通知和更新提醒</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.enableNotifications ? "bg-primary-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.enableNotifications ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">启用分析</div>
                  <div className="text-sm text-slate-400">收集使用数据以改进服务</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, enableAnalytics: !settings.enableAnalytics })}
                  className={`w-12 h-6 rounded-full transition-all ${
                    settings.enableAnalytics ? "bg-primary-600" : "bg-slate-700"
                  }`}
                >
                  <span
                    className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.enableAnalytics ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-5 h-5 text-orange-400" />
              <h4 className="font-semibold text-white">数据管理</h4>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setResetConfirm(true)}
                className="w-full flex items-center justify-between p-4 bg-yellow-900/30 hover:bg-yellow-900/40 border border-yellow-800/50 rounded-xl transition-all"
              >
                <div>
                  <div className="font-medium text-yellow-400">重置数据</div>
                  <div className="text-sm text-slate-400">恢复到默认数据</div>
                </div>
                <RotateCcw className="w-5 h-5 text-yellow-400" />
              </button>
              <button
                onClick={() => setClearConfirm(true)}
                className="w-full flex items-center justify-between p-4 bg-red-900/30 hover:bg-red-900/40 border border-red-800/50 rounded-xl transition-all"
              >
                <div>
                  <div className="font-medium text-red-400">清除存储</div>
                  <div className="text-sm text-slate-400">删除所有本地数据</div>
                </div>
                <Trash2 className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-blue-400" />
              <h4 className="font-semibold text-white">安全信息</h4>
            </div>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">数据存储位置</span>
                <span className="text-white">浏览器本地存储</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">数据加密</span>
                <span className="text-white">自动</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">登录状态</span>
                <span className="text-green-400">已登录</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {resetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <RotateCcw className="w-6 h-6 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">确认重置数据</h3>
            </div>
            <p className="text-slate-400 mb-6">
              此操作将恢复所有数据到默认状态，所有自定义数据将被覆盖。此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setResetConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
              >
                取消
              </button>
              <button
                onClick={handleResetData}
                className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-all"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}

      {clearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-900 border border-red-700/50 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-semibold text-white">确认清除存储</h3>
            </div>
            <p className="text-red-400 mb-6">
              此操作将删除所有本地存储的数据，包括产品、下载资源和文档。此操作无法撤销！
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setClearConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all"
              >
                取消
              </button>
              <button
                onClick={handleClearStorage}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all"
              >
                确认清除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
