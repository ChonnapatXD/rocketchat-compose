import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(express.json());

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.post("/rocketchat", async (req, res) => {
  const text = req.body.text;

  if (!text) return res.sendStatus(200);

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "คุณคือ chatbot ใน Rocket.Chat ตอบเป็นภาษาไทย" },
        { role: "user", content: text }
      ],
    });

    res.json({
      text: completion.choices[0].message.content
    });

  } catch (err) {
    console.error("🔥 Groq error:", err);
    res.json({ text: "❌ Bot error (Groq)" });
  }
});

app.listen(4000, () => {
  console.log("🤖 Bot listening on port 4000");
});