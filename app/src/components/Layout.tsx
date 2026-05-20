import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  MapPin,
  FileText,
  ScrollText,
  UserCircle,
  Shield,
  Bell,
  Compass,
  ClipboardList,
  ShieldCheck,
  Terminal,
  Wallet,
  Megaphone,
  Activity,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";

// 导航项定义，包含所需最低权限级别
const navItems = [
  { path: "/", label: "数据看板", icon: LayoutDashboard, minLevel: 0 as const },
  { path: "/survey", label: "资源调查", icon: Compass, minLevel: 1 },
  { path: "/planning", label: "规划保障", icon: ClipboardList, minLevel: 1 },
  { path: "/safety", label: "安全屏障", icon: ShieldCheck, minLevel: 1 },
  { path: "/map", label: "产业地图", icon: MapPin, minLevel: 1 },
  { path: "/reports", label: "分析报告", icon: FileText, minLevel: 1 },
  { path: "/policies", label: "政策文件", icon: ScrollText, minLevel: 1 },
  { path: "/collector", label: "数据采集", icon: Terminal, minLevel: 1 },
  { path: "/funding", label: "基金申报", icon: Wallet, minLevel: 1 },
  { path: "/announce", label: "公告中心", icon: Megaphone, minLevel: 1 },
  { path: "/automation", label: "自动化中心", icon: Activity, minLevel: 1 },
  { path: "/external", label: "全球报告", icon: Globe, minLevel: 2 }, // VIP专属
];

// 根据用户权限级别过滤导航项
function getVisibleNavItems(roleLevel: number) {
  return navItems.filter(item => (item.minLevel ?? 0) <= roleLevel);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { user, logout, roleLevel } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNavItems = getVisibleNavItems(roleLevel ?? 0);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen bg-white border-r border-[#E2E5EA] transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-[#E2E5EA]">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
              <Compass className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1B3A5C] truncate leading-tight">海洋经济监测</p>
                <p className="text-[10px] text-[#6B7280] truncate">广州市规划和自然资源局</p>
              </div>
            )}
          </Link>
        </div>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-white border border-[#E2E5EA] rounded-full items-center justify-center shadow-sm hover:shadow-md transition-shadow z-10"
        >
          <span className="text-xs text-[#6B7280]">{sidebarOpen ? "<" : ">"}</span>
        </button>

        {/* Nav */}
        <nav className="p-3 space-y-0.5">
          {visibleNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-[#1B3A5C]/8 text-[#1B3A5C] font-medium"
                    : "text-[#6B7280] hover:bg-[#F0F2F5] hover:text-[#1A1D21]"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? "text-[#1B3A5C]" : ""}`} />
                {sidebarOpen && (
                  <span className="text-sm truncate">{item.label}</span>
                )}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              to="/admin"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                location.pathname === "/admin"
                  ? "bg-[#1B3A5C]/8 text-[#1B3A5C] font-medium"
                  : "text-[#6B7280] hover:bg-[#F0F2F5] hover:text-[#1A1D21]"
              }`}
            >
              <Shield className={`w-[18px] h-[18px] flex-shrink-0 ${location.pathname === "/admin" ? "text-[#1B3A5C]" : ""}`} />
              {sidebarOpen && <span className="text-sm truncate">管理后台</span>}
            </Link>
          )}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#E2E5EA]">
          {user ? (
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-full bg-[#1B3A5C]/10 flex items-center justify-center flex-shrink-0">
                <UserCircle className="w-4 h-4 text-[#1B3A5C]" />
              </div>
              {sidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-[#1A1D21] truncate">{user.name ?? "用户"}</p>
                  <button onClick={() => logout()} className="text-xs text-[#6B7280] hover:text-[#B54848] transition-colors">
                    退出
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#1B3A5C] text-white hover:bg-[#152D49] transition-colors text-sm">
              登录
            </Link>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/85 backdrop-blur-xl border-b border-[#E2E5EA] flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-[#F0F2F5]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="hidden sm:flex items-center gap-2 text-xs text-[#6B7280]">
              <span>广州市规划和自然资源局</span>
              <span>/</span>
              <span className="text-[#1B3A5C] font-medium">
                {visibleNavItems.find((n) => n.path === location.pathname)?.label ?? (location.pathname === "/admin" ? "管理后台" : "")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-[#F0F2F5] transition-colors">
              <Bell className="w-[18px] h-[18px] text-[#6B7280]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#B54848] rounded-full" />
            </button>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
