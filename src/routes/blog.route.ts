import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import {
    createBlogInput,
    updateBlogInput,
} from "@harsha_rcrm/medium-common-package";

export const blog = new Hono<{
    Variables: {
        userId: string;
        prisma: PrismaClient;
    };
}>();

blog.post("/", async (c) => {
    try {
        const data = await c.req.json();
        const { success } = createBlogInput.safeParse(data);
        if (!success) {
            return c.text("Invalid input");
        }
        const post = await c.var.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                published: data.published,
                author: {
                    connect: {
                        id: c.var.userId,
                    },
                },
            },
        });

        return c.json({ id: post.id, message: "Post created successfully" });
    } catch (err) {
        return c.text("An error occurred");
    }
});

blog.patch("/:id", async (c) => {
    const postId = c.req.param("id");
    const data = await c.req.json();
    const { success } = updateBlogInput.safeParse(data);
    if (!success) {
        return c.text("Invalid input");
    }
    const updatedPost = await c.var.prisma.post.update({
        where: {
            id: postId,
        },
        data,
    });
    if (!updatedPost) {
        return c.text("POST NOT FOUND");
    }
    return c.json({ post: updatedPost, message: "Post updated successfully" });
});

blog.get("/:id", async (c) => {
    const postId = c.req.param("id");
    const post = await c.var.prisma.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!post) {
        return c.text("POST NOT FOUND");
    }
    return c.json(post);
});

blog.get("/", async (c) => {
    const posts = await c.var.prisma.post.findMany({
        where: { published: true },
    });
    return c.json(posts);
});
