import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const policies = [
  { id: 1, title: "广东省粤港澳游艇自由行管理办法", source: "广东省人民政府办公厅", level: "省级", date: "2026-06-18", content: "24条管理办法，有效期5年。港澳游艇可申请电子临时船舶国籍证书，免担保通关，南沙客运港为指定口岸之一。", category: "游艇产业" },
  { id: 2, title: "广州市海洋经济发展十五五规划（征求意见稿）", source: "广州市海洋局", level: "市级", date: "2026-06-03", content: "到2030年海洋生产总值突破7300亿元，海洋新兴产业规模达220亿元。提出三大海洋创新区布局。", category: "海洋经济" },
  { id: 3, title: "国务院批复粤港澳大湾区调整实施行政法规", source: "国务院", level: "国家级", date: "2026-05-29", content: "在大湾区内地九市调整实施《海关事务担保条例》《船舶登记条例》，对港澳游艇免担保免登记。", category: "大湾区" },
  { id: 4, title: "广东省十五五规划纲要", source: "广东省政府", level: "省级", date: "2026-04-28", content: "将海洋经济作为重点发展领域，提出建设海洋强省目标。", category: "综合规划" },
  { id: 5, title: "南沙自贸区游艇产业发展十二条", source: "南沙区政府", level: "区级", date: "2026-06-25", content: "聚焦研发制造、消费需求、运营服务、配套保障四大方面。大湾区国际游艇产业联盟成立，约60家单位。", category: "游艇产业" },
  { id: 6, title: "求是：推动海洋经济高质量发展", source: "习近平", level: "国家级", date: "2026-03-16", content: "强调海洋是高质量发展战略要地，加快海洋科技创新步伐。", category: "海洋经济" },
  { id: 7, title: "海南自贸港交通工具及游艇零关税政策调整", source: "财政部/海关总署/税务总局", level: "国家级", date: "2023-08-15", content: "新增22项商品至零关税清单，累计进口零关税游艇130艘，减免税款2.7亿元。", category: "游艇产业" },
];

export const policyRouter = router({
  list: publicProcedure
    .input(z.object({ page: z.number().default(1), pageSize: z.number().default(10), level: z.string().optional(), category: z.string().optional() }))
    .query(({ input }) => {
      let filtered = policies;
      if (input.level) filtered = filtered.filter(p => p.level === input.level);
      if (input.category) filtered = filtered.filter(p => p.category === input.category);
      return { items: filtered, total: filtered.length, page: input.page };
    }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => policies.find(p => p.id === input.id) ?? null),
});
