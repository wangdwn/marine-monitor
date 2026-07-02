import { trpc } from "@/providers/trpc";
import { useState, useMemo } from "react";
import {
  MapPin,
  Anchor,
  Building,
  TreePine,
  Layers,
  Filter,
  Info,
} from "lucide-react";

const resourceTypeConfig: Record<string, { label: string; icon: typeof MapPin; color: string }> = {
  infrastructure: { label: "基础设施", icon: Anchor, color: "#4A5D23" },
  cultural_heritage: { label: "文化遗产", icon: Building, color: "#A8B5A0" },
  marine_area: { label: "海域资源", icon: TreePine, color: "#7B9E6B" },
};

const regionList = ["南沙区", "黄埔区", "番禺区", "天河区", "荔湾区"];

export default function MapPage() {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedResource, setSelectedResource] = useState<number | null>(null);

  const { data: resources } = trpc.map.resources.useQuery({
    region: selectedRegion || undefined,
    resourceType: selectedType || undefined,
  });

  const selected = useMemo(
    () => resources?.find((r) => r.id === selectedResource) ?? null,
    [resources, selectedResource]
  );

  // Simple map visualization with positioned dots
  const mapBounds = {
    minLng: 113.2,
    maxLng: 113.8,
    minLat: 22.4,
    maxLat: 23.2,
  };

  const toPosition = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * 100;
    const y = 100 - ((lat - mapBounds.minLat) / (mapBounds.maxLat - mapBounds.minLat)) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div className="h-[calc(100vh-104px)] -m-6 lg:-m-10 relative">
      {/* Map Area */}
      <div className="absolute inset-0 bg-[#E8E4DB] overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(45,45,45,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(45,45,45,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Water area representation */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#A8B5A0]/20 to-transparent" />

        {/* Region labels */}
        <div className="absolute" style={{ left: "55%", top: "25%" }}>
          <span className="text-xs text-[#6B6B6B]/50 font-medium">南沙区</span>
        </div>
        <div className="absolute" style={{ left: "30%", top: "35%" }}>
          <span className="text-xs text-[#6B6B6B]/50 font-medium">番禺区</span>
        </div>
        <div className="absolute" style={{ left: "40%", top: "15%" }}>
          <span className="text-xs text-[#6B6B6B]/50 font-medium">黄埔区</span>
        </div>

        {/* Resource markers */}
        {resources?.map((r) => {
          const cfg = resourceTypeConfig[r.resourceType] ?? { label: r.resourceType, icon: MapPin, color: "#A8B5A0" };
          const Icon = cfg.icon;
          const pos = toPosition(Number(r.latitude ?? 0), Number(r.longitude ?? 0));
          const isSelected = selectedResource === r.id;

          return (
            <button
              key={r.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                isSelected ? "z-20 scale-125" : "z-10 hover:scale-110"
              }`}
              style={pos}
              onClick={() => setSelectedResource(isSelected ? null : r.id)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  isSelected ? "ring-4 ring-white/50" : ""
                }`}
                style={{ backgroundColor: cfg.color }}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 translate-y-full mt-2 bg-white rounded-2xl shadow-xl p-4 w-56 text-left">
                  <h4 className="font-semibold text-[#2D2D2D] text-sm mb-1">{r.resourceName}</h4>
                  <p className="text-xs text-[#6B6B6B] mb-2">{r.description}</p>
                  <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
                    <MapPin className="w-3 h-3" />
                    {r.region}
                  </div>
                  {r.valueLevel && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: i < r.valueLevel! ? cfg.color : "#E8E4DB",
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Panel */}
      <div className="absolute top-6 left-6 z-30">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-soft p-6 w-64">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-[#4A5D23]" />
            <h3 className="text-sm font-semibold text-[#2D2D2D]">图层控制</h3>
          </div>

          {/* Region filter */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Filter className="w-3 h-3 text-[#6B6B6B]" />
              <span className="text-xs text-[#6B6B6B]">区域</span>
            </div>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full text-sm bg-[#F4F1EA] rounded-xl px-3 py-2 border-0 outline-none text-[#2D2D2D]"
            >
              <option value="">全部区域</option>
              {regionList.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="mb-4">
            <span className="text-xs text-[#6B6B6B] mb-2 block">资源类型</span>
            <div className="space-y-2">
              {Object.entries(resourceTypeConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSelectedType(selectedType === key ? "" : key)}
                  className={`flex items-center gap-2 w-full p-2 rounded-xl transition-colors ${
                    selectedType === key ? "bg-[#A8B5A0]/15" : "hover:bg-[#F4F1EA]"
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cfg.color }}
                  />
                  <span className="text-sm text-[#2D2D2D]">{cfg.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pt-4 border-t border-[rgba(45,45,45,0.1)]">
            <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
              <Info className="w-3 h-3" />
              共 {resources?.length ?? 0} 个资源点位
            </div>
          </div>
        </div>
      </div>

      {/* Detail sidebar */}
      {selected && (
        <div className="absolute top-6 right-6 z-30">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-soft p-6 w-72">
            <div className="flex items-center gap-3 mb-4">
              {(() => {
                const cfg = resourceTypeConfig[selected.resourceType];
                const Icon = cfg?.icon ?? MapPin;
                return (
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: cfg?.color ?? "#A8B5A0" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                );
              })()}
              <div>
                <h3 className="font-semibold text-[#2D2D2D]">{selected.resourceName}</h3>
                <span className="text-xs text-[#6B6B6B]">
                  {resourceTypeConfig[selected.resourceType]?.label ?? selected.resourceType}
                </span>
              </div>
            </div>

            <p className="text-sm text-[#6B6B6B] leading-relaxed mb-4">
              {selected.description}
            </p>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">区域</span>
                <span className="text-[#2D2D2D]">{selected.region}</span>
              </div>
              {selected.valueLevel && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">价值等级</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            i < selected.valueLevel! ? "#A8B5A0" : "#E8E4DB",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {selected.capacity && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">承载能力</span>
                  <span className="text-[#2D2D2D] font-mono">
                    {(selected.capacity / 10000).toFixed(0)}万人次/年
                  </span>
                </div>
              )}
              {selected.annualVisitors && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6B6B]">年访问量</span>
                  <span className="text-[#2D2D2D] font-mono">
                    {(selected.annualVisitors / 10000).toFixed(0)}万人次
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#6B6B6B]">开发状态</span>
                <span className="text-[#2D2D2D]">
                  {selected.developmentStatus === "operational"
                    ? "运营中"
                    : selected.developmentStatus === "developing"
                    ? "开发中"
                    : selected.developmentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
