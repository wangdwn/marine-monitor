import { trpc } from "@/providers/trpc";
import { useState } from "react";
import { Link } from "react-router";
import {
  Wallet,
  Search,
  Filter,
  Flame,
  ChevronRight,
  Building2,
  Landmark,
  FileText,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  BarChart3,
  TrendingUp,
} from "lucide-react";

const categoryNames: Record<string, string> = {
  "基金类": "基金类（股权/投资）",
  "专项资金类": "专项资金类（补助/奖励）",
  "国债类": "国债类（基础设施）",
};

const levelNames: Record<string, string> = {
  national: "国家级",
  provincial: "省级",
  city: "市级",
  district: "区级",
  social: "社会资本",
  cross_region: "跨区域",
};

const levelColors: Record<string, string> = {
  national: "#B54848",
  provincial: "#D4823D",
  city: "#2E7D9A",
  district: "#4A8B5C",
  social: "#6B7280",
  cross_region: "#1B3A5C",
};

const statusNames: Record<string, { label: string; color: string }> = {
  open: { label: "开放申报", color: "#4A8B5C" },
  ongoing: { label: "进行中", color: "#2E7D9A" },
  upcoming: { label: "即将开放", color: "#D4823D" },
  closed: { label: "已截止", color: "#6B7280" },
};

