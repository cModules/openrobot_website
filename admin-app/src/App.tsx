import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContent } from "@/lib/store";
import Login from "@/pages/Login";
import AdminLayout from "@/pages/AdminLayout";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminDownloads from "@/pages/AdminDownloads";
import AdminDocs from "@/pages/AdminDocs";
import AdminAssets from "@/pages/AdminAssets";
import AdminSettings from "@/pages/AdminSettings";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center text-sm">
      正在从 GitHub 拉取内容…
    </div>
  );
}

export default function App() {
  const { token, content, loading } = useContent();

  return (
    <Router>
      {!token ? (
        <Login />
      ) : loading || !content ? (
        <LoadingScreen />
      ) : (
        <Routes>
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="downloads" element={<AdminDownloads />} />
            <Route path="docs" element={<AdminDocs />} />
            <Route path="assets" element={<AdminAssets />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </Router>
  );
}
