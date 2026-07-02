import { trpc } from "@/providers/trpc";
import {
  ShieldCheck, AlertTriangle, Waves,
  Wind, TreePine, HardHat, Siren, Activity,
  BarChart3, CircleDot,
} from "lucide-react";

const safetyTypeNames: Record<string, string> = {
  geological_hazard: "地质灾害",
  storm_surge: "风暴潮",
  wave: "海浪",
  red_tide: "赤潮",
  coastal_erosion: "海岸侵蚀",
  ecological_restoration: "生态修复",
  seawall: "海堤安全",
  emergency: "应急响应",
};

const safetyColors: Record<string, string> = {
  geological_hazard: "#B54848",
  storm_surge: "#D4823D",
  wave: "#2E7D9A",
  red_tide: "#D4823D",
  coastal_erosion: "#D4823D",
  ecological_restoration: "#4A8B5C",
  seawall: "#1B3A5C",
  emergency: "#6B7280",
};

const riskLevelConfig: Record<string, { label: string; color: string }> = {
  low: { label: "低风险", color: "#4A8B5C" },
  medium: { label: "中风险", color: "#D4823D" },
  high: { label: "高风险", color: "#B54848" },
  critical: { label: "极高风险", color: "#8B0000" },
};

export default function SafetyPage() {
  const { data: summary } = trpc.safety.summary.useQuery();
  const { data: riskDist } = trpc.safety.riskDistribution.useQuery();
  const { data: alerts } = trpc.safety.recentAlerts.useQuery();

  const statCards = [
    { label: "地质灾害隐患点", value: `${summary?.geoHazardTotal ?? 187}`, unit: "处", icon: AlertTriangle, color: "#B54848", sub: `已治理 ${summary?.geoHazardHandled ?? 142} 处` },
    { label: "风暴潮预警站", value: `${summary?.stormSurgeStations ?? 12}`, unit: "个", icon: Waves, color: "#D4823D", sub: "覆盖主要海岸线和河口" },
    { label: "海岸侵蚀速率", value: `${summary?.coastalErosionRate ?? 2.8}`, unit: safetyColors.coastal_erosion, icon: Wind, color: "#2E7D9A", sub: "南沙 coast 年均侵蚀" },
    { label: "生态修复面积", value: `${summary?.restorationArea ?? 1560}`, unit: "公顷", icon: TreePine, color: "#4A8B5C", sub: "红树林+珊瑚礁+沙滩养护" },
    { label: "海堤安全达标率", value: "88.5", unit: "%", icon: HardHat, color: "#1B3A5C", sub: "部分老旧海堤需加固" },
    { label: "应急响应时间", value: "15", unit: "分钟", icon: Siren, color: "#6B7280", sub: "海洋灾害应急平均响应" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-[#4A8B5C]" />
            <h1 className="text-lg font-semibold text-[#1A1D21]">安全屏障态势</h1>
          </div>
          <p className="text-xs text-[#6B7280]">广州市规划和自然资源局 — 韧性城市与地质海洋安全屏障</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-lg bg-[#4A8B5C]/10 text-[#4A8B5C] text-xs font-medium">
            韧性指数: {summary?.resilienceIndex ?? 78.5}
          </span>
        </div>
      </div>

      {/* Alert Banner */}
      <div className="bg-[#D4823D]/8 border border-[#D4823D]/20 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#D4823D]/15 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-4 h-4 text-[#D4823D]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-[#1A1D21]">当前安全态势: 整体平稳，需关注南沙区海岸侵蚀及白云区地质隐患</p>
          <p className="text-[10px] text-[#6B7280] mt-0.5">汛期地质灾害风险等级提升，建议加强巡查监测频次</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl shadow-card p-5 hover:shadow-card-hover transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${card.color}12` }}>
                  <Icon className="w-4 h-4" style={{ color: card.color }} />
                </div>
                <span className="text-xs text-[#6B7280]">{card.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-semibold text-[#1A1D21] font-mono">{card.value}</span>
                <span className="text-xs text-[#6B7280]">{card.unit}</span>
              </div>
              <p className="text-[10px] text-[#6B7280] mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Risk Distribution + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[#1B3A5C]" />
            <h3 className="text-sm font-semibold text-[#1A1D21]">风险等级分布</h3>
          </div>
          <div className="space-y-4">
            {(riskDist ?? []).map((r) => {
              const cfg = riskLevelConfig[r.level ?? "low"] ?? { label: r.level, color: "#6B7280" };
              const total = (riskDist ?? []).reduce((s, x) => s + x.count, 0);
              const pct = total > 0 ? (r.count / total) * 100 : 0;
              return (
                <div key={r.level}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <CircleDot className="w-3 h-3" style={{ color: cfg.color }} />
                      <span className="text-xs text-[#1A1D21]">{cfg.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#6B7280]">{r.count} 项</span>
                  </div>
                  <div className="h-2 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: cfg.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-[#B54848]" />
            <h3 className="text-sm font-semibold text-[#1A1D21]">安全监测预警</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#6B7280] text-left border-b border-[#E2E5EA]">
                  <th className="pb-3 font-medium">监测项</th>
                  <th className="pb-3 font-medium">类型</th>
                  <th className="pb-3 font-medium">区域</th>
                  <th className="pb-3 font-medium">数值</th>
                  <th className="pb-3 font-medium">风险等级</th>
                  <th className="pb-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EA]">
                {(alerts ?? []).slice(0, 10).map((item) => {
                  const color = safetyColors[item.safetyType] ?? "#6B7280";
                  const riskCfg = riskLevelConfig[item.riskLevel ?? "low"] ?? { label: "未知", color: "#6B7280" };
                  const statusMap: Record<string, { label: string; bg: string; text: string }> = {
                    normal: { label: "正常", bg: "#4A8B5C10", text: "#4A8B5C" },
                    warning: { label: "预警", bg: "#D4823D10", text: "#D4823D" },
                    alert: { label: "告警", bg: "#B5484810", text: "#B54848" },
                    emergency: { label: "紧急", bg: "#8B000010", text: "#8B0000" },
                  };
                  const st = statusMap[item.status ?? "normal"] ?? statusMap.normal;
                  return (
                    <tr key={item.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                      <td className="py-2.5 text-[#1A1D21]">{item.itemName}</td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${color}12`, color }}>
                          {safetyTypeNames[item.safetyType] ?? item.safetyType}
                        </span>
                      </td>
                      <td className="py-2.5 text-[#6B7280]">{item.region}</td>
                      <td className="py-2.5 font-mono text-[#1A1D21]">{item.itemValue ?? "—"} {item.unit}</td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${riskCfg.color}10`, color: riskCfg.color }}>
                          {riskCfg.label}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: st.bg, color: st.text }}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
