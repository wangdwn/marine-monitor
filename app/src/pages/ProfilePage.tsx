import { useAuth } from "@/hooks/useAuth";
import {
  UserCircle,
  Building2,
  MapPin,
  Bookmark,
  FileText,
  CreditCard,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <UserCircle className="w-16 h-16 text-[#A8B5A0] mb-4" />
        <h2 className="text-xl font-semibold text-[#2D2D2D] mb-2">未登录</h2>
        <p className="text-sm text-[#6B6B6B] mb-6">请先登录以查看个人信息</p>
        <a
          href="/login"
          className="px-6 py-3 bg-[#2D2D2D] text-[#F4F1EA] rounded-3xl text-sm font-medium hover:bg-[#4A5D23] transition-colors"
        >
          去登录
        </a>
      </div>
    );
  }

  const menuGroups = [
    {
      title: "我的服务",
      items: [
        { icon: FileText, label: "我的报告", count: 12, color: "#4A5D23" },
        { icon: Bookmark, label: "我的收藏", count: 8, color: "#A8B5A0" },
        { icon: CreditCard, label: "订阅管理", count: 1, color: "#7B9E6B" },
      ],
    },
    {
      title: "设置",
      items: [
        { icon: Bell, label: "消息通知", count: 0, color: "#6B6B6B" },
        { icon: Settings, label: "账号设置", count: 0, color: "#6B6B6B" },
      ],
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl shadow-soft p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-[#A8B5A0]/15 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full rounded-3xl object-cover" />
            ) : (
              <UserCircle className="w-10 h-10 text-[#4A5D23]" />
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-[#2D2D2D] mb-1">
              {user.name ?? "海洋观察者"}
            </h2>
            <div className="flex items-center gap-4 text-sm text-[#6B6B6B]">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {user.companyName ?? "未设置企业"}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {user.region ?? "广州"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="px-3 py-1 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-medium">
                {user.role === "admin"
                  ? "管理员"
                  : user.userType === "paid"
                  ? "付费用户"
                  : user.userType === "enterprise"
                  ? "企业用户"
                  : "免费用户"}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#A8B5A0]/10 text-[#A8B5A0] text-xs font-medium">
                {user.industryTrack
                  ? user.industryTrack === "marine_tourism"
                    ? "海洋文旅"
                    : user.industryTrack === "marine_biotech"
                    ? "海洋生物医药"
                    : user.industryTrack
                  : "未选择赛道"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Groups */}
      {menuGroups.map((group) => (
        <div key={group.title} className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className="px-8 py-4 border-b border-[rgba(45,45,45,0.06)]">
            <h3 className="text-sm font-semibold text-[#6B6B6B] uppercase tracking-wider">
              {group.title}
            </h3>
          </div>
          <div className="divide-y divide-[rgba(45,45,45,0.06)]">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  className="flex items-center gap-4 w-full px-8 py-4 hover:bg-[#F4F1EA]/50 transition-colors text-left"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>
                  <span className="flex-1 text-sm text-[#2D2D2D]">{item.label}</span>
                  {item.count > 0 && (
                    <span className="w-6 h-6 rounded-full bg-[#C45B4A] text-white text-xs flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button
        onClick={() => logout()}
        className="w-full flex items-center justify-center gap-2 py-4 bg-white rounded-3xl shadow-soft text-[#C45B4A] hover:bg-[#C45B4A]/5 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span className="text-sm font-medium">退出登录</span>
      </button>
    </div>
  );
}
