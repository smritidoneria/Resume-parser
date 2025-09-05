import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: "AIzaSyBJcL6jpbkN1Xgj0IKwYYuzby7mL08Xl8M",
});

app.post("/extract", async (req, res) => {
  const { rawText } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        `Extract the following fields from this resume text: 
         name, email, phone, skills, education, experience.
         Return JSON only.
         Resume:
         ${rawText}`,
      ],
    });
    const candidate = response.candidates[0];

    // candidate.content.parts[0] is an object, get its text property
    let extractedText = candidate.content?.parts?.[0]?.text;

    if (!extractedText) {
      console.error("No text returned from Gemini:", candidate);
      return res.status(500).json({ error: "No text returned from Gemini" });
    }

    // Remove code block markers if present
    extractedText = extractedText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let extractedFields;
    try {
      extractedFields = JSON.parse(extractedText);
      console.log("Extracted fields:", extractedFields);
    } catch (err) {
      console.error("Failed to parse JSON from Gemini:", extractedText, err);
      return res
        .status(500)
        .json({ error: "Invalid JSON returned from Gemini" });
    }

    res.json(extractedFields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract fields from Gemini" });
  }
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
