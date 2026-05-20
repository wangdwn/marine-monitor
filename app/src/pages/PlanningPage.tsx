import { trpc } from "@/providers/trpc";
import {
  ClipboardList, Target, CheckCircle2, Clock,
  TrendingUp, Map, LandPlot, Waves, BarChart3,
} from "lucide-react";

const planTypeNames: Record<string, string> = {
  spatial_plan: "国土空间规划",
  marine_function: "海洋功能区划",
  coastal_protection: "海岸带保护",
  land_supply: "土地供应",
  sea_approval: "用海审批",
  project_support: "重大项目保障",
};

const planTypeColors: Record<string, string> = {
  spatial_plan: "#1B3A5C",
  marine_function: "#2E7D9A",
  coastal_protection: "#4A8B5C",
  land_supply: "#7B9E6B",
  sea_approval: "#D4823D",
  project_support: "#6B7280",
};

export default function PlanningPage() {
  const { data: summary } = trpc.planning.summary.useQuery();
  const { data: categoryData } = trpc.planning.categorySummary.useQuery();
  const { data: detailData } = trpc.planning.byType.useQuery();

  const statCards = [
    { label: "空间规划合规率", value: `${summary?.spatialPlanCompliance ?? 96.8}`, unit: "%", icon: Target, color: "#1B3A5C", desc: "建设项目符合国土空间规划比例", trend: "+1.2%" },
    { label: "用海审批项目数", value: `${summary?.seaApprovalCount ?? 128}`, unit: "宗", icon: Waves, color: "#2E7D9A", desc: "全年完成用海审批数量", trend: "+8宗" },
    { label: "重大项目保障", value: `${summary?.projectSupportCount ?? 45}`, unit: "个", icon: CheckCircle2, color: "#4A8B5C", desc: "省市重点海洋经济项目", trend: "+5个" },
    { label: "功能区划覆盖率", value: `${summary?.marineFunctionCoverage ?? 98.2}`, unit: "%", icon: LandPlot, color: "#D4823D", desc: "海域功能分区覆盖比例", trend: "+0.5%" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ClipboardList className="w-5 h-5 text-[#2E7D9A]" />
            <h1 className="text-lg font-semibold text-[#1A1D21]">规划用地保障</h1>
          </div>
          <p className="text-xs text-[#6B7280]">广州市规划和自然资源局 — 国土空间规划与土地要素保障</p>
        </div>
      </div>

      {/* Key Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}12` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-[#1A1D21] font-mono">{card.value}</span>
                <span className="text-xs text-[#6B7280]">{card.unit}</span>
              </div>
              <p className="text-xs text-[#6B7280] mt-1">{card.label}</p>
              <p className="text-[10px] text-[#4A8B5C] mt-0.5">{card.trend} 较上年</p>
            </div>
          );
        })}
      </div>

      {/* Plan Implementation Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[#1B3A5C]" />
            <h3 className="text-sm font-semibold text-[#1A1D21]">规划实施监测</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#6B7280] text-left border-b border-[#E2E5EA]">
                  <th className="pb-3 font-medium">规划类型</th>
                  <th className="pb-3 font-medium">指标名称</th>
                  <th className="pb-3 font-medium text-right">完成值</th>
                  <th className="pb-3 font-medium text-right">目标值</th>
                  <th className="pb-3 font-medium text-right">完成率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EA]">
                {(detailData ?? []).map((item) => {
                  const color = planTypeColors[item.planType] ?? "#6B7280";
                  const rate = Number(item.completionRate ?? 0);
                  return (
                    <tr key={item.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${color}12`, color }}>
                          {planTypeNames[item.planType] ?? item.planType}
                        </span>
                      </td>
                      <td className="py-3 text-[#1A1D21]">{item.indicatorName}</td>
                      <td className="py-3 text-right font-mono text-[#1A1D21]">{item.indicatorValue ?? "—"} {item.unit}</td>
                      <td className="py-3 text-right font-mono text-[#6B7280]">{item.targetValue ?? "—"} {item.unit}</td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: rate >= 100 ? "#4A8B5C" : rate >= 80 ? "#D4823D" : "#B54848" }} />
                          </div>
                          <span className="font-mono text-[10px] w-10 text-right" style={{ color: rate >= 100 ? "#4A8B5C" : rate >= 80 ? "#D4823D" : "#B54848" }}>{rate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Map className="w-4 h-4 text-[#2E7D9A]" />
            <h3 className="text-sm font-semibold text-[#1A1D21]">规划类别分布</h3>
          </div>
          <div className="space-y-4">
            {(categoryData ?? []).map((cat) => {
              const color = planTypeColors[cat.type] ?? "#6B7280";
              const total = (categoryData ?? []).reduce((s, c) => s + c.count, 0);
              const pct = total > 0 ? (cat.count / total) * 100 : 0;
              return (
                <div key={cat.type}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#1A1D21]">{cat.name}</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">{cat.count} 项</span>
                  </div>
                  <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "三区三线划定", value: "100%", sub: "生态保护红线、永久基本农田、城镇开发边界", icon: LandPlot, color: "#1B3A5C" },
          { title: "用海审批效率", value: "18.5", unit: "工作日", sub: "较法定时限压缩7.5个工作日", icon: Clock, color: "#2E7D9A" },
          { title: "海洋经济供地", value: "2850.5", unit: "亩", sub: "保障省市重点海洋经济项目用地", icon: TrendingUp, color: "#4A8B5C" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="bg-white rounded-xl shadow-card p-5 border-l-4" style={{ borderLeftColor: item.color }}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" style={{ color: item.color }} />
                <span className="text-xs text-[#6B7280]">{item.title}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-semibold text-[#1A1D21] font-mono">{item.value}</span>
                {item.unit && <span className="text-xs text-[#6B7280]">{item.unit}</span>}
              </div>
              <p className="text-[10px] text-[#6B7280] mt-2 leading-relaxed">{item.sub}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
