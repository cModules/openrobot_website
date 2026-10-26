import { MessageCircle } from "lucide-react";
import { useContact } from "@/lib/contact";

/**
 * 右下角常驻联系按钮。挂在 App 根部，所有页面都能点到。
 */
export default function ContactFab() {
  const { open } = useContact();

  return (
    <button
      type="button"
      onClick={() => open("wechat")}
      aria-label="联系我们"
      title="联系我们"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white shadow-lg shadow-primary-900/30 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
