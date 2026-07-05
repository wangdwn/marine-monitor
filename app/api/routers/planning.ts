import { publicProcedure, router } from "../trpc";
export const planningRouter = router({
  summary: publicProcedure.query(() => ({
    totalProjects: 42, approved: 28, pending: 8, rejected: 6,
    categories: [
      { name: "用海审批", count: 15 }, { name: "海洋功能区划", count: 8 },
      { name: "产业规划", count: 10 }, { name: "生态保护", count: 9 },
    ],
    areaTotal: "3,520公顷", areaUsed: "2,180公顷",
  })),
});
