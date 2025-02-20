// Import prisma client
import { PrismaClient } from "@prisma/client";
// import prisma from "../../prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";
const prisma = new PrismaClient();
/**
 * Getting all posts
 */
export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({ orderBy: { id: 'desc' } });

        return {
            success: true,
            message: "List Data Posts!",
            data: posts,
        };
    } catch (e: unknown) {
        console.error(`Error getting posts: ${e}`);
    }
}

/**
 * Creating a post
 */
export async function createPost(options: { title: string; description: string; price: string; stock: string; file: File }) {
    try {
        const { title, description, price, stock, file } = options;

        // Konversi file ke buffer
        const fileBuffer = await file.arrayBuffer();
        const uint8Arr = new Uint8Array(fileBuffer);
        const buffer = Buffer.from(uint8Arr);

        // Tentukan path penyimpanan file
        const uploadDir = "./uploads";
        const filePath = path.join(uploadDir, file.name);

        // Simpan file ke sistem
        await writeFile(filePath, buffer);

        // Simpan data post ke database dengan nama file
        const post = await prisma.post.create({
            data: {
                title,
                description,
                price,
                stock,
                image: file.name, // Hanya menyimpan nama file
            },
        });

        return {
            success: true,
            message: "Post Created Successfully!",
            data: post,
        };
    } catch (e: unknown) {
        console.error(`Error creating post: ${e}`);
    }
}

/**
 * Getting a post by ID
 */
export async function getPostById(id: string) {
    try {
        const postId = parseInt(id);

        const post = await prisma.post.findUnique({
            where: { id: postId },
        });

        if (!post) {
            return {
                success: false,
                message: "Detail Data Post Not Found!",
                data: null,
            }
        }

        return {
            success: true,
            message: `Detail Data Post By ID : ${id}`,
            data: post,
        }
    } catch (e: unknown) {
        console.error(`Error finding post: ${e}`);
    }
}

/**
 * Updating a post
 */
export async function updatePost(id: string, options: { title?: string; description?: string; price?: string; stock?: string; image?: string }) {
    try {
        const postId = parseInt(id);
        const { title, description, price, stock, image } = options;

        const post = await prisma.post.update({
            where: { id: postId },
            data: {
                ...(title ? { title } : {}),
                ...(description ? { description } : {}),
                ...(price ? { price } : {}),
                ...(stock ? { stock } : {}),
                ...(image ? { image } : {}),
            },
        });

        return {
            success: true,
            message: "Post Updated Successfully!",
            data: post,
        }
    } catch (e: unknown) {
        console.error(`Error updating post: ${e}`);
    }
}

/**
 * Deleting a post
 */
export async function deletePost(id: string) {
    try {
        const postId = parseInt(id);

        // Ambil data post untuk mendapatkan nama file gambar
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: { image: true }, // Hanya mengambil field `image`
        });

        if (!post) {
            return {
                success: false,
                message: "Post not found!",
            };
        }

        // Path file yang akan dihapus
        const imagePath = path.join(process.cwd(), "uploads", post.image);
        console.log("Trying to delete file at:", imagePath); // Debugging

        // Cek apakah file ada sebelum dihapus
        if (fs.existsSync(imagePath)) {
            try {
                await fs.promises.unlink(imagePath);
                console.log("File deleted:", imagePath);
            } catch (error) {
                console.error("Failed to delete file:", error);
            }
        } else {
            console.warn("File not found:", imagePath);
        }

        // Hapus post dari database
        await prisma.post.delete({
            where: { id: postId },
        });

        return {
            success: true,
            message: "Post and Image Deleted Successfully!",
        };
    } catch (e: unknown) {
        console.error(`Error deleting post: ${e}`);
        return {
            success: false,
            message: "Failed to delete post!",
        };
    }
}
