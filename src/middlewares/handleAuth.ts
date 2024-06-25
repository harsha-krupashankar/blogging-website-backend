import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const handleAuth = async (c: Context, next: Next) => {
    const token = getCookie(c, "token");
    if (!token) {
        return c.text("Need auth");
    }

    const secret = c.env.JWT_SECRET;
    const payload = await verify(token, secret);
    if (!payload) {
        return c.text("Need auth");
    }

    c.set("userId", payload.user as string);
    await next();
};

export default handleAuth;
