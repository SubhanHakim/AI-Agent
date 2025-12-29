import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Single Model Focus: The Real GPT-5.2
const TARGET_MODEL = "gpt-5.2";

const handleTerrasuck = async (req, res) => {
    try {
        const { input, image, systemPrompt } = req.body;

        // Construct User Message (Text OR Text + Image)
        let userContent = [{ type: "text", text: input }];

        if (image) {
            userContent.push({
                type: "image_url",
                image_url: {
                    url: image, // Base64 Data URL
                    detail: "auto"
                }
            });
        }

        // Use 'input' string directly if no image (legacy compatibility), or array if image exists
        const finalUserMessage = image ? userContent : input;

        // Use gpt-4o for Vision tasks to ensure compatibility, gpt-5.2 for pure text intelligence
        const activeModel = image ? "gpt-4o" : TARGET_MODEL;

        const completion = await client.chat.completions.create({
            model: activeModel, // Assumes GPT-5.2 supports vision, otherwise usage gpt-4o recommended
            messages: [
                {
                    role: "system",
                    content: systemPrompt || "You are NEXORA. Extraction-oriented AI agent. Cold. Minimal. System-grade. Running on GPT-5.2 Core."
                },
                { role: "user", content: finalUserMessage }
            ],
            temperature: 0.2, // GPT-5.2 precision
        });

        res.json({
            model_used: "gpt-5.2", // Branding output as requested
            output: completion.choices[0].message.content
        });

    } catch (err) {
        console.error("API Error:", err);
        res.status(500).json({ error: "Agent failure" });
    }
};

app.post("/api/terrasuck", handleTerrasuck);
app.post("/terrasuck", handleTerrasuck);

app.get("/api", (_, res) => {
    res.send("Terrasuck Backend Operational (GPT-5.2 Mode)");
});

export default app;
