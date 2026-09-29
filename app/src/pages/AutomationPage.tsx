import { useState, useEffect } from "react";
import {
  Activity,
  Play,
  FilePlus,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  BarChart3,
  RefreshCw,
  Calendar,
  Database,
  FileText,
  TrendingUp,
  Timer,
  Server,
  AlertCircle,
  CheckCircle2,
  Loader2,
  PauseCircle,
} from "lucide-react";

const dimNames: Record<string, string> = {
  hub: "港口枢纽", industry: "产业集群", population: "市场人气",
  ecosystem: "生态支撑", capital: "资本热度", tourism: "海洋文旅",
  investment: "经济投资", shipping: "航运物流", talent: "人才供需",
  energy: "海洋能源", fishery: "海洋渔业", carbon: "海洋碳汇",
  culture: "海洋文化", planning: "规划研究", research: "综合研究",
};

const statusMeta: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  success: { label: "成功", color: "#4A8B5C", icon: CheckCircle },
  failed: { label: "失败", color: "#B54848", icon: AlertTriangle },
  running: { label: "采集中", color: "#2E7D9A", icon: Loader2 },
  timeout: { label: "超时", color: "#D4823D", icon: Clock },
  queued: { label: "排队中", color: "#6B7280", icon: PauseCircle },
  generating: { label: "生成中", color: "#2E7D9A", icon: Loader2 },
  completed: { label: "已完成", color: "#4A8B5C", icon: CheckCircle2 },
};

