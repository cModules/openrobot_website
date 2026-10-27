import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductIntro from "@/pages/ProductIntro";
import DownloadPage from "@/pages/Download";
import Cases from "@/pages/Cases";
import CaseIntro from "@/pages/CaseIntro";
import Contact from "@/pages/Contact";
import { ContactProvider } from "@/lib/contact";
import ContactModal from "@/components/ContactModal";
import ContactFab from "@/components/ContactFab";

export default function App() {
  return (
    <ContactProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:productId" element={<ProductIntro />} />
          <Route path="/resources" element={<DownloadPage />} />
          <Route path="/cases" element={<Cases />} />
          <Route path="/case/:caseId" element={<CaseIntro />} />
          <Route path="/contact" element={<Contact />} />

          {/* 旧地址重定向，避免已分享出去的链接变成 404 */}
          <Route path="/download" element={<Navigate to="/resources" replace />} />
          <Route path="/feedback" element={<Navigate to="/contact" replace />} />
        </Routes>
      </Router>
      <ContactFab />
      <ContactModal />
    </ContactProvider>
  );
}
