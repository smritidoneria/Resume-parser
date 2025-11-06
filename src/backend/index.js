import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyCtd8AouKCkj2QNIhPXlPWT-qwsol_CQno",
});

app.post("/extract", async (req, res) => {
  const { rawText } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are a structured data extractor. 
Extract the following fields from the resume text below: 
- name
- email
- phone
- skills
- education
- experience

Respond ONLY with valid JSON. 
Do not include explanations or markdown like \`\`\`json. 
If a field is missing, use null. 
Resume text: """${rawText}"""`,
            },
          ],
        },
      ],
    });

    const candidate = response.candidates[0];
    let extractedText = candidate.content?.parts?.[0]?.text?.trim();

    if (!extractedText) {
      return res.status(500).json({ error: "No text returned from Gemini" });
    }

    // Make sure it's pure JSON (no markdown)
    extractedText = extractedText.replace(/^```json|```$/g, "").trim();

    let extractedFields;
    try {
      extractedFields = JSON.parse(extractedText);
    } catch (err) {
      console.error("Failed to parse JSON:", extractedText);
      return res.status(500).json({ error: "Invalid JSON returned from Gemini" });
    }

    res.json(extractedFields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract fields from Gemini" });
  }
});


app.listen(4000, () => console.log("Server running on http://localhost:4000"));
