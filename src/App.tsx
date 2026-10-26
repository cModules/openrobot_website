import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductIntro from "@/pages/ProductIntro";
import DownloadPage from "@/pages/Download";
import Feedback from "@/pages/Feedback";
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
          <Route path="/download" element={<DownloadPage />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>
      <ContactFab />
      <ContactModal />
    </ContactProvider>
  );
}
