import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import workpool from "@convex-dev/workpool/convex.config";
import actionRetrier from "@convex-dev/action-retrier/convex.config";
import workflow from "@convex-dev/workflow/convex.config";

const app = defineApp();
app.use(betterAuth);
app.use(workpool);
app.use(actionRetrier);
app.use(workflow);

export default app;
