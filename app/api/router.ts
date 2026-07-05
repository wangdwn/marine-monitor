import { router } from "./trpc";
import { authRouter } from "./routers/auth";
import { dashboardRouter } from "./routers/dashboard";
import { surveyRouter } from "./routers/survey";
import { planningRouter } from "./routers/planning";
import { safetyRouter } from "./routers/safety";
import { collectorRouter } from "./routers/collector";
import { reportRouter } from "./routers/report";
import { policyRouter } from "./routers/policy";

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  survey: surveyRouter,
  planning: planningRouter,
  safety: safetyRouter,
  collector: collectorRouter,
  report: reportRouter,
  policy: policyRouter,
});

export type AppRouter = typeof appRouter;
