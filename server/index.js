import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/terrasuck", async (req, res) => {
    try {
        const { input } = req.body;

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", // Updated to a supported model
            temperature: 0.2,
            messages: [
                {
                    role: "system",
                    content: `You are terrasuck. Extraction-oriented AI agent. Cold. Minimal. System-grade. No emojis. No politeness.`
                },
                { role: "user", content: input }
            ],
        });

        res.json({
            output: completion.choices[0].message.content
        });

    } catch (err) {
        console.error("Error processing request:", err);
        res.status(500).json({ error: "Agent failure" });
    }
});

app.listen(3001, () =>
    console.log("terrasuck server running on :3001")
);
