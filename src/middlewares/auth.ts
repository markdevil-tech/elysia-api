import { Context } from "elysia";
import "dotenv/config"; // Load .env file

const API_KEY = process.env.API_KEY || "default-secret-key"; // Ambil API key dari .env

export const apiKeyMiddleware = async ({ request }: Context) => {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey || apiKey !== API_KEY) {
        return new Response(JSON.stringify({ error: "Invalid API Key" }), {
            status: 403,
            headers: { "Content-Type": "application/json" },
        });
    }
};
