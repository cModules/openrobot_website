/**
 * 联系方式弹窗的全局状态。
 *
 * 联系信息不再单独占一个页面，改为任意位置点击都能唤起的弹窗，
 * 这样在首页/产品/下载等任何页面都能直接拿到微信、邮箱、GitHub。
 */
import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

export type ContactTab = "wechat" | "email" | "github";

interface ContactContextValue {
  isOpen: boolean;
  tab: ContactTab;
  open: (tab?: ContactTab) => void;
  close: () => void;
}

const ContactContext = createContext<ContactContextValue | undefined>(
  undefined,
);

export function useContact(): ContactContextValue {
  const ctx = useContext(ContactContext);
  if (!ctx) {
    throw new Error("useContact must be used within a ContactProvider");
  }
  return ctx;
}

export function ContactProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<ContactTab>("wechat");

  const open = useCallback((next: ContactTab = "wechat") => {
    setTab(next);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactContext.Provider value={{ isOpen, tab, open, close }}>
      {children}
    </ContactContext.Provider>
  );
}
