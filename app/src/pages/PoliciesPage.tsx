import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  ScrollText,
  Search,
  ChevronLeft,
  Building2,
  Calendar,
  BookOpen,
  ExternalLink,
  Lock,
} from "lucide-react";
import LockedContent from "@/components/LockedContent";
import { useAuth } from "@/hooks/useAuth";

const levelNames: Record<string, string> = {
  national: "国家级",
  provincial: "省级",
  city: "市级",
  district: "区级",
};

const levelColors: Record<string, string> = {
  national: "#C45B4A",
  provincial: "#4A5D23",
  city: "#A8B5A0",
  district: "#7B9E6B",
};

export default function PoliciesPage() {
  const { isAuthenticated } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: listData } = trpc.policy.list.useQuery({
    page,
    limit: 10,
    search: search || undefined,
    level: level || undefined,
  });

  const { data: detail } = trpc.policy.getById.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );

  if (selectedId && detail) {
    const kp = detail.keyPoints ? (typeof detail.keyPoints === "string" ? JSON.parse(detail.keyPoints) : detail.keyPoints) as string[] : null;
    const detailContent = (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#4A5D23] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          返回政策列表
        </button>

        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className="p-8 lg:p-10 border-b border-[rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: levelColors[detail.policyLevel] ?? "#A8B5A0" }}
              >
                {levelNames[detail.policyLevel] ?? detail.policyLevel}
              </span>
              {detail.region && (
                <span className="px-3 py-1 rounded-full bg-[#F4F1EA] text-[#6B6B6B] text-xs">
                  {detail.region}
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-[#2D2D2D] mb-4">
              {detail.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-[#6B6B6B]">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {detail.issueOrg}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                发布: {detail.issueDate ? String(detail.issueDate) : "未知"}
              </span>
              {detail.docNumber && (
                <span className="font-mono text-xs">{detail.docNumber}</span>
              )}
            </div>
          </div>

          <div className="p-8 lg:p-10 space-y-8">
            {/* Summary */}
            {detail.contentSummary && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-[#4A5D23]" />
                  <h2 className="text-lg font-semibold text-[#2D2D2D]">政策摘要</h2>
                </div>
                <div className="bg-[#F4F1EA] rounded-2xl p-6">
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {detail.contentSummary}
                  </p>
                </div>
              </section>
            )}

            {/* Key Points */}
            {kp && (
              <section>
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">关键条款</h2>
                <div className="space-y-3">
                  {kp.map((p: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-[#F4F1EA] rounded-2xl"
                    >
                      <span className="w-6 h-6 rounded-full bg-[#A8B5A0]/20 text-[#4A5D23] flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-sm text-[#2D2D2D]">{p}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Impact Analysis */}
            {detail.impactAnalysis && (
              <section>
                <h2 className="text-lg font-semibold text-[#2D2D2D] mb-4">影响分析</h2>
                <div className="border border-[#A8B5A0]/30 rounded-2xl p-6">
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {detail.impactAnalysis}
                  </p>
                </div>
              </section>
            )}

            {/* Source Link */}
            {detail.sourceUrl && (
              <div className="pt-4 border-t border-[rgba(45,45,45,0.1)]">
                <a
                  href={detail.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-[#4A5D23] hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  查看原文链接
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    return isAuthenticated ? detailContent : (
      <LockedContent level="user" label="政策详情" sublabel="登录后可查看完整政策文件">
        {detailContent}
      </LockedContent>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-3xl shadow-soft p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6B6B]" />
            <input
              type="text"
              placeholder="搜索政策..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-[#F4F1EA] rounded-2xl text-sm text-[#2D2D2D] placeholder:text-[#6B6B6B]/60 outline-none focus:ring-2 focus:ring-[#A8B5A0]/30 transition-all"
            />
          </div>
          <select
            value={level}
            onChange={(e) => { setLevel(e.target.value); setPage(1); }}
            className="px-4 py-3 bg-[#F4F1EA] rounded-2xl text-sm text-[#2D2D2D] outline-none border-0"
          >
            <option value="">全部层级</option>
            {Object.entries(levelNames).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Policy List */}
      <div className="space-y-3">
        {(listData?.items ?? []).map((policy) => (
          <div
            key={policy.id}
            className="bg-white rounded-3xl shadow-soft p-6 hover:shadow-glow transition-all duration-300 cursor-pointer"
            onClick={() => setSelectedId(policy.id)}
          >
            <div className="flex items-start gap-5">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: `${levelColors[policy.policyLevel] ?? "#A8B5A0"}15`,
                }}
              >
                <ScrollText
                  className="w-5 h-5"
                  style={{ color: levelColors[policy.policyLevel] ?? "#A8B5A0" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: levelColors[policy.policyLevel] ?? "#A8B5A0" }}
                  >
                    {levelNames[policy.policyLevel] ?? policy.policyLevel}
                  </span>
                  {policy.region && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F1EA] text-[#6B6B6B] text-xs">
                      {policy.region}
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-[#2D2D2D] mb-1">
                  {policy.title}
                </h3>
                {isAuthenticated ? (
                  <p className="text-sm text-[#6B6B6B] line-clamp-2 mb-2">{policy.contentSummary}</p>
                ) : (
                  <p className="text-xs text-[#6B6B6B] line-clamp-2 mb-2 opacity-60">
                    {String(policy.contentSummary ?? "").slice(0, 60)}...
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{policy.issueOrg}</span>
                  <span>{policy.issueDate ? String(policy.issueDate) : ""}</span>
                  {!isAuthenticated && (
                    <span className="flex items-center gap-1 text-[#2E7D9A]"><Lock className="w-3 h-3" />登录查看详情</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
