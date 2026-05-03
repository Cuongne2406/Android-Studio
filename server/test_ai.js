const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
dotenv.config();

async function testGemini() {
    console.log("Testing Gemini API connection...");
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("No API key found in .env");
        return;
    }
    console.log("API Key found: " + apiKey.substring(0, 10) + "...");

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you online?");
        const response = await result.response;
        console.log("Response successful!");
        console.log("Reply:", response.text());
    } catch (error) {
        console.error("Gemini API Error:");
        console.error(error);
    }
}

testGemini();
