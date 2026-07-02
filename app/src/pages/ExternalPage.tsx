import { trpc } from "@/providers/trpc";
import { useState } from "react";
import { Link } from "react-router";
import {
  Globe,
  ChevronRight,
  Download,
  ExternalLink,
  Calendar,
  Tag,
  BookOpen,
  BarChart3,
  TrendingUp,
  Anchor,
  Fish,
  Sun,
  Wind,
  Ship,
  Users,
  Zap,
  Leaf,
  Database,
  Search,
  Filter,
  ArrowUpRight,
} from "lucide-react";

const typeIcons: Record<string, { icon: typeof Globe; color: string }> = {
  "海运贸易": { icon: Ship, color: "#1B3A5C" },
  "渔业水产": { icon: Fish, color: "#2E7D9A" },
  "海洋综合": { icon: Globe, color: "#4A8B5C" },
  "宏观经济": { icon: BarChart3, color: "#D4823D" },
  "海洋气候": { icon: Sun, color: "#B54848" },
  "投资经济": { icon: TrendingUp, color: "#1B3A5C" },
  "海洋监测": { icon: Database, color: "#6B7280" },
  "国别海洋经济": { icon: Anchor, color: "#2E7D9A" },
  "邮轮旅游": { icon: Users, color: "#D4823D" },
  "海洋新能源": { icon: Zap, color: "#4A8B5C" },
  "海洋可持续商业": { icon: Leaf, color: "#2E7D9A" },
  "海洋能源": { icon: Wind, color: "#1B3A5C" },
};

const dimNames: Record<string, string> = {
  hub: "港口枢纽", industry: "产业集群", population: "市场人气",
  ecosystem: "生态支撑", capital: "资本热度",
};

