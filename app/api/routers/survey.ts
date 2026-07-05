import { publicProcedure, router } from "../trpc";
export const surveyRouter = router({
  summary: publicProcedure.query(() => ({
    totalPoints: 156, completedSurveys: 89, ongoing: 34, planned: 33,
    categories: [
      { name: "海域使用", count: 45 }, { name: "海岛调查", count: 23 },
      { name: "海岸线", count: 32 }, { name: "地质环境", count: 28 }, { name: "生态湿地", count: 28 },
    ],
  })),
});
