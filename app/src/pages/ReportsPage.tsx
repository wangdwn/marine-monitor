import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  FileText,
  Search,
  Eye,
  Download,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Lock,
  Crown,
  Sparkles,
  CheckCircle,
  Database,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import LockedContent from "@/components/LockedContent";
import { useAuth } from "@/hooks/useAuth";

const reportTypeNames: Record<string, string> = {
  monthly: "月报",
  quarterly: "季报",
  special: "专题研究",
  weekly: "周报",
};

const trackNames: Record<string, string> = {
  marine_tourism: "海洋文旅",
  marine_biotech: "海洋生物医药",
  marine_engineering: "海洋工程",
  marine_energy: "海洋新能源",
  marine_fishery: "现代渔业",
};

export default function ReportsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [reportType, setReportType] = useState("");
  const [trackType, setTrackType] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [showVipModal, setShowVipModal] = useState(false);
  const { isAuthenticated, isAdmin, isVIP, canAccess } = useAuth();
  const [adminViewFull, setAdminViewFull] = useState(true);

  const { data: listData } = trpc.report.list.useQuery({
    page,
    limit: 10,
    search: search || undefined,
    reportType: reportType || undefined,
    trackType: trackType || undefined,
  });

  const { data: detail } = trpc.report.getById.useQuery(
    { id: selectedId! },
    { enabled: selectedId !== null }
  );

  const utils = trpc.useUtils();
  const incrementView = trpc.report.incrementView.useMutation({
    onSuccess: () => utils.report.getById.invalidate(),
  });

  const openDetail = (id: number) => {
    setSelectedId(id);
    incrementView.mutate({ id });
  };

  const totalPages = Math.ceil((listData?.total ?? 0) / 10);

  const isPaidReport = (price: unknown) => Number(price) > 0;

  if (selectedId && detail) {
    const painPts = detail.painPoints ? (typeof detail.painPoints === "string" ? JSON.parse(detail.painPoints) : detail.painPoints) as string[] : null;
    const oppPts = detail.opportunityPoints ? (typeof detail.opportunityPoints === "string" ? JSON.parse(detail.opportunityPoints) : detail.opportunityPoints) as string[] : null;
    const blkPts = detail.blockPoints ? (typeof detail.blockPoints === "string" ? JSON.parse(detail.blockPoints) : detail.blockPoints) as string[] : null;
    const tgtZones = detail.targetZones ? (typeof detail.targetZones === "string" ? JSON.parse(detail.targetZones) : detail.targetZones) as { name: string; level: number; value?: string }[] : null;
    const paid = isPaidReport(detail.price);
    // Preview mode: guests always see preview; paid reports show preview to non-VIP; admins can toggle
    const isPreviewMode = !isAuthenticated || (paid && (!isVIP || !adminViewFull));
    // Preview: show first 2 items + summary stats; full: show all
    const previewLimit = 2;
    const painPreview = isPreviewMode && painPts ? painPts.slice(0, previewLimit) : painPts;
    const oppPreview = isPreviewMode && oppPts ? oppPts.slice(0, previewLimit) : oppPts;
    const blkPreview = isPreviewMode && blkPts ? blkPts.slice(0, previewLimit) : blkPts;
    const zonesPreview = isPreviewMode && tgtZones ? tgtZones.slice(0, previewLimit) : tgtZones;
    const hasMorePain = isPreviewMode && painPts && painPts.length > previewLimit;
    const hasMoreOpp = isPreviewMode && oppPts && oppPts.length > previewLimit;
    const hasMoreBlk = isPreviewMode && blkPts && blkPts.length > previewLimit;
    const hasMoreZones = isPreviewMode && tgtZones && tgtZones.length > previewLimit;

    const detailContent = (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedId(null)}
          className="flex items-center gap-2 text-sm text-[#6B6B6B] hover:text-[#4A5D23] transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          返回列表
        </button>

        {/* VIP Subscription Modal */}
        {showVipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowVipModal(false)}>
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B3A5C] to-[#2E7D9A] flex items-center justify-center mx-auto mb-4">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#1A1D21] mb-2">开通专业版会员</h3>
                <p className="text-sm text-[#6B7280]">解锁全部专业报告，享受高质量商用数据分析</p>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0F2F5]">
                  <CheckCircle className="w-5 h-5 text-[#4A8B5C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21]">全部专项报告</p>
                    <p className="text-[10px] text-[#6B7280]">海洋文旅、工程、能源等6大赛道深度分析</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0F2F5]">
                  <CheckCircle className="w-5 h-5 text-[#4A8B5C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21]">实时数据更新</p>
                    <p className="text-[10px] text-[#6B7280]">基于52个真实数据源的自动采集与更新</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0F2F5]">
                  <CheckCircle className="w-5 h-5 text-[#4A8B5C] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A1D21]">商用授权</p>
                    <p className="text-[10px] text-[#6B7280]">报告可用于商业决策、投资分析等场景</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  ¥{detail?.price ?? '299'} 解锁本报告
                </button>
                <p className="text-[10px] text-center text-[#6B7280]">一次性购买，永久查看，可下载PDF</p>
                <button onClick={() => setShowVipModal(false)} className="w-full py-2.5 rounded-xl border border-[#E2E5EA] text-sm text-[#6B7280] hover:bg-[#F0F2F5] transition-colors">
                  暂不开通，继续浏览
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
          {/* Cover Image */}
          {detail.coverImage && (
            <div className="relative w-full h-56 lg:h-72 overflow-hidden">
              <img src={detail.coverImage} alt={detail.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    {reportTypeNames[detail.reportType] ?? detail.reportType}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-medium">
                    {trackNames[detail.trackType] ?? detail.trackType}
                  </span>
                  {paid ? (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#D4823D] to-[#D4823D]/80 text-white text-xs font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />专业版 ¥{detail.price}
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-[#4A8B5C]/80 text-white text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />免费
                    </span>
                  )}
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  {detail.title}
                </h1>
              </div>
            </div>
          )}

          {/* Header (no cover) */}
          {!detail.coverImage && (
            <div className="p-8 lg:p-10 border-b border-[rgba(45,45,45,0.1)]">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#A8B5A0]/15 text-[#4A5D23] text-xs font-medium">
                  {reportTypeNames[detail.reportType] ?? detail.reportType}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] text-xs font-medium">
                  {trackNames[detail.trackType] ?? detail.trackType}
                </span>
                {paid ? (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] text-white text-xs font-medium flex items-center gap-1">
                    <Crown className="w-3 h-3" />专业版 ¥{detail.price}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#4A8B5C]/10 text-[#4A8B5C] text-xs font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />免费
                  </span>
                )}
              </div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-[#2D2D2D] mb-4">
                {detail.title}
              </h1>
              <p className="text-[#6B6B6B] leading-relaxed">{detail.summary}</p>
              <div className="flex items-center gap-6 mt-6 text-xs text-[#6B6B6B]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {detail.viewCount}次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {detail.downloadCount}次下载
                </span>
                {paid && (
                  <span className="flex items-center gap-1 text-[#D4823D]">
                    <Lock className="w-3.5 h-3.5" />
                    专业版内容
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Summary bar (when cover shown) */}
          {detail.coverImage && (
            <div className="px-8 lg:px-10 pt-6 pb-2">
              <p className="text-[#6B6B6B] leading-relaxed text-sm">{detail.summary}</p>
              <div className="flex items-center gap-6 mt-4 text-xs text-[#6B6B6B]">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {detail.viewCount}次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" />
                  {detail.downloadCount}次下载
                </span>
                {detail.qualityScore && (
                  <span className="flex items-center gap-1 text-[#D4823D]">
                    <Bookmark className="w-3.5 h-3.5" />
                    质量分 {detail.qualityScore}
                  </span>
                )}
                {paid && (
                  <span className="flex items-center gap-1 text-[#D4823D]">
                    <Lock className="w-3.5 h-3.5" />
                    专业版内容
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Admin View Toggle */}
          {isAdmin && paid && (
            <div className="mx-8 mt-4 lg:mx-10 p-3 rounded-xl bg-[#FEF3C7] border border-[#D4823D]/20 flex items-center justify-between">
              <span className="text-xs font-medium text-[#92400E]">管理员模式：您可查看预览版和正式版</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAdminViewFull(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${!adminViewFull ? 'bg-[#D4823D] text-white' : 'bg-white text-[#92400E]'}`}
                >
                  预览版
                </button>
                <button
                  onClick={() => setAdminViewFull(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${adminViewFull ? 'bg-[#4A8B5C] text-white' : 'bg-white text-[#92400E]'}`}
                >
                  正式版
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8 lg:p-10">
            {/* HTML Content - preview mode shows first 30% for paid reports */}
            {detail.contentHtml && (
              <div className="mb-8">
                {isPreviewMode ? (
                  <div className="relative">
                    {/* Show executive summary + first sections */}
                    <div
                      className="report-html-content"
                      dangerouslySetInnerHTML={{ __html: detail.contentHtml.split('<h2>')[0] + '<h2>' + '<h2>'.join(detail.contentHtml.split('<h2>').slice(1, 4)) }}
                    />
                    {/* Preview lock overlay */}
                    <div className="mt-6 relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10" />
                      <div className="relative z-20 text-center py-8">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1B3A5C] to-[#2E7D9A] flex items-center justify-center mx-auto mb-4">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-lg font-semibold text-[#1A1D21] mb-2">开通专业版，解锁完整深度分析</h4>
                        <p className="text-sm text-[#6B7280] mb-1">本报告共 {detail.contentHtml.split('<h2>').length - 1} 个章节，已免费阅读前 3 章</p>
                        <p className="text-sm text-[#6B7280] mb-4">包含完整数学模型、数据对标、堵点诊断和投资策略</p>
                        <button onClick={() => setShowVipModal(true)} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] text-white text-sm font-medium hover:opacity-90 transition-opacity inline-flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          ¥{detail.price} 解锁完整报告
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className="report-html-content"
                    dangerouslySetInnerHTML={{ __html: detail.contentHtml }}
                  />
                )}
              </div>
            )}
            {painPreview && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#2D2D2D]">痛点分析</h2>
                  {paid && <span className="text-[10px] text-[#D4823D] bg-[#D4823D]/10 px-2 py-0.5 rounded-full">预览版</span>}
                </div>
                <div className="bg-[#F4F1EA] rounded-2xl p-6">
                  <ul className="space-y-2">
                    {painPreview.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                        <span className="w-5 h-5 rounded-full bg-[#C45B4A]/10 text-[#C45B4A] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {hasMorePain && (
                    <div className="mt-4 pt-4 border-t border-dashed border-[#E2E5EA]">
                      <button onClick={() => setShowVipModal(true)} className="flex items-center gap-2 text-sm text-[#1B3A5C] hover:text-[#2E7D9A] transition-colors font-medium">
                        <Lock className="w-4 h-4" />
                        开通专业版查看全部 {painPts.length} 项痛点分析
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {oppPreview && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#2D2D2D]">机会识别</h2>
                  {paid && <span className="text-[10px] text-[#D4823D] bg-[#D4823D]/10 px-2 py-0.5 rounded-full">预览版</span>}
                </div>
                <div className="bg-[#F4F1EA] rounded-2xl p-6">
                  <ul className="space-y-2">
                    {oppPreview.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                        <span className="w-5 h-5 rounded-full bg-[#4A5D23]/10 text-[#4A5D23] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {hasMoreOpp && (
                    <div className="mt-4 pt-4 border-t border-dashed border-[#E2E5EA]">
                      <button onClick={() => setShowVipModal(true)} className="flex items-center gap-2 text-sm text-[#1B3A5C] hover:text-[#2E7D9A] transition-colors font-medium">
                        <Lock className="w-4 h-4" />
                        开通专业版查看全部 {oppPts.length} 项机会识别
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {zonesPreview && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#2D2D2D]">靶区推荐</h2>
                  {paid && <span className="text-[10px] text-[#D4823D] bg-[#D4823D]/10 px-2 py-0.5 rounded-full">预览版</span>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {zonesPreview.map((z: { name: string; level: number }, i: number) => (
                    <div key={i} className="bg-white border border-[rgba(45,45,45,0.1)] rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-[#2D2D2D]">{z.name}</h4>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <div
                              key={j}
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: j < z.level ? "#A8B5A0" : "#E8E4DB" }}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#6B6B6B]">
                        价值等级: {z.level}/5
                      </p>
                    </div>
                  ))}
                </div>
                {hasMoreZones && (
                  <div className="mt-4">
                    <button onClick={() => setShowVipModal(true)} className="flex items-center gap-2 text-sm text-[#1B3A5C] hover:text-[#2E7D9A] transition-colors font-medium">
                      <Lock className="w-4 h-4" />
                      开通专业版查看全部 {tgtZones.length} 个靶区推荐
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Block Points (堵点分析) */}
            {blkPreview && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#D4823D]" />
                    <h2 className="text-lg font-semibold text-[#2D2D2D]">核心堵点诊断</h2>
                  </div>
                  {isPreviewMode && <span className="text-[10px] text-[#D4823D] bg-[#D4823D]/10 px-2 py-0.5 rounded-full">预览版</span>}
                  {!isPreviewMode && paid && <span className="text-[10px] text-[#4A8B5C] bg-[#4A8B5C]/10 px-2 py-0.5 rounded-full">完整版</span>}
                </div>
                <div className="bg-[#FEF3C7]/50 rounded-2xl p-6 border border-[#D4823D]/10">
                  <ul className="space-y-3">
                    {blkPreview.map((p: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[#6B6B6B]">
                        <span className="w-6 h-6 rounded-lg bg-[#D4823D]/15 text-[#D4823D] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          堵
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  {hasMoreBlk && (
                    <div className="mt-4 pt-4 border-t border-dashed border-[#D4823D]/20">
                      <button onClick={() => setShowVipModal(true)} className="flex items-center gap-2 text-sm text-[#D4823D] hover:text-[#92400E] transition-colors font-medium">
                        <Lock className="w-4 h-4" />
                        开通专业版查看全部 {blkPts.length} 个堵点诊断
                      </button>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Data Sources */}
            {detail.dataSources && (
              <section className="mt-8 pt-6 border-t border-[#E2E5EA]">
                <h3 className="text-sm font-semibold text-[#1A1D21] mb-4">数据来源</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(typeof detail.dataSources === "string" ? JSON.parse(detail.dataSources) : detail.dataSources).map((s: { name: string; type: string; reliability: string }, i: number) => (
                    <div key={i} className="flex items-center gap-2 p-2.5 rounded-lg bg-[#F0F2F5] text-xs">
                      <Database className="w-3.5 h-3.5 text-[#2E7D9A] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-[#1A1D21] truncate">{s.name}</p>
                        <p className="text-[#6B7280]">{s.type} · {s.reliability}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* VIP CTA Banner for paid reports */}
            {paid && (
              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-[#1B3A5C]/5 to-[#2E7D9A]/5 border border-[#1B3A5C]/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1B3A5C] to-[#2E7D9A] flex items-center justify-center flex-shrink-0">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-[#1A1D21] mb-1">专业版完整报告</h4>
                    <p className="text-xs text-[#6B7280]">本报告为专业版付费内容，包含完整数据分析、痛点深度解读、机会识别和靶区推荐。开通专业版会员可解锁全部内容。</p>
                  </div>
                  <button onClick={() => setShowVipModal(true)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5" />
                    解锁完整版
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
    return isAuthenticated ? detailContent : (
      <LockedContent level="user" label="报告详情" sublabel="登录后可查看完整报告">
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
              placeholder="搜索报告..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-11 pr-4 py-3 bg-[#F4F1EA] rounded-2xl text-sm text-[#2D2D2D] placeholder:text-[#6B6B6B]/60 outline-none focus:ring-2 focus:ring-[#A8B5A0]/30 transition-all"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={reportType}
              onChange={(e) => { setReportType(e.target.value); setPage(1); }}
              className="px-4 py-3 bg-[#F4F1EA] rounded-2xl text-sm text-[#2D2D2D] outline-none border-0"
            >
              <option value="">全部类型</option>
              {Object.entries(reportTypeNames).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <select
              value={trackType}
              onChange={(e) => { setTrackType(e.target.value); setPage(1); }}
              className="px-4 py-3 bg-[#F4F1EA] rounded-2xl text-sm text-[#2D2D2D] outline-none border-0"
            >
              <option value="">全部赛道</option>
              {Object.entries(trackNames).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Report List */}
      <div className="space-y-4">
        {(listData?.items ?? []).map((report) => (
          <div
            key={report.id}
            className="bg-white rounded-3xl shadow-soft overflow-hidden hover:shadow-glow transition-all duration-300 cursor-pointer group"
            onClick={() => openDetail(report.id)}
          >
            {/* Cover image banner */}
            {report.coverImage && (
              <div className="relative w-full h-40 overflow-hidden">
                <img src={report.coverImage} alt={report.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {Number(report.price) > 0 ? (
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D4823D] to-[#D4823D]/80 text-white text-xs font-medium flex items-center gap-1">
                      <Crown className="w-3 h-3" />¥{report.price}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-[#4A8B5C]/80 text-white text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />免费
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start gap-5">
                {!report.coverImage && (
                  <div className="w-14 h-14 rounded-2xl bg-[#A8B5A0]/15 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-[#4A5D23]" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#A8B5A0]/10 text-[#4A5D23] text-xs font-medium">
                      {reportTypeNames[report.reportType] ?? report.reportType}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F4F1EA] text-[#6B6B6B] text-xs">
                      {trackNames[report.trackType] ?? report.trackType}
                    </span>
                    {!report.coverImage && Number(report.price) > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#C45B4A]/10 text-[#C45B4A] text-xs font-medium">
                        ¥{report.price}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-[#2D2D2D] mb-2 group-hover:text-[#4A5D23] transition-colors">
                    {report.title}
                  </h3>
                  {isAuthenticated ? (
                    <p className="text-sm text-[#6B6B6B] line-clamp-2 mb-3">{report.summary}</p>
                  ) : (
                    <div className="mb-3">
                      <p className="text-sm text-[#6B6B6B] line-clamp-2 blur-[2px] opacity-60">{String(report.summary ?? "").slice(0, 100)}</p>
                      <p className="text-xs text-[#2E7D9A] mt-1 flex items-center gap-1">
                        <Lock className="w-3 h-3" />登录后可查看完整摘要
                      </p>
                    </div>
                  )}
                  {/* Key stats bar */}
                  <div className="flex items-center gap-3 mb-3">
                    {report.qualityScore && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FEF3C7] text-[#92400E] text-[10px] font-medium">
                        <BarChart3 className="w-3 h-3" />
                        质量分 {report.qualityScore}
                      </span>
                    )}
                    {Number(report.price) > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#DBEAFE] text-[#1E40AF] text-[10px] font-medium">
                        <Eye className="w-3 h-3" />
                        免费预览3章
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#6B6B6B]">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {report.viewCount}次浏览
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      {report.downloadCount}次下载
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-xl hover:bg-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors ${
                page === i + 1
                  ? "bg-[#4A5D23] text-white"
                  : "hover:bg-white text-[#6B6B6B]"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 rounded-xl hover:bg-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