export default function AutomationPage() {
  const [activeTab, setActiveTab] = useState<"collection" | "reports">("collection");

  // 从静态 JSON 加载数据（替代后端 trpc.automation）
  const [adata, setAdata] = useState<any>({ schedules: [], executions: [], reports: [] });
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/automation.json`)
      .then((r) => r.json())
      .then(setAdata)
      .catch(() => setAdata({ schedules: [], executions: [], reports: [] }));
  }, []);
  const stats = adata.stats;
  const reportStats = adata.reportStats;
  const schedules: any[] = adata.schedules ?? [];
  const executions: any[] = adata.executions ?? [];
  const reports: any[] = adata.reports ?? [];
  const actionsUrl: string = adata.actionsUrl ?? "https://github.com/wangdwn/marine-monitor/actions";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1A1D21] flex items-center gap-2">
            <Activity className="w-6 h-6 text-[#2E7D9A]" />
            自动化中心
          </h1>
          <p className="text-xs text-[#6B7280] mt-1">数据采集调度 · 报告自动生成 · 执行监控</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("collection")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "collection" ? "bg-[#1B3A5C] text-white" : "bg-white text-[#6B7280] hover:bg-[#F0F2F5]"
            }`}
          >
            <Database className="w-4 h-4" /> 采集调度
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
              activeTab === "reports" ? "bg-[#1B3A5C] text-white" : "bg-white text-[#6B7280] hover:bg-[#F0F2F5]"
            }`}
          >
            <FileText className="w-4 h-4" /> 报告生成
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Server className="w-4 h-4 text-[#2E7D9A]" />
            <span className="text-xs text-[#6B7280]">活跃任务</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">{stats?.activeSchedules ?? 0}<span className="text-sm text-[#6B7280] font-normal">/{stats?.totalSchedules ?? 0}</span></p>
          <p className="text-[10px] text-[#4A8B5C] mt-1">7日成功率 {stats?.successRate7d ?? 0}%</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-[#D4823D]" />
            <span className="text-xs text-[#6B7280]">今日采集</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">{stats?.todayExecutions ?? 0}</p>
          <p className="text-[10px] text-[#6B7280] mt-1">成功{stats?.todaySuccess ?? 0} / 失败{stats?.todayFailed ?? 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[#1B3A5C]" />
            <span className="text-xs text-[#6B7280]">已生成报告</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">{reportStats?.totalGenerated ?? 0}</p>
          <p className="text-[10px] text-[#6B7280] mt-1">{reportStats?.avgQualityScore ? `均分 ${reportStats.avgQualityScore} | ` : ""}总{((reportStats?.totalSizeKb ?? 0)/1024).toFixed(1)}MB</p>
        </div>
        <div className="bg-white rounded-xl shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-[#4A8B5C]" />
            <span className="text-xs text-[#6B7280]">今日入库</span>
          </div>
          <p className="text-2xl font-bold text-[#1A1D21]">{stats?.todayRecords ?? 0}</p>
          <p className="text-[10px] text-[#4A8B5C] mt-1">条数据记录</p>
        </div>
      </div>

      {/* Collection Tab */}
      {activeTab === "collection" && (
        <div className="space-y-6">
          {/* Schedules */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1A1D21] mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2E7D9A]" /> 采集任务调度
            </h2>
            <div className="space-y-2">
              {(schedules ?? []).map((s) => (
                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0F2F5] transition-colors group">
                  <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.isActive ? "bg-[#4A8B5C] animate-pulse" : "bg-[#6B7280]"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-[#1A1D21]">{s.taskName}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#F0F2F5] text-[#6B7280]">{dimNames[s.dimensionCode] ?? s.dimensionCode}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.frequency}</span>
                      <span className="flex items-center gap-1">Cron: {s.cronExpression}</span>
                      <span className="flex items-center gap-1 text-[#4A8B5C]">成功{s.successCount}</span>
                      {s.failCount > 0 && <span className="flex items-center gap-1 text-[#B54848]">失败{s.failCount}</span>}
                    </div>
                  </div>
                  <a
                    href={actionsUrl}
                    target="_blank"
                    rel="noreferrer"
                    title="静态站无法直接触发，请前往 GitHub Actions 手动执行"
                    className="px-3 py-1.5 rounded-lg bg-[#2E7D9A] text-white text-xs font-medium hover:bg-[#1B3A5C] transition-colors flex items-center gap-1"
                  >
                    <Play className="w-3 h-3" /> 前往执行
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Execution History */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1A1D21] mb-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-[#2E7D9A]" /> 采集执行日志
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] text-[#6B7280] border-b border-[#E2E5EA]">
                    <th className="pb-2 font-medium">任务</th>
                    <th className="pb-2 font-medium">维度</th>
                    <th className="pb-2 font-medium">状态</th>
                    <th className="pb-2 font-medium">采集/入库</th>
                    <th className="pb-2 font-medium">耗时</th>
                    <th className="pb-2 font-medium">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {(executions ?? []).map((e) => {
                    const sm = statusMeta[e.status] ?? { label: e.status, color: "#6B7280", icon: AlertCircle };
                    const Icon = sm.icon;
                    return (
                      <tr key={e.id} className="border-b border-[#E2E5EA]/50 hover:bg-[#F8F9FB]">
                        <td className="py-2.5 text-[#1A1D21] font-medium">{e.taskName}</td>
                        <td className="py-2.5 text-[#6B7280]">{dimNames[e.dimensionCode ?? ""] ?? e.dimensionCode}</td>
                        <td className="py-2.5">
                          <span className="flex items-center gap-1 text-xs font-medium" style={{ color: sm.color }}>
                            <Icon className="w-3.5 h-3.5" /> {sm.label}
                          </span>
                        </td>
                        <td className="py-2.5 text-[#6B7280]">{e.recordsCollected}/{e.recordsInserted}</td>
                        <td className="py-2.5 text-[#6B7280]">{((e.executionTimeMs ?? 0) / 1000).toFixed(1)}s</td>
                        <td className="py-2.5 text-[11px] text-[#6B7280]">{new Date(e.startedAt).toLocaleString('zh-CN')}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          {/* Generate Report */}
          <div className="bg-gradient-to-r from-[#1B3A5C] to-[#2E7D9A] rounded-2xl p-6 text-white">
            <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FilePlus className="w-4 h-4" /> 报告生成
            </h2>
            <p className="text-xs text-white/70 mb-4 leading-relaxed">
              静态站点无法直接生成报告。周报由每周定时任务自动生成并发布，请前往 GitHub Actions 查看或手动触发。
            </p>
            <a
              href={actionsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex px-5 py-2.5 rounded-xl bg-white text-[#1B3A5C] text-sm font-medium hover:bg-white/90 transition-colors items-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> 前往 GitHub Actions
            </a>
          </div>

          {/* Report Status Distribution */}
          <div className="grid grid-cols-4 gap-4">
            {(reportStats?.byStatus ?? []).map((s) => {
              const sm = statusMeta[s.status] ?? { label: s.status, color: "#6B7280" };
              return (
                <div key={s.status} className="bg-white rounded-xl shadow-card p-4 text-center">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: `${sm.color}15` }}>
                    <BarChart3 className="w-5 h-5" style={{ color: sm.color }} />
                  </div>
                  <p className="text-xl font-bold text-[#1A1D21]">{s.count}</p>
                  <p className="text-[11px] text-[#6B7280]" style={{ color: sm.color }}>{sm.label}</p>
                </div>
              );
            })}
          </div>

          {/* Report Generation List */}
          <div className="bg-white rounded-2xl shadow-card p-5">
            <h2 className="text-sm font-semibold text-[#1A1D21] mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#2E7D9A]" /> 报告生成记录
            </h2>
            <div className="space-y-2">
              {(reports ?? []).map((r) => {
                const sm = statusMeta[r.status] ?? { label: r.status, color: "#6B7280" };
                const triggerNames: Record<string, string> = { manual: "手动", scheduled: "定时", auto: "自动" };
                return (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F0F2F5] transition-colors">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${sm.color}15` }}>
                      <FileText className="w-5 h-5" style={{ color: sm.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-[#1A1D21] truncate">{r.reportTitle}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white" style={{ backgroundColor: sm.color }}>{sm.label}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-[#6B7280]">
                        <span>{dimNames[r.trackType ?? ""] ?? r.trackType}</span>
                        <span>{triggerNames[r.triggerType ?? "manual"]}</span>
                        <span>{r.dataSourcesUsed}个数据源</span>
                        {r.qualityScore > 0 && <span className="text-[#D4823D]">质量分{r.qualityScore}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[10px] text-[#6B7280]">{new Date(r.createdAt).toLocaleDateString('zh-CN')}</p>
                      {r.generationTimeMs > 0 && <p className="text-[10px] text-[#6B7280]">{(r.generationTimeMs/1000).toFixed(0)}秒</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
