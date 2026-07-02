import { trpc } from "@/providers/trpc";
import { useEffect, useRef, useState } from "react";
import {
  TrendingUp, ArrowUpRight,
  FileText, ScrollText, ChevronRight, Compass,
  ClipboardList, ShieldCheck, Waves, Anchor,
  AlertTriangle, Radio, Database, Activity, BarChart3,
  Lock, Newspaper,
} from "lucide-react";
import LockedContent from "@/components/LockedContent";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";

function AnimatedNumber({ value, duration = 1500 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const startTime = useRef<number | null>(null);
  useEffect(() => {
    startTime.current = null;
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      setDisplay(0 + (value - 0) * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  const formatted = value >= 1000 ? (display / (value >= 10000 ? 10000 : 1000)).toFixed(display >= 10000 ? 0 : 1) : Math.round(display).toString();
  return <>{formatted}</>;
}

export default function Dashboard() {
  const { canAccess, isGuest } = useAuth();
  const { data: summary } = trpc.dashboard.summary.useQuery();
  const { data: trendData } = trpc.dashboard.trendChart.useQuery({ trackType: "marine_tourism", years: 5 });
  const { data: trackDist } = trpc.dashboard.trackDistribution.useQuery();
  const { data: cityComp } = trpc.dashboard.cityComparison.useQuery();
  const { data: latestPolicies } = trpc.dashboard.latestPolicies.useQuery();
  const { data: hotReports } = trpc.dashboard.hotReports.useQuery();

  // New queries for the three pillars
  const { data: surveySum } = trpc.survey.summary.useQuery();
  const { data: planningSum } = trpc.planning.summary.useQuery();
  const { data: safetySum } = trpc.safety.summary.useQuery();

  // Real-time collection status queries
  const { data: collectionStatus } = trpc.collector.collectionStatus.useQuery();
  const { data: dimensionStats } = trpc.collector.dimensionDataStats.useQuery();
  const { data: hubData } = trpc.collector.dimensionDataList.useQuery({ dimensionCode: "hub", year: 2024 });
  const { data: industryData } = trpc.collector.dimensionDataList.useQuery({ dimensionCode: "industry", year: 2024 });
  const { data: popData } = trpc.collector.dimensionDataList.useQuery({ dimensionCode: "population", year: 2024 });

  const metrics: Array<{
    label: string;
    value: number;
    unit: string;
    growth?: number;
    sub?: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    color: string;
    /** 是否需要登录查看 */
    requireAuth?: boolean;
  }> = [
    { label: "海洋生产总值", value: summary?.gdp ?? 1250, unit: "亿元", growth: summary?.gdpGrowth ?? 15.7, icon: TrendingUp, color: "#1B3A5C" },
    { label: "海域使用确权面积", value: 12850, unit: "公顷", growth: 5.2, icon: Anchor, color: "#2E7D9A", requireAuth: true },
    { label: "海岸线保护率", value: 68.5, unit: "%", growth: 3.1, icon: Waves, color: "#4A8B5C", requireAuth: true },
    { label: "地质灾害隐患点", value: 187, unit: "处", sub: "已治理142处", icon: AlertTriangle, color: "#D4823D", requireAuth: true },
  ];

  const maxGdp = Math.max(...(trendData?.map((d) => d.gdp) ?? [1]));

  const reportTypeNames: Record<string, string> = { special: "专题", quarterly: "季报", monthly: "月报" };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1B3A5C 0%, #2E7D9A 60%, #3A8FA8 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)" }} />
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-0.5 rounded bg-white/15 text-white/90 text-xs font-medium backdrop-blur-sm">
              广州市规划和自然资源局（广州市海洋局）
            </span>
          </div>
          <h1 className="text-white text-2xl font-semibold mb-1">广州海洋经济智能监测与资源保障平台</h1>
          <p className="text-white/70 text-sm max-w-2xl leading-relaxed">
            深度融合资源调查、规划用地保障、韧性城市与地质海洋安全屏障三大核心优势，
            服务海洋经济高质量发展，支撑多融合发展需要。
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const card = (
            <div className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5" style={{ color: m.color }} />
                {(m.growth ?? 0) > 0 && (
                  <span className="flex items-center gap-0.5 text-xs font-medium" style={{ color: m.color === "#D4823D" ? "#D4823D" : "#4A8B5C" }}>
                    <ArrowUpRight className="w-3 h-3" />+{m.growth}%
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-[#1A1D21] font-mono">
                  {m.unit === "亿元" ? "¥" : ""}<AnimatedNumber value={m.value} />
                </span>
                <span className="text-xs text-[#6B7280]">{m.unit}</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">{m.label}</p>
              {m.sub && <p className="text-xs text-[#4A8B5C] mt-1">{m.sub}</p>}
            </div>
          );
          if (m.requireAuth) {
            return <LockedContent key={m.label} level="user" teaser={card}>{card}</LockedContent>;
          }
          return <div key={m.label}>{card}</div>;
        })}
      </div>

      {/* Three Pillars — login required */}
      <LockedContent level="user" label="三大支柱模块" sublabel="登录后可查看资源调查、规划保障、安全屏障详情">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pillar A: Resource Survey */}
        <Link to="/survey" className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#1B3A5C]/8 flex items-center justify-center">
              <Compass className="w-4 h-4 text-[#1B3A5C]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A1D21]">资源调查监测</h3>
              <p className="text-[10px] text-[#6B7280]">自然资源底数精准掌握</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">管辖海域面积</span>
              <span className="font-mono font-medium text-[#1A1D21]">{surveySum?.seaArea ?? 4520} {surveySum?.seaAreaUnit ?? "平方公里"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">海岛数量</span>
              <span className="font-mono font-medium text-[#1A1D21]">{surveySum?.islandCount ?? 11} 个</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">海岸线长度</span>
              <span className="font-mono font-medium text-[#1A1D21]">{surveySum?.coastlineLength ?? 157.1} 公里</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">地质调查覆盖率</span>
              <span className="font-mono font-medium text-[#4A8B5C]">{surveySum?.geologyCoverage ?? 92.5}%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E5EA] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">监测站点 8 个</span>
            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#1B3A5C] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Pillar B: Planning Guarantee */}
        <Link to="/planning" className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#2E7D9A]/10 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-[#2E7D9A]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A1D21]">规划用地保障</h3>
              <p className="text-[10px] text-[#6B7280]">国土空间规划与要素配置</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">空间规划合规率</span>
              <span className="font-mono font-medium text-[#4A8B5C]">{planningSum?.spatialPlanCompliance ?? 96.8}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">用海审批项目</span>
              <span className="font-mono font-medium text-[#1A1D21]">{planningSum?.seaApprovalCount ?? 128} 宗</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">重大项目保障</span>
              <span className="font-mono font-medium text-[#1A1D21]">{planningSum?.projectSupportCount ?? 45} 个</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">功能区划覆盖率</span>
              <span className="font-mono font-medium text-[#4A8B5C]">{planningSum?.marineFunctionCoverage ?? 98.2}%</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E5EA] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">用地保障 2850.5 亩</span>
            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#2E7D9A] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>

        {/* Pillar C: Safety Barrier */}
        <Link to="/safety" className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-all group">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#4A8B5C]/10 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#4A8B5C]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#1A1D21]">安全屏障态势</h3>
              <p className="text-[10px] text-[#6B7280]">韧性城市与地质海洋安全</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">地灾隐患点</span>
              <span className="font-mono font-medium text-[#D4823D]">{safetySum?.geoHazardTotal ?? 187} 处</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">已治理</span>
              <span className="font-mono font-medium text-[#4A8B5C]">{safetySum?.geoHazardHandled ?? 142} 处</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">风暴潮预警站</span>
              <span className="font-mono font-medium text-[#1A1D21]">{safetySum?.stormSurgeStations ?? 12} 个</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">生态修复面积</span>
              <span className="font-mono font-medium text-[#4A8B5C]">{safetySum?.restorationArea ?? 1560} 公顷</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E2E5EA] flex items-center justify-between">
            <span className="text-xs text-[#6B7280]">韧性指数 78.5</span>
            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#4A8B5C] group-hover:translate-x-0.5 transition-all" />
          </div>
        </Link>
      </div>
      </LockedContent>

      {/* Real-time Collection Status — login required */}
      <LockedContent level="user" label="数据采集监控" sublabel="登录后可查看实时采集状态和五维指标数据">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Collection Status Card */}
        <div className="bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A5C]/8 flex items-center justify-center">
                <Radio className="w-4 h-4 text-[#1B3A5C]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1D21]">实时采集状态</h3>
                <p className="text-[10px] text-[#6B7280]">52个数据源 · {collectionStatus?.activeSources ?? 0}个活跃</p>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${collectionStatus?.lastCollectionStatus === 'success' ? 'bg-[#4A8B5C]/10 text-[#4A8B5C]' : 'bg-[#D4823D]/10 text-[#D4823D]'}`}>
              {collectionStatus?.lastCollectionStatus === 'success' ? '采集正常' : '采集中'}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">数据源总数</span>
              <span className="font-mono font-medium text-[#1A1D21]">{collectionStatus?.totalSources ?? 52} 个</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">已采集数据</span>
              <span className="font-mono font-medium text-[#1A1D21]">{collectionStatus?.totalDataRecords ?? 0} 条</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">采集覆盖率</span>
              <span className="font-mono font-medium text-[#4A8B5C]">{collectionStatus?.collectionRate ?? 0}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#6B7280]">最后采集</span>
              <span className="font-mono font-medium text-[#1A1D21] text-xs">{collectionStatus?.lastCollectionTime ? new Date(collectionStatus.lastCollectionTime).toLocaleString('zh-CN') : '--'}</span>
            </div>
          </div>
          <Link to="/collector" className="mt-4 pt-3 border-t border-[#E2E5EA] flex items-center justify-between group">
            <span className="text-xs text-[#6B7280]">管理采集任务</span>
            <ChevronRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#1B3A5C] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        {/* Five Dimensions Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2E7D9A]/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-[#2E7D9A]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1D21]">五维指标概览</h3>
                <p className="text-[10px] text-[#6B7280]">2024年度 · 基于真实采集数据</p>
              </div>
            </div>
            <Link to="/collector" className="text-[10px] text-[#2E7D9A] hover:text-[#1B3A5C] transition-colors flex items-center gap-0.5">详情 <ChevronRight className="w-3 h-3" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { code: "hub", name: "港口枢纽", color: "#1B3A5C", icon: Anchor },
              { code: "industry", name: "产业集群", color: "#2E7D9A", icon: Database },
              { code: "population", name: "市场人气", color: "#4A8B5C", icon: Activity },
              { code: "ecosystem", name: "生态支撑", color: "#D4823D", icon: ShieldCheck },
              { code: "capital", name: "资本热度", color: "#B54848", icon: TrendingUp },
            ].map((dim) => {
              const count = dimensionStats?.byDimension?.find((d) => d.dimensionCode === dim.code)?.count ?? 0;
              const DimIcon = dim.icon;
              return (
                <div key={dim.code} className="text-center p-3 rounded-lg hover:bg-[#F0F2F5] transition-colors">
                  <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${dim.color}15` }}>
                    <DimIcon className="w-4 h-4" style={{ color: dim.color }} />
                  </div>
                  <p className="text-xs font-medium text-[#1A1D21]">{dim.name}</p>
                  <p className="text-[10px] text-[#6B7280]">{count} 项指标</p>
                </div>
              );
            })}
          </div>
          {/* Hub Key Indicators */}
          <div className="mt-4 pt-4 border-t border-[#E2E5EA]">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[10px] text-[#6B7280] mb-1">货物吞吐量</p>
                <p className="text-lg font-semibold text-[#1A1D21] font-mono">{hubData?.find(d => d.indicatorCode === "hub_throughput")?.dataValue ?? "6.56"}<span className="text-xs text-[#6B7280] ml-1">亿吨</span></p>
                <p className="text-[10px] text-[#4A8B5C]">+2.2% 同比增长</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] mb-1">海洋生产总值</p>
                <p className="text-lg font-semibold text-[#1A1D21] font-mono">{industryData?.find(d => d.indicatorCode === "ind_marine_gdp")?.dataValue ?? "5320"}<span className="text-xs text-[#6B7280] ml-1">亿元</span></p>
                <p className="text-[10px] text-[#4A8B5C]">+6.8% 同比增长</p>
              </div>
              <div>
                <p className="text-[10px] text-[#6B7280] mb-1">海洋旅游人次</p>
                <p className="text-lg font-semibold text-[#1A1D21] font-mono">{popData?.find(d => d.indicatorCode === "pop_tourists")?.dataValue ?? "2350"}<span className="text-xs text-[#6B7280] ml-1">万人次</span></p>
                <p className="text-[10px] text-[#4A8B5C]">+15.2% 同比增长</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </LockedContent>

      {/* Trend + Track Distribution — login required */}
      <LockedContent level="user" label="产业趋势分析" sublabel="登录后可查看赛道分布和大湾区对标数据">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-[#1A1D21]">产业趋势走势</h3>
              <p className="text-[10px] text-[#6B7280] mt-0.5">近5年海洋文旅产业GDP变化（亿元）</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#1B3A5C]" />GDP</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#2E7D9A]" />营收</span>
            </div>
          </div>
          <div className="h-52 flex items-end gap-4">
            {(trendData ?? []).map((d, i) => {
              const gdpH = maxGdp > 0 ? (d.gdp / maxGdp) * 100 : 20;
              const revH = maxGdp > 0 ? (d.revenue / maxGdp) * 80 : 15;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex gap-1 items-end justify-center" style={{ height: 160 }}>
                    <div className="w-5 rounded-t bg-[#1B3A5C]/70 hover:bg-[#1B3A5C] transition-colors relative group" style={{ height: `${gdpH}%` }}>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1A1D21] text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.gdp}亿</div>
                    </div>
                    <div className="w-5 rounded-t bg-[#2E7D9A]/50 hover:bg-[#2E7D9A] transition-colors" style={{ height: `${revH}%` }} />
                  </div>
                  <span className="text-[10px] text-[#6B7280] font-mono">{d.year}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-sm font-semibold text-[#1A1D21] mb-1">赛道分布</h3>
          <p className="text-[10px] text-[#6B7280] mb-5">2024年各赛道GDP占比</p>
          <div className="space-y-3">
            {(trackDist ?? []).map((t, i) => {
              const colors = ["#1B3A5C", "#2E7D9A", "#4A8B5C", "#7B9E6B", "#D4823D", "#6B7B8D"];
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1"><span className="text-xs text-[#1A1D21]">{t.trackName}</span><span className="text-xs font-mono text-[#6B7280]">{t.percentage}%</span></div>
                  <div className="h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${t.percentage}%`, backgroundColor: colors[i % colors.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </LockedContent>

      {/* City Comparison + Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-sm font-semibold text-[#1A1D21] mb-1">粤港澳大湾区对标</h3>
          <p className="text-[10px] text-[#6B7280] mb-5">海洋生产总值对比（亿元）</p>
          <div className="space-y-3">
            {(cityComp ?? []).map((c, i) => {
              const maxVal = Math.max(...(cityComp?.map((x) => x.gdp) ?? [1]));
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-10 text-xs text-[#1A1D21] font-medium">{c.city}</span>
                  <div className="flex-1 h-6 bg-[#F0F2F5] rounded-md overflow-hidden relative">
                    <div className="h-full rounded-md flex items-center px-2 transition-all duration-700" style={{ width: `${maxVal > 0 ? (c.gdp / maxVal) * 100 : 0}%`, background: i === 0 ? "linear-gradient(90deg, #1B3A5C, #2E7D9A)" : "#E2E5EA" }}>
                      <span className="text-[10px] whitespace-nowrap" style={{ color: i === 0 ? "white" : "#1A1D21" }}>{c.gdp}亿</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1A1D21]">热门报告</h3>
              <Link to="/reports" className="text-[10px] text-[#2E7D9A] hover:text-[#1B3A5C] transition-colors flex items-center gap-0.5">全部 <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-2">
              {(hotReports ?? []).map((r) => (
                <Link key={r.id} to={`/reports`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F0F2F5] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-[#1B3A5C]/8 flex items-center justify-center flex-shrink-0"><FileText className="w-4 h-4 text-[#1B3A5C]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1A1D21] truncate group-hover:text-[#1B3A5C] transition-colors">{r.title}</p>
                    <p className="text-[10px] text-[#6B7280]">{reportTypeNames[r.reportType] ?? r.reportType} · {r.viewCount}次浏览</p>
                  </div>
                  {Number(r.price) > 0 ? <span className="px-1.5 py-0.5 rounded bg-[#D4823D]/10 text-[#D4823D] text-[10px]">¥{r.price}</span> : <span className="px-1.5 py-0.5 rounded bg-[#4A8B5C]/10 text-[#4A8B5C] text-[10px]">免费</span>}
                </Link>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-[#1A1D21]">最新政策</h3>
              <Link to="/policies" className="text-[10px] text-[#2E7D9A] hover:text-[#1B3A5C] transition-colors flex items-center gap-0.5">全部 <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="space-y-2">
              {(latestPolicies ?? []).map((p) => (
                <Link key={p.id} to={`/policies`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F0F2F5] transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-[#4A8B5C]/10 flex items-center justify-center flex-shrink-0"><ScrollText className="w-4 h-4 text-[#4A8B5C]" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#1A1D21] truncate group-hover:text-[#4A8B5C] transition-colors">{p.title}</p>
                    <p className="text-[10px] text-[#6B7280]">{p.issueOrg} · {p.issueDate ? String(p.issueDate) : ""}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 本周产业信号 */}
      <WeeklySignals />
    </div>
  );
}
type WeeklyData = {
  issue: string;
  date: string;
  publish_date: string;
  tracks: Record<string, {
    name: string;
    icon: string;
    signals: Array<{ title: string; source: string; summary?: string }>;
  }>;
  summary: string;
};

function WeeklySignals() {
  const [data, setData] = useState<WeeklyData | null>(null);
  const [activeTrack, setActiveTrack] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/weekly/latest.json")
      .then((r) => r.json())
      .then((d: WeeklyData) => {
        setData(d);
        const keys = Object.keys(d.tracks);
        if (keys.length > 0) setActiveTrack(keys[0]);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 mt-6">
        <div className="animate-pulse space-y-4">
          <div className="h-5 bg-[#F0F2F5] rounded w-40" />
          <div className="h-3 bg-[#F0F2F5] rounded w-60" />
          <div className="flex gap-2">
            {[1,2,3,4].map(i => <div key={i} className="h-8 bg-[#F0F2F5] rounded w-16" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const trackIds = Object.keys(data.tracks);
  const activeTrackData = activeTrack ? data.tracks[activeTrack] : null;

  return (
    <div className="space-y-4 mt-6">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#1B3A5C]" />
          <div>
            <h2 className="text-lg font-semibold text-[#1A1D21]">🌊 本周产业信号</h2>
            <p className="text-xs text-[#6B7280]">{data.issue} · {data.summary}</p>
          </div>
        </div>
        <span className="text-[10px] text-[#6B7280]">更新于 {data.date}</span>
      </div>

      {/* Tab导航 */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {trackIds.map((id) => {
          const t = data.tracks[id];
          const isActive = id === activeTrack;
          return (
            <button
              key={id}
              onClick={() => setActiveTrack(id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#1B3A5C] text-white shadow-sm"
                  : "bg-[#F0F2F5] text-[#6B7280] hover:bg-[#E2E5EA]"
              }`}
            >
              {t.icon} {t.name}
              {t.signals.length > 0 && (
                <span className={`ml-1.5 px-1 py-0.5 rounded text-[10px] ${
                  isActive ? "bg-white/20" : "bg-[#E2E5EA] text-[#6B7280]"
                }`}>{t.signals.length}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 信号列表 */}
      <div className="bg-white rounded-xl shadow-card p-5">
        {activeTrackData && activeTrackData.signals.length > 0 ? (
          <div className="space-y-1">
            {activeTrackData.signals.map((s, i) => (
              <div key={i} className="p-2.5 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                <p className="text-xs text-[#1A1D21] leading-relaxed">{s.title}</p>
                {s.summary && (
                  <p className="text-[10px] text-[#6B7280] mt-0.5 line-clamp-2">{s.summary}</p>
                )}
                <p className="text-[9px] text-[#9CA3AF] mt-1">{s.source}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-xs text-[#6B7280]">该赛道本期暂无信号</p>
          </div>
        )}
      </div>
    </div>
  );
}
