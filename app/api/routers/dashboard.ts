import { publicProcedure, router } from "../trpc";
import { z } from "zod";

export const dashboardRouter = router({
  summary: publicProcedure.query(() => ({
    marineEconomy: { total: 5231, unit: "亿元", year: 2025, growth: "8.2%" },
    trackCount: 12, policyCount: 46, reportCount: 28, surveyPointCount: 156,
    gdpRatio: "16.3%", lastUpdate: "2026-07-04",
  })),
  trendChart: publicProcedure
    .input(z.object({ trackType: z.string().default("marine_tourism"), years: z.number().default(5) }))
    .query(({ input }) => ({
      labels: ["2021","2022","2023","2024","2025"],
      values: input.trackType === "marine_tourism" ? [320,380,450,520,620] :
              input.trackType === "ship_engineering" ? [180,210,260,310,380] :
              [100,120,140,160,180],
    })),
  trackDistribution: publicProcedure.query(() => [
    { name: "船舶海工", value: 28 }, { name: "海洋旅游", value: 22 },
    { name: "港口航运", value: 18 }, { name: "海洋生物医药", value: 12 },
    { name: "海洋新能源", value: 10 }, { name: "海洋渔业", value: 10 },
  ]),
  cityComparison: publicProcedure.query(() => [
    { city: "广州", marineGDP: 5231, ratio: "16.3%" },
    { city: "深圳", marineGDP: 3800, ratio: "11.5%" },
    { city: "珠海", marineGDP: 1200, ratio: "28.1%" },
    { city: "香港", marineGDP: 2100, ratio: "8.3%" },
  ]),
  latestPolicies: publicProcedure.query(() => [
    { id: 1, title: "广东省粤港澳游艇自由行管理办法", date: "2026-06-18", source: "粤府办〔2026〕10号", level: "省级" },
    { id: 2, title: "广州市海洋经济发展十五五规划（征求意见稿）", date: "2026-06-03", source: "广州市海洋局", level: "市级" },
    { id: 3, title: "国务院批复粤港澳大湾区调整实施行政法规", date: "2026-05-29", source: "国务院", level: "国家级" },
    { id: 4, title: "南沙发布游艇十二条", date: "2026-06-25", source: "南沙区政府", level: "区级" },
  ]),
  hotReports: publicProcedure.query(() => [
    { id: 1, title: "2026年广东省海洋经济运行监测季度报告", views: 1256, category: "经济运行", date: "2026-06-30" },
    { id: 2, title: "广州建设国际海洋产业服务之都综合战略报告", views: 983, category: "战略规划", date: "2026-05-20" },
    { id: 3, title: "粤港澳大湾区海洋碳汇资源调查与产品创新研究", views: 867, category: "碳汇研究", date: "2026-04-15" },
    { id: 4, title: "南沙海洋高端装备双园区招商穿透分析报告", views: 742, category: "招商分析", date: "2026-06-10" },
  ]),
});
