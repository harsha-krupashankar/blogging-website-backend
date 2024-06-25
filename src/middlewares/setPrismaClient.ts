import { Context, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";

const setPrismaClient = async (c: Context, next: Next) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    });

    c.set("prisma", prisma);
    await next();
};

export default setPrismaClient;
