const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function listModels() {
    console.log("Listing available models...");
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
        // There is no direct listModels in the simple SDK, but we can try to catch the error
        // or just try another common model name.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent("Hi");
        console.log("gemini-1.5-pro works!");
    } catch (e) {
        console.error("gemini-1.5-pro failed:", e.message);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hi");
        console.log("gemini-pro works!");
    } catch (e) {
        console.error("gemini-pro failed:", e.message);
    }
}

listModels();
