import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  Megaphone,
  ChevronRight,
  Pin,
  Calendar,
  Tag,
  Info,
  Sparkles,
  MousePointerClick,
  Puzzle,
  ShieldCheck,
  MessageSquare,
  Bell,
  Heart,
  BookOpen,
} from "lucide-react";

const categoryMeta: Record<string, { label: string; icon: typeof Info; color: string; bg: string }> = {
  "平台介绍": { label: "系统介绍", icon: Info, color: "#1B3A5C", bg: "#DBEAFE" },
  "功能预告": { label: "功能预告", icon: Sparkles, color: "#D4823D", bg: "#FEF3C7" },
  "操作指南": { label: "操作指导", icon: MousePointerClick, color: "#2E7D9A", bg: "#DBEAFE" },
  "集成说明": { label: "集成说明", icon: Puzzle, color: "#4A8B5C", bg: "#DCFCE7" },
  "测试反馈": { label: "测试反馈", icon: MessageSquare, color: "#B54848", bg: "#FEE2E2" },
  "更新通知": { label: "更新通知", icon: Bell, color: "#6B7280", bg: "#F0F2F5" },
  "平台寄语": { label: "结束语", icon: Heart, color: "#1B3A5C", bg: "#E0E7FF" },
};

export default function AnnouncePage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("");

  const { data: listData } = trpc.announce.list.useQuery(
    activeCategory ? { category: activeCategory, page: 1, limit: 20 } : { page: 1, limit: 20 }
  );
  const { data: pinnedData } = trpc.announce.pinned.useQuery();
  const { data: latestData } = trpc.announce.latest.useQuery();
  const { data: stats } = trpc.announce.stats.useQuery();
  const { data: detail } = trpc.announce.detail.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  if (selectedId && detail) {
    const meta = categoryMeta[detail.category] ?? { label: detail.category, icon: Info, color: "#6B7280", bg: "#F0F2F5" };
    const Icon = meta.icon;
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A5C] transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          返回公告列表
        </button>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-6 lg:p-8 border-b border-[#E2E5EA]">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                style={{ backgroundColor: meta.color }}
              >
                <Icon className="w-3 h-3" />
                {meta.label}
              </span>
              {detail.isPinned && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] text-xs font-medium flex items-center gap-1">
                  <Pin className="w-3 h-3" /> 置顶
                </span>
              )}
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#1A1D21] mb-3">{detail.title}</h1>
            {detail.summary && <p className="text-sm text-[#6B7280]">{detail.summary}</p>}
          </div>

          {/* Content */}
          <div className="p-6 lg:p-8">
            <div className="prose prose-sm max-w-none text-[#1A1D21] leading-relaxed whitespace-pre-line">
              {detail.content}
            </div>
            <div className="mt-6 pt-4 border-t border-[#E2E5EA] flex items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                发布时间：{new Date(detail.publishedAt).toLocaleString('zh-CN')}
              </span>
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {detail.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">海智数科 · 公告中心</h1>
            <p className="text-xs text-white/80">系统通知 · 功能更新 · 操作指南</p>
          </div>
        </div>
        <p className="text-sm text-white/90 mt-3 leading-relaxed">
          海智数科持续致力于优化您的使用体验。我们即将上线的新模块将为您带来更强大的项目管理工具，
          包括项目跟踪、资金申请管理、数据分析等功能，敬请期待！
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("")}
          className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
            !activeCategory ? "bg-[#1B3A5C] text-white" : "bg-white text-[#6B7280] hover:bg-[#F0F2F5]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          全部公告 ({stats?.total ?? 0})
        </button>
        {Object.entries(categoryMeta).map(([key, meta]) => {
          const count = stats?.byCategory?.find((c) => c.category === key)?.count ?? 0;
          const Icon = meta.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? "" : key)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 ${
                activeCategory === key ? "text-white" : "bg-white text-[#6B7280] hover:bg-[#F0F2F5]"
              }`}
              style={activeCategory === key ? { backgroundColor: meta.color } : {}}
            >
              <Icon className="w-3.5 h-3.5" />
              {meta.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Pinned Announcements */}
      {pinnedData && pinnedData.length > 0 && !activeCategory && (
        <div className="bg-[#FEF3C7]/30 rounded-2xl p-5 border border-[#D4823D]/15">
          <div className="flex items-center gap-2 mb-4">
            <Pin className="w-4 h-4 text-[#D4823D]" />
            <h2 className="text-sm font-semibold text-[#1A1D21]">置顶公告</h2>
          </div>
          <div className="space-y-3">
            {pinnedData.map((item) => {
              const meta = categoryMeta[item.category] ?? { label: item.category, icon: Info, color: "#6B7280", bg: "#F0F2F5" };
              const Icon = meta.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className="bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-all flex items-start gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: meta.bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color: meta.color }} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#1A1D21] mb-1">{item.title}</h3>
                    <p className="text-xs text-[#6B7280] line-clamp-2">{item.summary}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#6B7280] flex-shrink-0 mt-1" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Latest Announcements */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-[#2E7D9A]" />
          <h2 className="text-sm font-semibold text-[#1A1D21]">
            {activeCategory ? `${categoryMeta[activeCategory]?.label ?? activeCategory}公告` : "全部公告"}
          </h2>
        </div>
        <div className="space-y-2">
          {(listData?.items ?? []).map((item) => {
            const meta = categoryMeta[item.category] ?? { label: item.category, icon: Info, color: "#6B7280", bg: "#F0F2F5" };
            const Icon = meta.icon;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#F0F2F5] transition-colors cursor-pointer group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Icon className="w-4 h-4" style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded text-white text-[10px] font-medium"
                      style={{ backgroundColor: meta.color }}
                    >
                      {meta.label}
                    </span>
                    {item.isPinned && (
                      <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10px] font-medium flex items-center gap-0.5">
                        <Pin className="w-2.5 h-2.5" /> 置顶
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-[#1A1D21] group-hover:text-[#2E7D9A] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] line-clamp-1 mt-0.5">{item.summary}</p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="text-[10px] text-[#6B7280]">
                    {new Date(item.publishedAt).toLocaleDateString('zh-CN')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
