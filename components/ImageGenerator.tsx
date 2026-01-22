import React, { useState } from 'react';
import { generateStudyImage, checkApiKey, promptApiKeySelection } from '../services/geminiService';
import { ImageResolution } from '../types';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>('1K');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    // Check API Key for Paid Feature
    const hasKey = await checkApiKey();
    if (!hasKey) {
      await promptApiKeySelection();
      // Race condition handling: Assume success after prompting, do not recheck immediately.
    }

    setLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Image = await generateStudyImage(prompt, resolution);
      setGeneratedImage(base64Image);
    } catch (err: any) {
      console.error(err);
      
      // Error handling for missing/invalid key or race condition failure
      if (err.message && err.message.includes("Requested entity was not found")) {
        await promptApiKeySelection();
        setError("Vui lòng chọn lại API Key (Paid Project) để tiếp tục.");
      } else {
        const errorMessage = err.message || "Có lỗi xảy ra khi tạo ảnh. Vui lòng thử lại.";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-yellow-500 overflow-hidden transform transition-all duration-500">
       {/* Header style đồng bộ với phần Result */}
       <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 border-b-4 border-red-600 relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/oriental-tiles.png')]"></div>
          <h2 className="text-2xl font-bold text-red-900 text-center font-tet uppercase tracking-wider relative z-10">
            Minh Họa Bài Học
          </h2>
       </div>
       
       <div className="p-6 md:p-8 space-y-6 relative">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full opacity-20 -z-0"></div>

          {/* Prompt Input */}
          <div className="relative z-10">
            <label className="block text-sm font-bold text-red-800 mb-2 uppercase tracking-wide">
              1. Mô tả hình ảnh cần tạo
            </label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full border-2 border-red-200 bg-white rounded-xl p-4 focus:ring-4 focus:ring-yellow-200 focus:border-red-500 outline-none transition-all placeholder-red-200 text-slate-700"
              placeholder="Ví dụ: Vẽ sơ đồ tư duy về văn học Việt Nam trung đại, phong cách nghệ thuật..."
              rows={3}
            />
          </div>

          {/* Resolution Select */}
          <div className="relative z-10">
             <label className="block text-sm font-bold text-red-800 mb-2 uppercase tracking-wide">
               2. Chất lượng ảnh
             </label>
             <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value as ImageResolution)}
                className="w-full md:w-1/3 border-2 border-red-200 bg-white rounded-xl p-3 focus:ring-4 focus:ring-yellow-200 focus:border-red-500 outline-none text-slate-700 font-medium cursor-pointer"
              >
                <option value="1K">1K (Tiêu chuẩn)</option>
                <option value="2K">2K (Cao cấp)</option>
                <option value="4K">4K (Siêu nét)</option>
              </select>
          </div>

          {/* Button */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt}
            className="relative z-10 w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-yellow-100 font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-3 text-lg border border-yellow-500 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
               <span className="flex items-center justify-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-yellow-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 Đang vẽ tranh ngày Tết...
               </span>
            ) : (
                <>
                  <span className="group-hover:animate-bounce">🎨</span> Tạo Hình Ảnh Ngay
                </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm border border-red-200 flex items-start gap-2 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Result Image */}
          {generatedImage && (
            <div className="mt-8 relative animate-fade-in-up">
               {/* Decorative background for image */}
               <div className="absolute inset-0 bg-yellow-400 transform rotate-1 rounded-2xl opacity-20 scale-105"></div>
               
               <div className="relative border-4 border-yellow-500 p-3 rounded-2xl bg-white shadow-xl">
                 <img src={generatedImage} alt="AI Generated" className="w-full h-auto rounded-xl shadow-inner object-cover" />
                 
                 {/* Badge */}
                 <div className="absolute top-0 right-0 p-3">
                    <span className="bg-red-600 text-yellow-100 text-xs font-bold px-3 py-1 rounded-full shadow-md border-2 border-yellow-400">
                        ✨ Vipaii AI Art
                    </span>
                 </div>
               </div>
               
               <div className="text-center mt-4">
                  <p className="text-red-800/80 text-sm font-hand italic">
                    " Chúc bạn học tốt!"
                  </p>
                  <a 
                    href={generatedImage} 
                    download={`vipaii-art-${Date.now()}.png`}
                    className="inline-flex items-center gap-2 mt-2 text-red-600 hover:text-red-800 font-bold text-sm hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Tải ảnh về máy
                  </a>
               </div>
            </div>
          )}
       </div>
    </div>
  );
};
