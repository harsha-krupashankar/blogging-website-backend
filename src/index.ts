import { Hono } from "hono";
import { blog } from "./routes/blog.route";
import handleAuth from "./middlewares/handleAuth";
import setPrismaClient from "./middlewares/setPrismaClient";
import user from "./routes/user.route";

const app = new Hono();

app.use(setPrismaClient);

app.use("/api/v1/blogs/*", handleAuth);

app.route("/api/v1/blogs", blog);
app.route("/api/v1/users", user);

export default app;
