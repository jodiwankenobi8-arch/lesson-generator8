export type BestStandardRow = {
  code: string;
  description: string;
  grade: "K" | "1" | "2" | "3" | "4" | "5";
  subject: "ELA" | "Math" | "Science" | "SS";
  keywords?: string[];
};
