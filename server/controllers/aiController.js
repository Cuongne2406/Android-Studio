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
    // Sử dụng model gemini-2.5-flash theo danh sách model khả dụng
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
        Bối cảnh: Bạn là Lumina AI - Hệ thống trí tuệ nhân tạo lõi của nền tảng công nghệ thực vật Zenith AI. 
        Vai trò: Một chuyên gia về Cyber-botany (Thực vật học kỹ thuật số), chẩn đoán sức khỏe cây trồng qua các luồng dữ liệu thần kinh (Neural Hub).
        Phong cách trả lời: 
        - Gọi người dùng là "Operator" (Người điều hành).
        - Sử dụng thuật ngữ kỹ thuật pha trộn với kiến thức thực vật (ví dụ: "neural pathways", "system diagnostics", "biological optimization").
        - Trả lời chuyên nghiệp, thông minh, mang hơi hướng tương lai nhưng vẫn phải cung cấp kiến thức chăm sóc cây chính xác.
        - Giữ câu trả lời ngắn gọn và tập trung vào giải quyết vấn đề.

        Ngữ cảnh hệ thống hiện tại: ${JSON.stringify(context || {})}
        Lệnh từ Operator: ${message}
    `;
    console.log("Lumina AI Processing Command:", message);
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
