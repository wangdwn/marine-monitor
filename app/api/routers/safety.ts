import { publicProcedure, router } from "../trpc";
export const safetyRouter = router({
  summary: publicProcedure.query(() => ({
    activeAlerts: 3, warnings: 8, resolved: 156,
    categories: [
      { name: "地质灾害", count: 3, level: "橙色" },
      { name: "风暴潮", count: 2, level: "黄色" },
      { name: "海岸侵蚀", count: 1, level: "蓝色" },
      { name: "水质异常", count: 2, level: "蓝色" },
    ],
    lastUpdate: "2026-07-04 08:30",
  })),
});