export default function FundingPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sourceLevel, setSourceLevel] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: listData } = trpc.fund.list.useQuery({
    page,
    limit: 20,
    search: search || undefined,
    category: category || undefined,
    sourceLevel: sourceLevel || undefined,
  });

  const { data: stats } = trpc.fund.stats.useQuery();
  const { data: hotFunds } = trpc.fund.hotList.useQuery();
  const { data: detail } = trpc.fund.detail.useQuery(
    { id: selectedId! },
    { enabled: !!selectedId }
  );

  const totalPages = listData?.totalPages ?? 1;

  const openDetail = (id: number) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Detail view
  if (selectedId && detail) {
    const tags = detail.tags
      ? typeof detail.tags === "string"
        ? JSON.parse(detail.tags)
        : detail.tags
      : [];
    const status = statusNames[detail.status] ?? { label: detail.status, color: "#6B7280" };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A5C] transition-colors"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          返回基金列表
        </button>

        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {/* Header */}
          <div className="p-6 lg:p-8 border-b border-[#E2E5EA]">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium"
                style={{ backgroundColor: levelColors[detail.sourceLevel] ?? "#6B7280" }}
              >
                {levelNames[detail.sourceLevel] ?? detail.sourceLevel}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-[#F0F2F5] text-[#6B7280] text-xs">
                {detail.category}
              </span>
              <span
                className="px-2.5 py-1 rounded-lg text-white text-xs font-medium"
                style={{ backgroundColor: status.color }}
              >
                {status.label}
              </span>
              {detail.isHot && (
                <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] text-xs font-medium flex items-center gap-1">
                  <Flame className="w-3 h-3" /> 热门
                </span>
              )}
            </div>
            <h1 className="text-xl lg:text-2xl font-bold text-[#1A1D21] mb-3">
              {detail.name}
            </h1>
            {detail.supportDirection && (
              <p className="text-sm text-[#6B7280] leading-relaxed">{detail.supportDirection}</p>
            )}
          </div>

          {/* Key Info Grid */}
          <div className="p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B3A5C]/10 flex items-center justify-center flex-shrink-0">
                  <Wallet className="w-4 h-4 text-[#1B3A5C]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">资金规模</p>
                  <p className="text-sm font-semibold text-[#1A1D21]">{detail.amountRange || "待定"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#2E7D9A]/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-[#2E7D9A]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">来源机构</p>
                  <p className="text-sm font-semibold text-[#1A1D21]">{detail.sourceOrg || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#4A8B5C]/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 text-[#4A8B5C]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">对接部门</p>
                  <p className="text-sm font-semibold text-[#1A1D21]">{detail.contactDept || "—"}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#D4823D]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#D4823D]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">依据文件</p>
                  <p className="text-sm font-semibold text-[#1A1D21]">{detail.basisDoc || "—"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#B54848]/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 h-4 text-[#B54848]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">资金类型</p>
                  <p className="text-sm font-semibold text-[#1A1D21]">{detail.fundType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6B7280]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-[#6B7280]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">申报状态</p>
                  <p className="text-sm font-semibold" style={{ color: status.color }}>
                    {status.label}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Application Process */}
          {detail.applicationProcess && (
            <div className="px-6 lg:px-8 pb-6">
              <div className="bg-[#F0F2F5] rounded-xl p-5">
                <h3 className="text-sm font-semibold text-[#1A1D21] mb-3 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-[#2E7D9A]" />
                  申请流程
                </h3>
                <div className="space-y-2">
                  {detail.applicationProcess.split("\n").map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[#2E7D9A] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[#6B7280]">{step.replace(/^\d+\.\s*/, "")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Points */}
          {detail.keyPoints && (
            <div className="px-6 lg:px-8 pb-6">
              <div className="bg-[#FEF3C7]/40 rounded-xl p-5 border border-[#D4823D]/15">
                <h3 className="text-sm font-semibold text-[#1A1D21] mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D4823D]" />
                  关键要点
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{detail.keyPoints}</p>
              </div>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="px-6 lg:px-8 pb-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F0F2F5] text-[#6B7280] text-xs">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-4 h-4 text-[#1B3A5C]" />
            <span className="text-xs text-[#6B7280]">基金总数</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">{stats?.total ?? 0}</p>
          <p className="text-[10px] text-[#6B7280] mt-1">涵盖股权/补助/国债</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-[#D4823D]" />
            <span className="text-xs text-[#6B7280]">热门项目</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">
            {stats?.byCategory?.find((c) => c.category === "基金类")?.count ?? 0}
          </p>
          <p className="text-[10px] text-[#6B7280] mt-1">基金类项目</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Landmark className="w-4 h-4 text-[#2E7D9A]" />
            <span className="text-xs text-[#6B7280]">专项资金</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">
            {stats?.byCategory?.find((c) => c.category === "专项资金类")?.count ?? 0}
          </p>
          <p className="text-[10px] text-[#6B7280] mt-1">补助/奖励类</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#4A8B5C]" />
            <span className="text-xs text-[#6B7280]">开放申报</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">
            {stats?.byStatus?.find((s) => s.status === "open")?.count ?? 0}
          </p>
          <p className="text-[10px] text-[#6B7280] mt-1">当前可申报</p>
        </div>
      </div>

      {/* Hot Funds Banner */}
      {hotFunds && hotFunds.length > 0 && (
        <div className="bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-[#FCD34D]" />
            <h2 className="text-lg font-semibold">热门推荐 · 重点关注</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {hotFunds.map((fund) => (
              <div
                key={fund.id}
                onClick={() => openDetail(fund.id)}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded bg-[#FCD34D] text-[#92400E] text-[10px] font-bold">
                    {levelNames[fund.sourceLevel]}
                  </span>
                  <span className="text-[10px] text-white/70">{fund.category}</span>
                </div>
                <h4 className="text-sm font-semibold mb-1">{fund.name}</h4>
                <p className="text-xs text-white/80">{fund.amountRange}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="搜索基金名称..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F0F2F5] rounded-xl text-sm text-[#1A1D21] placeholder:text-[#6B7280]/60 outline-none focus:ring-2 focus:ring-[#2E7D9A]/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-[#F0F2F5] rounded-xl text-sm text-[#1A1D21] outline-none border-0"
            >
              <option value="">全部类别</option>
              {Object.entries(categoryNames).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={sourceLevel}
              onChange={(e) => { setSourceLevel(e.target.value); setPage(1); }}
              className="px-3 py-2.5 bg-[#F0F2F5] rounded-xl text-sm text-[#1A1D21] outline-none border-0"
            >
              <option value="">全部层级</option>
              {Object.entries(levelNames).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Strategy Guide */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-base font-semibold text-[#1A1D21] mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#2E7D9A]" />
          申请策略指南
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#DBEAFE]/50 border border-[#2E7D9A]/10">
            <div className="w-8 h-8 rounded-lg bg-[#2E7D9A]/10 flex items-center justify-center mb-3">
              <Wallet className="w-4 h-4 text-[#2E7D9A]" />
            </div>
            <h4 className="text-sm font-semibold text-[#1A1D21] mb-2">基金类（股权/投资）</h4>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              <li>• 梳理院内优质项目，形成项目库</li>
              <li>• 主动对接基金，提交商业计划书</li>
              <li>• 通过基金评审获得股权投资</li>
              <li className="text-[#2E7D9A] font-medium">• 关键：技术可行性+市场前景+团队能力</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-[#FEF3C7]/50 border border-[#D4823D]/10">
            <div className="w-8 h-8 rounded-lg bg-[#D4823D]/10 flex items-center justify-center mb-3">
              <FileText className="w-4 h-4 text-[#D4823D]" />
            </div>
            <h4 className="text-sm font-semibold text-[#1A1D21] mb-2">专项资金类（补助/奖励）</h4>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              <li>• 定期关注部门项目申报通知</li>
              <li>• 按要求准备申报材料</li>
              <li>• 在规定时间内提交申报</li>
              <li className="text-[#D4823D] font-medium">• 关键：紧扣指南+创新性+社会效益</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl bg-[#DCFCE7]/50 border border-[#4A8B5C]/10">
            <div className="w-8 h-8 rounded-lg bg-[#4A8B5C]/10 flex items-center justify-center mb-3">
              <Landmark className="w-4 h-4 text-[#4A8B5C]" />
            </div>
            <h4 className="text-sm font-semibold text-[#1A1D21] mb-2">国债类（基础设施）</h4>
            <ul className="space-y-1.5 text-xs text-[#6B7280]">
              <li>• 将重大项目纳入重点项目库</li>
              <li>• 争取纳入国家/省级重点项目</li>
              <li>• 在申报窗口期逐级上报</li>
              <li className="text-[#4A8B5C] font-medium">• 关键：国家战略+技术成熟+实质开工</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Fund List */}
      <div className="space-y-3">
        {(listData?.items ?? []).map((fund) => {
          const st = statusNames[fund.status] ?? { label: fund.status, color: "#6B7280" };
          return (
            <div
              key={fund.id}
              onClick={() => openDetail(fund.id)}
              className="bg-white rounded-xl shadow-card p-5 hover:shadow-glow transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${levelColors[fund.sourceLevel]}15` }}
                >
                  <Wallet className="w-5 h-5" style={{ color: levelColors[fund.sourceLevel] }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span
                      className="px-2 py-0.5 rounded text-white text-[10px] font-medium"
                      style={{ backgroundColor: levelColors[fund.sourceLevel] }}
                    >
                      {levelNames[fund.sourceLevel]}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#F0F2F5] text-[#6B7280] text-[10px]">
                      {fund.category}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-white text-[10px] font-medium"
                      style={{ backgroundColor: st.color }}
                    >
                      {st.label}
                    </span>
                    {fund.isHot && (
                      <span className="px-2 py-0.5 rounded bg-[#FEF3C7] text-[#92400E] text-[10px] font-medium flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> 热门
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-[#1A1D21] mb-1 group-hover:text-[#2E7D9A] transition-colors">
                    {fund.name}
                  </h3>
                  <p className="text-xs text-[#6B7280] line-clamp-2 mb-2">
                    {fund.supportDirection}
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#6B7280]">
                    <span className="flex items-center gap-1">
                      <Wallet className="w-3 h-3" />
                      {fund.amountRange || "规模待定"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {fund.sourceOrg}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {fund.contactDept}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B7280] group-hover:text-[#2E7D9A] group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-lg bg-white shadow-card text-sm text-[#6B7280] disabled:opacity-40 hover:text-[#1B3A5C] transition-colors"
          >
            上一页
          </button>
          <span className="text-sm text-[#6B7280]">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-lg bg-white shadow-card text-sm text-[#6B7280] disabled:opacity-40 hover:text-[#1B3A5C] transition-colors"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