export default function ExternalPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeType, setActiveType] = useState("");
  const [search, setSearch] = useState("");

  const { data: listData } = trpc.external.list.useQuery(
    activeType ? { reportType: activeType, page: 1, limit: 20 } : { page: 1, limit: 20 }
  );
  const { data: featured } = trpc.external.featured.useQuery();
  const { data: stats } = trpc.external.stats.useQuery();
  const { data: detail } = trpc.external.detail.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  if (selectedId && detail) {
    const findings = detail.keyFindings
      ? typeof detail.keyFindings === "string"
        ? JSON.parse(detail.keyFindings)
        : detail.keyFindings
      : [];
    const dims = detail.relatedDimensions
      ? typeof detail.relatedDimensions === "string"
        ? JSON.parse(detail.relatedDimensions)
        : detail.relatedDimensions
      : [];
    const tm = typeIcons[detail.reportType] ?? { icon: Globe, color: "#6B7280" };
    const TypeIcon = tm.icon;

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A5C] transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          返回报告列表
        </button>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-6 lg:p-8 border-b border-[#E2E5EA]">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium flex items-center gap-1"
                style={{ backgroundColor: tm.color }}
              >
                <TypeIcon className="w-3 h-3" />
                {detail.reportType}
              </span>
              {detail.isFeatured && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] text-xs font-medium">
                  ★ 精选
                </span>
              )}
              <span className="px-2.5 py-1 rounded-lg bg-[#F0F2F5] text-[#6B7280] text-xs">
                {detail.accessType}
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#1A1D21] mb-2">{detail.title}</h1>
            <div className="flex items-center gap-4 text-xs text-[#6B7280]">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {detail.publishYear}</span>
              <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {detail.publisher}</span>
              <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {detail.updateFrequency}更新</span>
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 lg:p-8 border-b border-[#E2E5EA]">
            <h3 className="text-sm font-semibold text-[#1A1D21] mb-3">报告简介</h3>
            <p className="text-sm text-[#6B7280] leading-relaxed">{detail.summary}</p>
          </div>

          {/* Key Findings */}
          <div className="p-6 lg:p-8 border-b border-[#E2E5EA]">
            <h3 className="text-sm font-semibold text-[#1A1D21] mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2E7D9A]" /> 核心数据发现
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {findings.map((f: { metric: string; value: string; unit: string; context: string }, i: number) => (
                <div key={i} className="p-4 rounded-xl bg-[#F0F2F5]">
                  <p className="text-[11px] text-[#6B7280] mb-1">{f.metric}</p>
                  <p className="text-lg font-bold text-[#1A1D21]">
                    {f.value}<span className="text-xs font-normal text-[#6B7280] ml-1">{f.unit}</span>
                  </p>
                  <p className="text-[10px] text-[#6B7280] mt-1">{f.context}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Related Dimensions */}
          {dims.length > 0 && (
            <div className="p-6 lg:p-8 border-b border-[#E2E5EA]">
              <h3 className="text-sm font-semibold text-[#1A1D21] mb-3">关联监测维度</h3>
              <div className="flex flex-wrap gap-2">
                {dims.map((d: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-[#DBEAFE] text-[#1B3A5C] text-xs font-medium">
                    {dimNames[d] ?? d}
                  </span>
                ))}
              </div>
              <p className="text-xs text-[#6B7280] mt-3">
                以上维度与本平台五维监测体系对应，可在数据看板中查看广州相关指标
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="p-6 lg:p-8 flex flex-wrap gap-3">
            {detail.publicUrl && (
              <a
                href={detail.publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#1B3A5C] text-white text-sm font-medium hover:bg-[#2E7D9A] transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" /> 查看官方页面
              </a>
            )}
            {detail.downloadUrl && (
              <a
                href={detail.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#4A8B5C] text-white text-sm font-medium hover:bg-[#3A7B4C] transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> 下载报告(PDF)
              </a>
            )}
            <Link
              to="/"
              className="px-5 py-2.5 rounded-xl border border-[#E2E5EA] text-[#6B7280] text-sm font-medium hover:bg-[#F0F2F5] transition-colors flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" /> 去数据看板对比
            </Link>
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
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">全球权威海洋报告</h1>
            <p className="text-xs text-white/80">公认公开报告 · 硬核数据 · 免费获取 · 可对比参考</p>
          </div>
        </div>
        <p className="text-sm text-white/90 mt-3 leading-relaxed">
          收录联合国(UNCTAD/FAO/IPCC)、OECD、IEA、GWEC等权威机构发布的公开海洋经济报告。
          所有报告均不涉及知识产权限制，可自由下载和引用，用于与本平台采集数据进行交叉验证和对比分析。
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-[#1B3A5C]" />
            <span className="text-xs text-[#6B7280]">收录报告</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">{stats?.total ?? 0}</p>
          <p className="text-[10px] text-[#6B7280] mt-1">全部公开可获取</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4 text-[#2E7D9A]" />
            <span className="text-xs text-[#6B7280]">来源机构</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">10+</p>
          <p className="text-[10px] text-[#6B7280] mt-1">联合国/OECD/IEA等</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#4A8B5C]" />
            <span className="text-xs text-[#6B7280]">数据维度</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">5</p>
          <p className="text-[10px] text-[#6B7280] mt-1">枢纽/产业/人口/生态/资本</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-[#D4823D]" />
            <span className="text-xs text-[#6B7280]">可直接下载</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">8</p>
          <p className="text-[10px] text-[#6B7280] mt-1">PDF免费下载</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="搜索报告名称或机构..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F0F2F5] rounded-xl text-sm text-[#1A1D21] placeholder:text-[#6B7280]/60 outline-none focus:ring-2 focus:ring-[#2E7D9A]/20"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveType("")}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${!activeType ? "bg-[#1B3A5C] text-white" : "bg-[#F0F2F5] text-[#6B7280]"}`}
            >
              全部
            </button>
            {(stats?.byType ?? []).map((t) => (
              <button
                key={t.reportType}
                onClick={() => setActiveType(activeType === t.reportType ? "" : t.reportType)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  activeType === t.reportType ? "bg-[#1B3A5C] text-white" : "bg-[#F0F2F5] text-[#6B7280]"
                }`}
              >
                {t.reportType} ({t.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Reports */}
      {featured && featured.length > 0 && !activeType && !search && (
        <div>
          <h2 className="text-sm font-semibold text-[#1A1D21] mb-3 flex items-center gap-2">
            <StarBadge /> 精选报告 · 优先参考
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured.map((r) => {
              const tm = typeIcons[r.reportType] ?? { icon: Globe, color: "#6B7280" };
              const Icon = tm.icon;
              return (
                <div
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className="bg-white rounded-2xl shadow-card p-5 cursor-pointer hover:shadow-glow transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${tm.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: tm.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="px-2 py-0.5 rounded text-white text-[10px] font-medium"
                          style={{ backgroundColor: tm.color }}
                        >
                          {r.reportType}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10px]">
                          ★ 精选
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-[#1A1D21] group-hover:text-[#2E7D9A] transition-colors line-clamp-2">
                        {r.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] mt-1">{r.publisher}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-[#6B7280]">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.publishYear}</span>
                        <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {r.accessType}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#2E7D9A] flex-shrink-0 mt-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Reports */}
      <div>
        <h2 className="text-sm font-semibold text-[#1A1D21] mb-3">
          {activeType ? `${activeType}报告` : "全部报告"}
        </h2>
        <div className="space-y-2">
          {(listData?.items ?? []).map((r) => {
            const tm = typeIcons[r.reportType] ?? { icon: Globe, color: "#6B7280" };
            const Icon = tm.icon;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className="bg-white rounded-xl shadow-card p-4 cursor-pointer hover:shadow-glow transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${tm.color}15` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: tm.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded text-white text-[10px] font-medium"
                        style={{ backgroundColor: tm.color }}
                      >
                        {r.reportType}
                      </span>
                      {r.isFeatured && (
                        <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10px]">★ 精选</span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-[#F0F2F5] text-[#6B7280] text-[10px]">{r.accessType}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-[#1A1D21] group-hover:text-[#2E7D9A] transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">{r.publisher}</p>
                    <p className="text-xs text-[#6B7280] line-clamp-1 mt-1">{r.summary}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#6B7280]">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.publishYear}</span>
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {r.updateFrequency}</span>
                      <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {r.language}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#2E7D9A] flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StarBadge() {
  return <span className="text-[#D4823D]">★</span>;
}
