// layout.tsx
import { requireAdmin } from "@/lib/auth";
import Sidebar from "./Sidebar";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}