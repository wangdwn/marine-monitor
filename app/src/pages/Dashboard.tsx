import { useEffect, useState } from "react";
import {
  ChevronRight,
  Database,
  ScrollText,
  Wallet,
  Radar,
  Building2,
  BadgeCheck,
  BookOpen,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router";

type Metric = {
  id: string;
  label: string;
  value: number | Record<string, number> | null;
  unit?: string;
  source: string;
};

type StructureJudgment = {
  schema: string;
  generated_at: string;
  positioning: string;
  家底盘: {
    title: string;
    metrics: Metric[];
    drilldown: string;
  };
  经营盘: {
    title: string;
    notices: {
      available: boolean;
      source: string;
      total: number;
      last_90d_count: number;
      last_90d_budget_wan: number | null;
      last_90d_win_wan: number | null;
      with_source_url: number;
      missing_source_url?: number;
      region_dist?: Record<string, number>;
      chain_dist?: Record<string, number>;
    };
    funding: {
      available: boolean;
      source: string;
      count: number;
      status_dist: Record<string, number>;
      items_with_source_doc?: number;
      note?: string;
    };
    drilldown_bidding: string;
    drilldown_funding: string;
  };
  质量盘: {
    title: string;
    metrics: Metric[];
    drift_vs_previous: null;
    drift_note: string;
    drilldown: string;
  };
  底座: {
    title: string;
    source_snapshot_at?: string;
    content_refreshed_at?: string;
    tag_rules_version?: string;
    schema?: string;
    source?: string;
    pending_checklist: Array<{ id: string; label: string; source: string }>;
    changelog: string;
    vs_ghh: string;
  };
};

function SourceTag({ source }: { source: string }) {
  return (
    <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono break-all" title={source}>
      来源 · {source}
    </p>
  );
}

function MetricValue({ value, unit }: { value: Metric["value"]; unit?: string }) {
  if (value === null || value === undefined) {
    return <span className="text-lg font-semibold text-[#9CA3AF]">〔待核〕</span>;
  }
  if (typeof value === "object") {
    return (
      <div className="flex flex-wrap gap-2 mt-1">
        {Object.entries(value).map(([k, v]) => (
          <span key={k} className="text-sm font-mono text-[#1A1D21]">
            <span className="text-[#6B7280]">{k}</span> {v}
          </span>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-semibold text-[#1A1D21] font-mono">{value}</span>
      {unit ? <span className="text-xs text-[#6B7280]">{unit}</span> : null}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<StructureJudgment | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.BASE_URL}data/structure_judgment.json`, {
          cache: "no-cache",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as StructureJudgment;
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl border border-[#E2E5EA] flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-[#D4823D] shrink-0 mt-0.5" />
        <div>
          <h2 className="font-semibold text-[#1A1D21]">结构判断数据包未加载</h2>
          <p className="text-sm text-[#6B7280] mt-1">{error}</p>
          <p className="text-xs text-[#9CA3AF] mt-2 font-mono">期望路径 · public/data/structure_judgment.json</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-sm text-[#6B7280]">加载结构判断指标…</div>;
  }

  const notices = data.经营盘.notices;
  const funding = data.经营盘.funding;

  return (
    <div className="space-y-6">
      <section
        className="relative rounded-xl overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0B3A4A 0%, #1B5F6E 55%, #2A7A6E 100%)" }}
      >
        <div className="relative z-10 p-6 md:p-8">
          <p className="text-white/80 text-xs tracking-wide mb-2">海洋系列 · B 经营盘 · 监测研判</p>
          <h1 className="text-white text-2xl md:text-3xl font-semibold mb-2">广州海洋经济结构判断台</h1>
          <p className="text-white/75 text-sm max-w-3xl leading-relaxed">{data.positioning}</p>
          <p className="text-white/50 text-[11px] mt-3 font-mono">
            数据包 {data.schema} · 生成于 {data.generated_at}
          </p>
        </div>
      </section>

      {/* 家底盘 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#1B3A5C]" />
            <h2 className="text-sm font-semibold text-[#1A1D21]">{data.家底盘.title}</h2>
          </div>
          <a
            href={data.家底盘.drilldown}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#2E7D9A] hover:underline inline-flex items-center gap-1"
          >
            企业下钻 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.家底盘.metrics.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-[#E2E5EA] p-4">
              <p className="text-xs text-[#6B7280]">{m.label}</p>
              <MetricValue value={m.value} unit={m.unit} />
              <SourceTag source={m.source} />
            </div>
          ))}
        </div>
      </section>

      {/* 经营盘 */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Radar className="w-4 h-4 text-[#2E7D9A]" />
          <h2 className="text-sm font-semibold text-[#1A1D21]">{data.经营盘.title}</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-[#E2E5EA] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">近 90 日招标</h3>
              <a
                href={data.经营盘.drilldown_bidding}
                className="text-xs text-[#2E7D9A] hover:underline inline-flex items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                招标雷达 <ChevronRight className="w-3 h-3" />
              </a>
            </div>
            {notices.available ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-[#6B7280]">笔数</p>
                    <p className="text-2xl font-mono font-semibold">{notices.last_90d_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">预算合计（万元）</p>
                    <p className="text-2xl font-mono font-semibold">
                      {notices.last_90d_budget_wan ?? "〔待核〕"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">中标额合计（万元）</p>
                    <p className="text-2xl font-mono font-semibold">
                      {notices.last_90d_win_wan ?? "〔待核〕"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7280]">有原文链接</p>
                    <p className="text-2xl font-mono font-semibold">
                      {notices.with_source_url}/{notices.total}
                    </p>
                  </div>
                </div>
                <SourceTag source={notices.source} />
              </>
            ) : (
              <p className="text-sm text-[#9CA3AF]">〔待核〕暂无招标数据</p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-[#E2E5EA] p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#4A8B5C]" /> 专项资金状态
              </h3>
              <Link to="/funding" className="text-xs text-[#2E7D9A] hover:underline inline-flex items-center gap-1">
                只读列表 <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            {funding.available ? (
              <>
                <p className="text-2xl font-mono font-semibold">
                  {funding.count} <span className="text-xs text-[#6B7280] font-sans">条</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(funding.status_dist).map(([k, v]) => (
                    <span key={k} className="text-xs px-2 py-1 rounded bg-[#F3F4F6] font-mono">
                      {k || "〔待核〕"} · {v}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#6B7280]">{funding.note}</p>
                <SourceTag source={funding.source} />
              </>
            ) : (
              <p className="text-sm text-[#9CA3AF]">〔待核〕暂无专项资金数据</p>
            )}
          </div>
        </div>
      </section>

      {/* 质量盘 */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-4 h-4 text-[#D4823D]" />
            <h2 className="text-sm font-semibold text-[#1A1D21]">{data.质量盘.title}</h2>
          </div>
          <a
            href={data.质量盘.drilldown}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#2E7D9A] hover:underline inline-flex items-center gap-1"
          >
            信号灯仪表盘 <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-xs text-[#6B7280]">{data.质量盘.drift_note}</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {data.质量盘.metrics.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-[#E2E5EA] p-4">
              <p className="text-xs text-[#6B7280]">{m.label}</p>
              <MetricValue value={m.value} unit={m.unit} />
              <SourceTag source={m.source} />
            </div>
          ))}
        </div>
      </section>

      {/* 底座 */}
      <section className="bg-white rounded-xl border border-[#E2E5EA] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#1B3A5C]" />
          <h2 className="text-sm font-semibold">{data.底座.title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[#6B7280]">source_snapshot_at</span>
            <p className="font-mono">{data.底座.source_snapshot_at ?? "〔待核〕"}</p>
          </div>
          <div>
            <span className="text-[#6B7280]">content_refreshed_at</span>
            <p className="font-mono">{data.底座.content_refreshed_at ?? "〔待核〕"}</p>
          </div>
          <div>
            <span className="text-[#6B7280]">tag_rules_version</span>
            <p className="font-mono">{data.底座.tag_rules_version ?? "〔待核〕"}</p>
          </div>
          <div>
            <span className="text-[#6B7280]">schema</span>
            <p className="font-mono">{data.底座.schema ?? "〔待核〕"}</p>
          </div>
        </div>
        <p className="text-sm text-[#374151]">{data.底座.vs_ghh}</p>
        <div>
          <h3 className="text-xs font-semibold text-[#6B7280] mb-2 flex items-center gap-1">
            <Database className="w-3 h-3" />〔待核〕清单
          </h3>
          <ul className="space-y-2">
            {data.底座.pending_checklist.map((item) => (
              <li key={item.id} className="text-sm border border-[#E2E5EA] rounded-lg p-3">
                <p>{item.label}</p>
                <SourceTag source={item.source} />
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-3 pt-2 border-t border-[#E2E5EA]">
          <Link to="/map" className="text-xs text-[#2E7D9A] hover:underline inline-flex items-center gap-1">
            产业地图（二级） <ChevronRight className="w-3 h-3" />
          </Link>
          <Link to="/policies" className="text-xs text-[#2E7D9A] hover:underline inline-flex items-center gap-1">
            <ScrollText className="w-3 h-3" /> 政策只读摘要
          </Link>
          <span className="text-[10px] text-[#9CA3AF] font-mono">更新日志 · {data.底座.changelog}</span>
        </div>
      </section>

      <footer className="text-[11px] text-[#9CA3AF] text-center pb-4">
        本站是监测研判台，不是广海汇企业撮合黄页；不提供贷款申请入口，不编造营收财务。
      </footer>
    </div>
  );
}
