import { trpc } from "@/providers/trpc";
import { useState } from "react";
import {
  Database, Activity, BookOpen, Settings, Play,
  CheckCircle2, XCircle, Search,
  BarChart3, Layers, Globe, Factory, Users,
  Leaf, Coins, Terminal,
} from "lucide-react";

type TabType = "sources" | "dimensions" | "glossary" | "tasks" | "logs";

const dimColors: Record<string, string> = {
  hub: "#1B3A5C", industry: "#2E7D9A", population: "#4A8B5C",
  ecosystem: "#D4823D", capital: "#B54848",
};
const dimIcons: Record<string, typeof Globe> = {
  hub: Globe, industry: Factory, population: Users,
  ecosystem: Leaf, capital: Coins,
};
const priorityColors: Record<string, string> = { P0: "#B54848", P1: "#D4823D", P2: "#2E7D9A", P3: "#6B7280" };
const categoryNames: Record<string, string> = {
  hub: "枢纽", industry: "产业", population: "人气", ecosystem: "生态", capital: "资本",
};

export default function CollectorPage() {
  const [tab, setTab] = useState<TabType>("sources");
  const [sourceFilter, setSourceFilter] = useState({ priority: "", category: "", search: "" });
  const [glossaryFilter, setGlossaryFilter] = useState({ category: "", search: "" });

  const { data: sourceList } = trpc.collector.sourceList.useQuery(sourceFilter);
  const { data: sourceStats } = trpc.collector.sourceStats.useQuery();
  const { data: dimList } = trpc.collector.dimensionList.useQuery();
  const { data: dimSummary } = trpc.collector.dimensionSummary.useQuery();
  const { data: glossaryList } = trpc.collector.glossaryList.useQuery(glossaryFilter);
  const { data: taskList } = trpc.collector.taskList.useQuery();
  const { data: logList } = trpc.collector.logList.useQuery({ limit: 20 });
  const { data: logStats } = trpc.collector.logStats.useQuery();

  const utils = trpc.useUtils();
  const runTask = trpc.collector.taskRun.useMutation({
    onSuccess: () => { utils.collector.taskList.invalidate(); utils.collector.logList.invalidate(); utils.collector.logStats.invalidate(); },
  });

  const tabs: { key: TabType; label: string; icon: typeof Database }[] = [
    { key: "sources", label: "数据源", icon: Database },
    { key: "dimensions", label: "五维指标", icon: Layers },
    { key: "glossary", label: "术语库", icon: BookOpen },
    { key: "tasks", label: "采集任务", icon: Settings },
    { key: "logs", label: "采集日志", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-[#1B3A5C]" />
          <h1 className="text-lg font-semibold text-[#1A1D21]">数据采集系统</h1>
        </div>
        <p className="text-xs text-[#6B7280]">基于钱学森系统工程 + 科学预测法的核心数据采集器</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "数据源", value: sourceStats?.total ?? 0, icon: Database, color: "#1B3A5C" },
          { label: "五维指标", value: dimList?.length ?? 0, icon: Layers, color: "#2E7D9A" },
          { label: "术语词条", value: glossaryList?.length ?? 0, icon: BookOpen, color: "#4A8B5C" },
          { label: "采集任务", value: taskList?.length ?? 0, icon: Settings, color: "#D4823D" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl shadow-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${s.color}12` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                </div>
                <span className="text-xs text-[#6B7280]">{s.label}</span>
              </div>
              <span className="text-xl font-semibold text-[#1A1D21] font-mono">{s.value}</span>
            </div>
          );
        })}
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-card p-1 flex gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                tab === t.key ? "bg-[#1B3A5C]/8 text-[#1B3A5C] font-medium" : "text-[#6B7280] hover:bg-[#F0F2F5]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {tab === "sources" && (
        <div className="space-y-4">
          {/* Priority Distribution */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(sourceStats?.byPriority ?? []).map((p) => (
              <div key={p.priorityLevel} className="bg-white rounded-xl shadow-card p-4 border-l-4" style={{ borderLeftColor: priorityColors[p.priorityLevel ?? "P3"] }}>
                <span className="text-xs text-[#6B7280]">{p.priorityLevel} 级数据源</span>
                <p className="text-2xl font-semibold text-[#1A1D21] font-mono mt-1">{p.count}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input
                type="text" placeholder="搜索数据源..."
                value={sourceFilter.search} onChange={(e) => setSourceFilter({ ...sourceFilter, search: e.target.value })}
                className="w-full pl-9 pr-3 py-2 bg-[#F0F2F5] rounded-lg text-sm outline-none"
              />
            </div>
            <select value={sourceFilter.priority} onChange={(e) => setSourceFilter({ ...sourceFilter, priority: e.target.value })} className="px-3 py-2 bg-[#F0F2F5] rounded-lg text-sm outline-none">
              <option value="">全部优先级</option><option value="P0">P0 核心</option><option value="P1">P1 重要</option><option value="P2">P2 补充</option>
            </select>
            <select value={sourceFilter.category} onChange={(e) => setSourceFilter({ ...sourceFilter, category: e.target.value })} className="px-3 py-2 bg-[#F0F2F5] rounded-lg text-sm outline-none">
              <option value="">全部类别</option><option value="hub">枢纽</option><option value="industry">产业</option><option value="population">人气</option><option value="ecosystem">生态</option><option value="capital">资本</option>
            </select>
          </div>

          {/* Source Table */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-[#6B7280] text-left border-b border-[#E2E5EA]">
                  <th className="px-4 py-3 font-medium">数据源名称</th>
                  <th className="px-4 py-3 font-medium">级别</th>
                  <th className="px-4 py-3 font-medium">权威</th>
                  <th className="px-4 py-3 font-medium">持续</th>
                  <th className="px-4 py-3 font-medium">结构</th>
                  <th className="px-4 py-3 font-medium">优先级</th>
                  <th className="px-4 py-3 font-medium">采集方式</th>
                  <th className="px-4 py-3 font-medium">频率</th>
                  <th className="px-4 py-3 font-medium">状态</th>
                </tr></thead>
                <tbody className="divide-y divide-[#E2E5EA]">
                  {(sourceList ?? []).map((s) => (
                    <tr key={s.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-[#1A1D21] font-medium">{s.sourceName}</p>
                        {s.sourceUrl && <p className="text-[10px] text-[#2E7D9A] truncate max-w-[200px]">{s.sourceUrl}</p>}
                      </td>
                      <td className="px-4 py-3"><span className="px-1.5 py-0.5 rounded text-[10px]" style={{ backgroundColor: `${priorityColors[s.priorityLevel ?? "P3"]}15`, color: priorityColors[s.priorityLevel ?? "P3"] }}>{s.priorityLevel}</span></td>
                      <td className="px-4 py-3 font-mono">{s.authorityLevel}/5</td>
                      <td className="px-4 py-3 font-mono">{s.sustainabilityLevel}/5</td>
                      <td className="px-4 py-3 font-mono">{s.structurabilityLevel}/5</td>
                      <td className="px-4 py-3 font-mono text-[#1A1D21]">{Number(s.priorityScore).toFixed(2)}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{s.collectionMethod === "api" ? "API" : s.collectionMethod === "crawler" ? "爬虫" : s.collectionMethod === "pdf" ? "PDF" : "手工"}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{s.updateFrequency === "daily" ? "每日" : s.updateFrequency === "weekly" ? "每周" : s.updateFrequency === "monthly" ? "每月" : s.updateFrequency === "quarterly" ? "每季" : "每年"}</td>
                      <td className="px-4 py-3"><span className={`w-2 h-2 rounded-full inline-block ${s.status === "active" ? "bg-[#4A8B5C]" : s.status === "paused" ? "bg-[#D4823D]" : "bg-[#6B7280]"}`} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "dimensions" && (
        <div className="space-y-4">
          {/* Dimension Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(dimSummary ?? []).map((d) => {
              const Icon = dimIcons[d.code] ?? Layers;
              return (
                <div key={d.code} className="bg-white rounded-xl shadow-card p-4 border-t-4" style={{ borderTopColor: d.color }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: d.color }} />
                    <span className="text-xs text-[#6B7280]">{d.name}</span>
                  </div>
                  <p className="text-lg font-semibold text-[#1A1D21] font-mono">{d.indicatorCount}</p>
                  <p className="text-[10px] text-[#6B7280]">个指标</p>
                </div>
              );
            })}
          </div>

          {/* Indicators Table */}
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr className="text-[#6B7280] text-left border-b border-[#E2E5EA]">
                  <th className="px-4 py-3 font-medium">维度</th>
                  <th className="px-4 py-3 font-medium">指标编码</th>
                  <th className="px-4 py-3 font-medium">指标名称</th>
                  <th className="px-4 py-3 font-medium">单位</th>
                  <th className="px-4 py-3 font-medium">数据来源</th>
                  <th className="px-4 py-3 font-medium">阈值范围</th>
                </tr></thead>
                <tbody className="divide-y divide-[#E2E5EA]">
                  {(dimList ?? []).map((d) => (
                    <tr key={d.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                      <td className="px-4 py-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${dimColors[d.dimensionCode ?? ""] ?? "#6B7280"}12`, color: dimColors[d.dimensionCode ?? ""] ?? "#6B7280" }}>{categoryNames[d.dimensionCode ?? ""] ?? d.dimensionCode}</span></td>
                      <td className="px-4 py-2.5 font-mono text-[#6B7280]">{d.indicatorCode}</td>
                      <td className="px-4 py-2.5 text-[#1A1D21]">{d.indicatorName}</td>
                      <td className="px-4 py-2.5 text-[#6B7280]">{d.indicatorUnit}</td>
                      <td className="px-4 py-2.5 text-[#6B7280] max-w-[200px] truncate">{d.dataSource}</td>
                      <td className="px-4 py-2.5 font-mono text-[#6B7280]">{d.thresholdMin ?? "—"} ~ {d.thresholdMax ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === "glossary" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
              <input type="text" placeholder="搜索术语..." value={glossaryFilter.search} onChange={(e) => setGlossaryFilter({ ...glossaryFilter, search: e.target.value })} className="w-full pl-9 pr-3 py-2 bg-[#F0F2F5] rounded-lg text-sm outline-none" />
            </div>
            <select value={glossaryFilter.category} onChange={(e) => setGlossaryFilter({ ...glossaryFilter, category: e.target.value })} className="px-3 py-2 bg-[#F0F2F5] rounded-lg text-sm outline-none">
              <option value="">全部类别</option><option value="industry">产业</option><option value="port">港口</option><option value="policy">政策</option><option value="econ">经济</option><option value="general">通用</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(glossaryList ?? []).map((g) => (
              <div key={g.id} className="bg-white rounded-xl shadow-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-[#1A1D21]">{g.termZh}</h4>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F0F2F5] text-[#6B7280]">{g.category}</span>
                </div>
                {g.termEn && <p className="text-[10px] text-[#6B7280] mb-2 font-mono">{g.termEn}</p>}
                <p className="text-xs text-[#6B7280] leading-relaxed">{g.definition}</p>
                {g.source && <p className="text-[10px] text-[#2E7D9A] mt-2">来源: {g.source}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "tasks" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="text-[#6B7280] text-left border-b border-[#E2E5EA]">
                <th className="px-4 py-3 font-medium">任务名称</th>
                <th className="px-4 py-3 font-medium">类型</th>
                <th className="px-4 py-3 font-medium">Cron</th>
                <th className="px-4 py-3 font-medium">上次执行</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">操作</th>
              </tr></thead>
              <tbody className="divide-y divide-[#E2E5EA]">
                {(taskList ?? []).map((t) => (
                  <tr key={t.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                    <td className="px-4 py-3 text-[#1A1D21] font-medium">{t.taskName}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{t.taskType === "scheduled" ? "定时" : t.taskType === "manual" ? "手动" : "按需"}</td>
                    <td className="px-4 py-3 font-mono text-[#6B7280]">{t.scheduleCron ?? "—"}</td>
                    <td className="px-4 py-3 text-[#6B7280]">{t.lastRunAt ? new Date(t.lastRunAt).toLocaleDateString("zh-CN") : "从未"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        t.lastStatus === "success" ? "bg-[#4A8B5C]/10 text-[#4A8B5C]" : t.lastStatus === "failed" ? "bg-[#B54848]/10 text-[#B54848]" : t.lastStatus === "running" ? "bg-[#2E7D9A]/10 text-[#2E7D9A]" : "bg-[#F0F2F5] text-[#6B7280]"
                      }`}>{t.lastStatus === "success" ? "成功" : t.lastStatus === "failed" ? "失败" : t.lastStatus === "running" ? "执行中" : "待执行"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => runTask.mutate({ id: t.id ?? 0 })} disabled={runTask.isPending && runTask.variables?.id === t.id} className="px-2 py-1 rounded bg-[#1B3A5C] text-white text-[10px] hover:bg-[#152D49] transition-colors disabled:opacity-50 flex items-center gap-1">
                        <Play className="w-3 h-3" /> {runTask.isPending && runTask.variables?.id === t.id ? "执行中" : "执行"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "logs" && (
        <div className="space-y-4">
          {/* Log Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "总执行次数", value: logStats?.totalRuns ?? 0, icon: Activity, color: "#1B3A5C" },
              { label: "成功次数", value: logStats?.successRuns ?? 0, icon: CheckCircle2, color: "#4A8B5C" },
              { label: "失败次数", value: logStats?.failedRuns ?? 0, icon: XCircle, color: "#B54848" },
              { label: "成功率", value: `${logStats?.successRate ?? 0}%`, icon: BarChart3, color: "#2E7D9A" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-white rounded-xl shadow-card p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                    <span className="text-xs text-[#6B7280]">{s.label}</span>
                  </div>
                  <span className="text-lg font-semibold text-[#1A1D21] font-mono">{s.value}</span>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <table className="w-full text-xs">
              <thead><tr className="text-[#6B7280] text-left border-b border-[#E2E5EA]">
                <th className="px-4 py-3 font-medium">任务名称</th>
                <th className="px-4 py-3 font-medium">状态</th>
                <th className="px-4 py-3 font-medium">采集</th>
                <th className="px-4 py-3 font-medium">入库</th>
                <th className="px-4 py-3 font-medium">丢弃</th>
                <th className="px-4 py-3 font-medium">耗时</th>
                <th className="px-4 py-3 font-medium">时间</th>
              </tr></thead>
              <tbody className="divide-y divide-[#E2E5EA]">
                {(logList ?? []).map((l) => (
                  <tr key={l.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                    <td className="px-4 py-2.5 text-[#1A1D21]">{l.taskName}</td>
                    <td className="px-4 py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                        l.status === "success" ? "bg-[#4A8B5C]/10 text-[#4A8B5C]" : l.status === "failed" ? "bg-[#B54848]/10 text-[#B54848]" : "bg-[#D4823D]/10 text-[#D4823D]"
                      }`}>{l.status === "success" ? "成功" : l.status === "failed" ? "失败" : "部分"}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono">{l.recordsCollected}</td>
                    <td className="px-4 py-2.5 font-mono text-[#4A8B5C]">{l.recordsInserted}</td>
                    <td className="px-4 py-2.5 font-mono text-[#B54848]">{l.recordsRejected}</td>
                    <td className="px-4 py-2.5 font-mono">{l.executionTimeMs}ms</td>
                    <td className="px-4 py-2.5 text-[#6B7280]">{l.createdAt ? new Date(l.createdAt).toLocaleString("zh-CN") : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
