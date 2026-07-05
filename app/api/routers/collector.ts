import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const dimensionData: Record<string, { name: string; values: any[] }> = {
  hub: {
    name: "枢纽港数据",
    values: [
      { port: "广州港", throughput: 6.55, unit: "亿吨", year: 2025, rank: 5 },
      { port: "深圳港", throughput: 3.28, unit: "亿吨", year: 2025, rank: 12 },
      { port: "珠海港", throughput: 1.52, unit: "亿吨", year: 2025, rank: 22 },
    ],
  },
  industry: {
    name: "产业经济",
    values: [
      { sector: "船舶海工", output: 680, unit: "亿元", growth: "12.3%" },
      { sector: "海洋旅游", output: 520, unit: "亿元", growth: "18.5%" },
      { sector: "海洋生物医药", output: 180, unit: "亿元", growth: "22.1%" },
      { sector: "海洋新能源", output: 120, unit: "亿元", growth: "35.6%" },
    ],
  },
  population: {
    name: "人口与就业",
    values: [
      { area: "南沙区", population: 120, employees: 45, unit: "万人" },
      { area: "黄埔区", population: 130, employees: 52, unit: "万人" },
      { area: "番禺区", population: 280, employees: 95, unit: "万人" },
    ],
  },
};

export const collectorRouter = router({
  collectionStatus: publicProcedure.query(() => ({
    totalDimensions: 8, activeCollectors: 5, lastCollection: "2026-07-04 06:00",
    sources: [
      { name: "政府公开数据", status: "正常", count: 156 },
      { name: "企业直报", status: "正常", count: 89 },
      { name: "自动采集", status: "部分延迟", count: 234 },
      { name: "人工报送", status: "正常", count: 45 },
    ],
  })),
  dimensionDataStats: publicProcedure.query(() => ({
    totalRecords: 524, dimensions: 8, updatedToday: 32,
    byDimension: [
      { code: "hub", name: "枢纽港", count: 68 },
      { code: "industry", name: "产业经济", count: 120 },
      { code: "population", name: "人口就业", count: 45 },
      { code: "marine_tourism", name: "海洋旅游", count: 78 },
      { code: "ecology", name: "生态环境", count: 56 },
      { code: "policy", name: "政策法规", count: 89 },
      { code: "safety", name: "安全屏障", count: 42 },
      { code: "planning", name: "规划用地", count: 26 },
    ],
  })),
  dimensionDataList: publicProcedure
    .input(z.object({ dimensionCode: z.string(), year: z.number().optional() }))
    .query(({ input }) => {
      return dimensionData[input.dimensionCode]?.values ?? [];
    }),
});
