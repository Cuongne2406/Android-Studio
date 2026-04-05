const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Chúng ta sử dụng phiên bản v1beta để liệt kê model
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        console.log("--- DANH SÁCH MODEL KHẢ DỤNG CHO KEY CỦA BẠN ---");
        if (data.models) {
            data.models.forEach(m => {
                console.log(`- Name: ${m.name}, Title: ${m.displayName}`);
            });
        } else {
            console.log("Không tìm thấy model nào hoặc lỗi API Key:", data);
        }
        console.log("-----------------------------------------------");
    } catch (error) {
        console.error("Lỗi khi liệt kê model:", error);
    }
}

listModels();
