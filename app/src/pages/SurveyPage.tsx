import { trpc } from "@/providers/trpc";
import {
  Compass, Waves, Anchor, TreePine, Microscope, Fish,
  Droplets, Gem, Activity, Radio, BarChart3,
} from "lucide-react";

const surveyIcons: Record<string, typeof Compass> = {
  sea_area: Waves,
  island: Anchor,
  coastline: Waves,
  geology: Microscope,
  wetland: TreePine,
  biodiversity: Fish,
  marine_energy: Activity,
  groundwater: Droplets,
  mineral: Gem,
};

const surveyColors: Record<string, string> = {
  sea_area: "#1B3A5C",
  island: "#2E7D9A",
  coastline: "#4A8B5C",
  geology: "#D4823D",
  wetland: "#4A8B5C",
  biodiversity: "#2E7D9A",
  marine_energy: "#1B3A5C",
  groundwater: "#2E7D9A",
  mineral: "#6B7280",
};

const surveyNames: Record<string, string> = {
  sea_area: "海域面积",
  island: "海岛资源",
  coastline: "海岸线",
  geology: "地质调查",
  wetland: "湿地资源",
  biodiversity: "生物多样性",
  marine_energy: "海洋能资源",
  groundwater: "地下水资源",
  mineral: "矿产资源",
};

export default function SurveyPage() {
  const { data: summary } = trpc.survey.summary.useQuery();
  const { data: categoryData } = trpc.survey.categorySummary.useQuery();
  const { data: stations } = trpc.survey.stations.useQuery();
  const { data: detailData } = trpc.survey.byType.useQuery();

  const statCards = [
    { label: "管辖海域面积", value: `${summary?.seaArea ?? 4520}`, unit: summary?.seaAreaUnit ?? "平方公里", icon: Waves, color: "#1B3A5C", desc: "含伶仃洋、狮子洋等" },
    { label: "海岛数量", value: `${summary?.islandCount ?? 11}`, unit: "个", icon: Anchor, color: "#2E7D9A", desc: "含居民岛与无居民岛" },
    { label: "大陆海岸线", value: `${summary?.coastlineLength ?? 157.1}`, unit: surveyColors.coastline, icon: Waves, color: "#4A8B5C", desc: "自然+人工岸线" },
    { label: "地质调查覆盖率", value: `${summary?.geologyCoverage ?? 92.5}`, unit: "%", icon: Microscope, color: "#D4823D", desc: "1:5万区域地质" },
    { label: "滨海湿地面积", value: `${summary?.wetlandArea ?? 792.8}`, unit: "公顷", icon: TreePine, color: "#4A8B5C", desc: "珠江口滨海湿地" },
    { label: "红树林面积", value: `380.5`, unit: "公顷", icon: TreePine, color: "#2E7D9A", desc: "近年持续增长" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Compass className="w-5 h-5 text-[#1B3A5C]" />
            <h1 className="text-lg font-semibold text-[#1A1D21]">资源调查监测</h1>
          </div>
          <p className="text-xs text-[#6B7280]">广州市规划和自然资源局 — 自然资源调查监测优势</p>
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
              <p className="text-[10px] text-[#6B7280] mt-1">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="w-4 h-4 text-[#1B3A5C]" />
            <h3 className="text-sm font-semibold text-[#1A1D21]">调查数据分类</h3>
          </div>
          <div className="space-y-3">
            {(categoryData ?? []).map((cat) => {
              const Icon = surveyIcons[cat.type] ?? Compass;
              const color = surveyColors[cat.type] ?? "#6B7280";
              return (
                <div key={cat.type} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}12` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <span className="flex-1 text-xs text-[#1A1D21]">{cat.name}</span>
                  <span className="font-mono text-xs text-[#6B7280]">{cat.count} 项</span>
                  <div className="w-20 h-1.5 bg-[#F0F2F5] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: "100%", backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Data Table */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-[#2E7D9A]" />
            <h3 className="text-sm font-semibold text-[#1A1D21]">调查数据明细</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-[#6B7280] text-left">
                  <th className="pb-2 font-medium">调查类型</th>
                  <th className="pb-2 font-medium">项目名称</th>
                  <th className="pb-2 font-medium text-right">数值</th>
                  <th className="pb-2 font-medium">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E5EA]">
                {(detailData ?? []).slice(0, 8).map((item) => {
                  const color = surveyColors[item.surveyType] ?? "#6B7280";
                  const statusMap: Record<string, string> = { stable: "稳定", changing: "变化中", improving: "改善中", degrading: "退化中" };
                  const statusColor: Record<string, string> = { stable: "#6B7280", changing: "#D4823D", improving: "#4A8B5C", degrading: "#B54848" };
                  return (
                    <tr key={item.id} className="hover:bg-[#F0F2F5]/50 transition-colors">
                      <td className="py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: `${color}12`, color }}>
                          {surveyNames[item.surveyType] ?? item.surveyType}
                        </span>
                      </td>
                      <td className="py-2.5 text-[#1A1D21]">{item.itemName}</td>
                      <td className="py-2.5 text-right font-mono text-[#1A1D21]">
                        {item.itemValue ?? "—"} {item.unit}
                      </td>
                      <td className="py-2.5">
                        <span className="text-[10px]" style={{ color: statusColor[item.status ?? "stable"] ?? "#6B7280" }}>
                          {statusMap[item.status ?? "stable"] ?? item.status}
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

      {/* Monitoring Stations */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center gap-2 mb-5">
          <Radio className="w-4 h-4 text-[#4A8B5C]" />
          <h3 className="text-sm font-semibold text-[#1A1D21]">监测网络站点</h3>
          <span className="text-[10px] text-[#6B7280] ml-2">共 {stations?.length ?? 0} 个站点</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(stations ?? []).map((s) => (
            <div key={s.id} className="border border-[#E2E5EA] rounded-lg p-4 hover:border-[#2E7D9A]/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${s.status === "active" ? "bg-[#4A8B5C]" : s.status === "maintenance" ? "bg-[#D4823D]" : "bg-[#6B7280]"}`} />
                <span className="text-xs font-medium text-[#1A1D21]">{s.stationName}</span>
              </div>
              <div className="space-y-1 text-[10px] text-[#6B7280]">
                <p>类型: {s.stationType === "marine_environment" ? "海洋环境" : s.stationType === "geological" ? "地质监测" : s.stationType === "meteorological" ? "气象" : s.stationType === "tidal" ? "潮位" : s.stationType === "water_quality" ? "水质" : "生态"}</p>
                <p>区域: {s.region}</p>
                <p>频率: {s.dataFrequency === "real-time" ? "实时" : s.dataFrequency === "hourly" ? "每小时" : s.dataFrequency === "daily" ? "每日" : "每周"}</p>
                {s.latitude && s.longitude && (
                  <p className="font-mono">{s.latitude}, {s.longitude}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
