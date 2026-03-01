const express = require('express');
const { callGemini } = require('./GeminiService'); // Importing the brain you built today!

const app = express();
const PORT = 3000;

// This line is CRITICAL: It allows your server to read the JSON sent from Postman/Frontend
app.use(express.json()); 

// Your first API Endpoint
app.post('/api/generate-outfit', async (req, res) => {
    console.log("📥 Received a request from the frontend/Postman!");
    
    try {
        // Grab the data from the request body
        const { userPrompt, userProfile, userWardrobe } = req.body;

        // Build the prompt using the data
        const prompt = `
            You are an expert personal stylist AI of the same age as user.
            User Profile: ${JSON.stringify(userProfile)}
            Wardrobe Inventory: ${JSON.stringify(userWardrobe)}
            Requested Mood/Occasion: ${userPrompt}

            Task: Generate exactly 3 distinct complete outfit combinations.
            Return ONLY a raw, valid JSON array containing exactly 3 objects with keys:
            outfit_name, item_ids, styling_explanation, confidence_score.
        `;

        // Call your AI Service
        console.log("🧠 Thinking...");
        const rawResponse = await callGemini('gemini-2.5-flash', prompt);
        
        // Send the AI's answer back to the frontend
        const outfitData = JSON.parse(rawResponse);
        console.log("✅ Sending outfit data back!");
        res.status(200).json({ success: true, data: outfitData });

    } catch (error) {
        console.error("❌ Endpoint Error:", error.message);
        res.status(500).json({ success: false, message: "Failed to generate outfit" });
    }
});

// Turn the server on
app.listen(PORT, () => {
    console.log(`🚀 AuraFit Backend is alive and listening on http://localhost:${PORT}`);
});