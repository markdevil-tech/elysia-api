import { Elysia, t } from "elysia";
import { getPosts, createPost, getPostById, updatePost, deletePost } from "../controllers/PostController";
import { apiKeyMiddleware } from "../middlewares/auth"; // Import middleware

const PostRoutes = new Elysia({ prefix: "/posts" })
    
    // Gunakan middleware API key sebelum menangani request
    .onBeforeHandle(apiKeyMiddleware)
    
    // Route get all posts
    .get("/", () => getPosts())
    
    // Route create post with image upload
    .post("/", async ({ body }) => createPost(body as { title: string; description: string; price: string; stock: string; file: File }), {
        body: t.Object({
            title: t.String({ minLength: 3, maxLength: 100 }),
            description: t.String({ minLength: 3 }),
            price: t.String(),
            stock: t.String(),
            file: t.File(), // Menyertakan file untuk upload gambar
        }),
    })
    
    // Route get post by id
    .get("/:id", ({ params: { id } }) => getPostById(id))
    
    // Route update post
    .patch("/:id", ({ params: { id }, body }) => updatePost(id, body as { title?: string; description?: string; price?: string; stock?: string; image?: string }), {
        body: t.Object({
            title: t.Optional(t.String({ minLength: 3, maxLength: 100 })),
            description: t.Optional(t.String({ minLength: 3 })),
            price: t.Optional(t.String()),
            stock: t.Optional(t.String()),
            image: t.Optional(t.String()), // Hanya menyimpan nama file gambar
        }),
    })
    
    // Route delete post
    .delete("/:id", ({ params: { id } }) => deletePost(id));

export default PostRoutes;
