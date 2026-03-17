export type CoverLetterStyle = "formal" | "conversational" | "creative";
export type CoverLetterLanguage = "english" | "indonesian";

export interface CoverLetter {
  _id: string;
  userId: string;
  jobId?: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  content: string;
  style: CoverLetterStyle;
  language: CoverLetterLanguage;
  isEdited: boolean;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateCoverLetterDTO {
  jobId?: string;
  companyName: string;
  jobTitle: string;
  jobDescription?: string;
  style: CoverLetterStyle;
  language: CoverLetterLanguage;
}
