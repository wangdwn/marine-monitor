import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import {
  Users,
  FileText,
  ScrollText,
  Eye,
  TrendingUp,
  Shield,
  UserCircle,
  BarChart3,
} from "lucide-react";

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  const { data: stats } = trpc.admin.stats.useQuery(undefined, { enabled: user?.role === "admin" });
  const { data: userList } = trpc.admin.userList.useQuery({ limit: 10 }, { enabled: user?.role === "admin" });
  const { data: reportList } = trpc.admin.reportList.useQuery({ limit: 10 }, { enabled: user?.role === "admin" });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#A8B5A0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const statCards = [
    {
      label: "用户总数",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "#A8B5A0",
    },
    {
      label: "报告总数",
      value: stats?.totalReports ?? 0,
      icon: FileText,
      color: "#4A5D23",
    },
    {
      label: "政策总数",
      value: stats?.totalPolicies ?? 0,
      icon: ScrollText,
      color: "#7B9E6B",
    },
    {
      label: "今日浏览",
      value: stats?.todayViews ?? 3420,
      icon: Eye,
      color: "#C45B4A",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="w-6 h-6 text-[#4A5D23]" />
        <h1 className="text-xl font-semibold text-[#2D2D2D]">管理后台</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-3xl shadow-soft p-6 hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${card.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <TrendingUp className="w-4 h-4 text-[#6B6B6B]/30" />
              </div>
              <p className="text-2xl font-semibold text-[#2D2D2D] font-mono">{card.value}</p>
              <p className="text-xs text-[#6B6B6B] mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(45,45,45,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-[#4A5D23]" />
              <h3 className="text-sm font-semibold text-[#2D2D2D]">最近用户</h3>
            </div>
            <span className="text-xs text-[#6B6B6B]">共 {userList?.total ?? 0} 人</span>
          </div>
          <div className="divide-y divide-[rgba(45,45,45,0.06)]">
            {(userList?.items ?? []).map((u) => (
              <div key={u.id} className="px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#A8B5A0]/15 flex items-center justify-center">
                  <UserCircle className="w-4 h-4 text-[#4A5D23]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#2D2D2D] truncate">{u.name ?? `用户${u.id}`}</p>
                  <p className="text-xs text-[#6B6B6B]">{u.email ?? "未设置邮箱"}</p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    u.role === "admin"
                      ? "bg-[#C45B4A]/10 text-[#C45B4A]"
                      : "bg-[#A8B5A0]/10 text-[#A8B5A0]"
                  }`}
                >
                  {u.role === "admin" ? "管理员" : "用户"}
                </span>
              </div>
            ))}
            {(!userList?.items || userList.items.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-[#6B6B6B]">暂无用户数据</div>
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className="px-6 py-4 border-b border-[rgba(45,45,45,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#4A5D23]" />
              <h3 className="text-sm font-semibold text-[#2D2D2D]">报告管理</h3>
            </div>
            <span className="text-xs text-[#6B6B6B]">共 {reportList?.total ?? 0} 篇</span>
          </div>
          <div className="divide-y divide-[rgba(45,45,45,0.06)]">
            {(reportList?.items ?? []).map((r) => (
              <div key={r.id} className="px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#A8B5A0]/15 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-[#4A5D23]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#2D2D2D] truncate">{r.title}</p>
                  <p className="text-xs text-[#6B6B6B]">
                    {r.trackType} · {r.viewCount}次浏览
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    r.isPublished
                      ? "bg-[#4A5D23]/10 text-[#4A5D23]"
                      : "bg-[#6B6B6B]/10 text-[#6B6B6B]"
                  }`}
                >
                  {r.isPublished ? "已发布" : "草稿"}
                </span>
              </div>
            ))}
            {(!reportList?.items || reportList.items.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-[#6B6B6B]">暂无报告数据</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-3xl shadow-soft p-8">
        <h3 className="text-sm font-semibold text-[#2D2D2D] mb-4">快捷操作</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "新增报告", icon: FileText, color: "#4A5D23" },
            { label: "导入政策", icon: ScrollText, color: "#A8B5A0" },
            { label: "用户管理", icon: Users, color: "#7B9E6B" },
            { label: "数据统计", icon: BarChart3, color: "#C45B4A" },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#F4F1EA] hover:bg-[#A8B5A0]/10 transition-colors"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${action.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-sm text-[#2D2D2D]">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
