import { User } from "@prisma/client";
import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";

const setJWTToken = async (c: Context, user: User) => {
    const payload = {
        user: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    const secret = c.env.JWT_SECRET;
    const token = await sign(payload, secret);
    setCookie(c, "token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        maxAge: 3600,
        path: "/",
    });
};

export default setJWTToken;
