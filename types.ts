export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface ExplanationPart {
  title: string;
  content: string;
}

export interface AnalysisResult {
  summary: string;
  keywords: string[];
  explanation: string | ExplanationPart[];
  examples: string[];
}

export interface UploadedFile {
  data: string; // Base64
  mimeType: string;
  name: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  fileName?: string;
  result: AnalysisResult;
}

export type ImageResolution = '1K' | '2K' | '4K';