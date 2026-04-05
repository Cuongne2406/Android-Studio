const { GoogleGenerativeAI } = require("@google/generative-ai");
const asyncHandler = require("express-async-handler");

const chatWithAI = asyncHandler(async (req, res) => {
    console.log("AI Chat Request Received. Body:", JSON.stringify(req.body));
    
    if (!req.body || !req.body.message) {
        console.error("Missing message in request body");
        return res.status(400).json({ message: "Vui lòng nhập tin nhắn." });
    }

    const { message, context } = req.body;

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
        console.error("GEMINI_API_KEY is missing or placeholder");
        return res.status(500).json({ message: "Gemini API Key chưa được cấu hình." });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Sử dụng model gemini-2.5-flash theo danh sách khả dụng từ API Key của bạn
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: 'v1' });

    const prompt = `
        Bạn là một trợ lý ảo thông minh của ứng dụng quản lý sinh viên LHU Pro. 
        Hãy trả lời câu hỏi của sinh viên một cách thân thiện, chuyên nghiệp và ngắn gọn.
        Ngữ cảnh hiện tại: ${JSON.stringify(context || {})}
        Câu hỏi của sinh viên: ${message}
    `;
    console.log("AI Chat Request:", message);
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });
    } catch (error) {
        console.error("AI Service Error Details:", error);
        res.status(500);
        throw new Error("AI Service Error: " + (error.message || "Unknown error"));
    }
});

module.exports = { chatWithAI };
