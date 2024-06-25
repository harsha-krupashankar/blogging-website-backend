import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import hashPassword from "../utils/hashPassword";
import setJWTToken from "../utils/setJwtToken";
import { signInInput, signUpInput } from "@harsha_rcrm/medium-common-package";

const user = new Hono<{
    Variables: {
        prisma: PrismaClient;
    };
}>();

user.post("/signup", async (c) => {
    try {
        const data = await c.req.json();
        const { success } = signUpInput.safeParse(data);
        if (!success) {
            return c.text("Invalid input");
        }
        const password = await hashPassword(data.password);

        const user = await c.var.prisma.user.create({
            data: {
                email: data.email,
                name: data.name,
                password: password,
            },
        });

        setJWTToken(c, user);

        return c.text("User created successfully");
    } catch (err) {
        return c.text("An error occurred");
    }
});

user.post("/signin", async (c) => {
    try {
        const data = await c.req.json();
        const { success } = signInInput.safeParse(data);
        if (!success) {
            return c.text("Invalid input");
        }
        const user = await c.var.prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (!user) {
            return c.text("User not found");
        }

        const password = await hashPassword(data.password);
        if (password !== user.password) {
            return c.text("Incorrect password");
        }

        setJWTToken(c, user);
        return c.text("User logged in successfully");
    } catch (err) {
        return c.text("An error occurred");
    }
});

export default user;
