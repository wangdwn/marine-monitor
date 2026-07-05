import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const reports = [
  { id: 1, title: "2026年广东省海洋经济运行监测季度报告", category: "经济运行", summary: "一季度全省海洋生产总值同比增长8.2%，船舶海工、海洋旅游领涨。", coverUrl: "/reports/cover-cruise-tourism.jpg", fileUrl: "#", views: 1256, date: "2026-06-30", author: "海洋发展促进中心" },
  { id: 2, title: "广州建设国际海洋产业服务之都综合战略报告", category: "战略规划", summary: "对标新加坡、香港，提出广州海洋产业服务能级提升五大路径。", coverUrl: "/reports/cover-investment-analysis.jpg", fileUrl: "#", views: 983, date: "2026-05-20", author: "海洋发展促进中心" },
  { id: 3, title: "粤港澳大湾区海洋碳汇资源调查与产品创新研究", category: "碳汇研究", summary: "珠三角滩涂碳汇潜力评估与交易机制设计。", coverUrl: "", fileUrl: "#", views: 867, date: "2026-04-15", author: "海洋发展促进中心" },
  { id: 4, title: "南沙海洋高端装备双园区招商穿透分析报告", category: "招商分析", summary: "基于产业链图谱的海洋装备招商精准画像。", coverUrl: "", fileUrl: "#", views: 742, date: "2026-06-10", author: "海洋发展促进中心" },
  { id: 5, title: "2025年广州市海洋经济发展统计公报", category: "统计公报", summary: "广州市2025年海洋经济全景数据。", coverUrl: "", fileUrl: "#", views: 610, date: "2026-03-01", author: "广州市海洋局" },
  { id: 6, title: "珠江口海域水质与生态监测年度报告", category: "环境监测", summary: "2025年珠江口海域环境质量评估。", coverUrl: "", fileUrl: "#", views: 489, date: "2026-02-15", author: "生态环境监测中心" },
];

export const reportRouter = router({
  list: publicProcedure
    .input(z.object({ page: z.number().default(1), pageSize: z.number().default(10), category: z.string().optional(), keyword: z.string().optional() }))
    .query(({ input }) => {
      let filtered = reports;
      if (input.category) filtered = filtered.filter(r => r.category === input.category);
      if (input.keyword) filtered = filtered.filter(r => r.title.includes(input.keyword));
      return { items: filtered, total: filtered.length, page: input.page };
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => reports.find(r => r.id === input.id) ?? null),
  incrementView: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => {
      const r = reports.find(r => r.id === input.id);
      if (r) r.views += 1;
      return { success: true, views: r?.views ?? 0 };
    }),
});
