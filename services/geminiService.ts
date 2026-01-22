import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, ImageResolution } from "../types";

// Helper to check API Key selection for paid features
export const checkApiKey = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    return hasKey;
  }
  return true; // Fallback for environments where window.aistudio isn't injected, assuming env var exists
};

export const promptApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  } else {
    alert("Vui lòng đảm bảo bạn đã cấu hình API Key.");
  }
};

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");
  return new GoogleGenAI({ apiKey });
};

export const analyzeContent = async (
  fileData: string | null,
  mimeType: string | null,
  textPrompt: string
): Promise<AnalysisResult> => {
  const ai = getAI();
  
  const parts: any[] = [{ text: `
    Bạn là Vipaii, một trợ lý học tập AI thông thái và tận tâm.
    
    Nhiệm vụ: Phân tích tài liệu, hình ảnh, câu hỏi HOẶC file GHI ÂM (Audio) được cung cấp.
    
    Đặc biệt với file Audio Ghi âm: 
    - Hãy lắng nghe kỹ nội dung cuộc hội thoại hoặc bài giảng.
    - Trích xuất các ý chính, luận điểm quan trọng.
    
    QUAN TRỌNG VỀ ĐỊNH DẠNG (FORMATTING):
    - Với các công thức Toán học, Vật lý, Hóa học... BẮT BUỘC sử dụng định dạng LaTeX.
    - Công thức nằm cùng dòng văn bản (inline) hãy bao quanh bởi dấu $. Ví dụ: $E=mc^2$.
    - Công thức nằm riêng dòng (block) hãy bao quanh bởi dấu $$. Ví dụ: $$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$$.
    - Trình bày rõ ràng, mạch lạc.
    
    Yêu cầu đầu ra (BẮT BUỘC trả về JSON thuần túy theo schema):
    1. summary: Tóm tắt nội dung chính (viết thành đoạn văn hay, súc tích, dễ nhớ, giọng văn báo chí học thuật).
    2. keywords: Danh sách 5-7 từ khóa/thuật ngữ quan trọng nhất.
    3. explanation: Hãy chia nhỏ phần giải thích thành các mục rõ ràng (Mảng các đối tượng). 
       - Ví dụ nếu là bài tập: Mục 1: "Đề bài/Giả thiết", Mục 2: "Phân tích/Phương pháp", Mục 3: "Lời giải chi tiết", Mục 4: "Kết luận/Đáp án".
       - Nếu là tài liệu lý thuyết: Mục 1: "Khái niệm", Mục 2: "Định lý", Mục 3: "Ứng dụng".
       - Hãy trình bày khoa học, tách bạch giữa câu hỏi và đáp án.
    4. examples: 3-4 ví dụ cụ thể, thực tế để áp dụng bài học.
    
    Input của người dùng: ${textPrompt}
  ` }];

  if (fileData && mimeType) {
    parts.push({
      inlineData: {
        data: fileData,
        mimeType: mimeType,
      },
    });
  }

  // Sử dụng model gemini-3-flash-preview cho cả text, hình ảnh và file âm thanh (multimodal)
  const modelName = 'gemini-3-flash-preview';

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts },
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING, description: "Tóm tắt nội dung bài học súc tích, dễ hiểu như một bản tin." },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Các từ khóa/thuật ngữ chính." },
          explanation: { 
            type: Type.ARRAY, 
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Tiêu đề của mục (VD: Câu hỏi, Lời giải, Giải thích)." },
                content: { type: Type.STRING, description: "Nội dung chi tiết của mục, chứa công thức LaTeX." }
              },
              required: ["title", "content"]
            },
            description: "Chi tiết nội dung bài học được chia thành các phần nhỏ." 
          },
          examples: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Các ví dụ minh họa thực tế." }
        },
        required: ["summary", "keywords", "explanation", "examples"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as AnalysisResult;
  }
  throw new Error("Không thể phân tích nội dung.");
};

export const streamChatResponse = async function* (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
) {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history,
    config: {
      systemInstruction: "Bạn là Vipaii, một trợ lý ảo học tập thông minh, vui tính, mang không khí Tết 2026. Hãy sử dụng LaTeX ($...$) cho công thức toán học.",
    }
  });

  const result = await chat.sendMessageStream({ message: newMessage });
  for await (const chunk of result) {
    yield chunk.text;
  }
};

export const generateStudyImage = async (prompt: string, resolution: ImageResolution): Promise<string> => {
  const ai = getAI();
  // Use gemini-3-pro-image-preview for high quality images and size control
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
        imageSize: resolution
      },
    },
  });

  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
      }
    }
  }

  throw new Error("Không thể tạo hình ảnh. Vui lòng thử lại.");
};