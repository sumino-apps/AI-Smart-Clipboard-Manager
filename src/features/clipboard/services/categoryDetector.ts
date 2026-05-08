import type { ClipboardCategory } from "../types/clipboard.types";

export type DetectionResult = {
  category: ClipboardCategory;
  confidence: number;
};

const DETECTORS: Array<{
  category: ClipboardCategory;
  test: (input: string) => boolean;
  confidence: number;
}> = [
  {
    category: "otp",
    test: (s) => /^\s*\d{4,8}\s*$/.test(s),
    confidence: 0.95,
  },
  {
    category: "email",
    test: (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s.trim()),
    confidence: 0.99,
  },
  {
    category: "phone",
    test: (s) => /^[\+]?[\d\s\-\(\)]{7,15}$/.test(s.trim()),
    confidence: 0.88,
  },
  {
    category: "link",
    test: (s) => /^https?:\/\/.{3,}/.test(s.trim()),
    confidence: 0.99,
  },
  {
    category: "code",
    test: (s) => {
      const signals = [
        /[{};]/.test(s),
        /\b(const|let|var|function|class|import|export|return|if|for|=>)\b/.test(s),
        /^\s{2,}|\t/m.test(s),
        s.split("\n").length > 2,
      ];
      return signals.filter(Boolean).length >= 2;
    },
    confidence: 0.8,
  },
];

export function detectCategory(content: string): DetectionResult {
  for (const detector of DETECTORS) {
    if (detector.test(content)) {
      return { category: detector.category, confidence: detector.confidence };
    }
  }
  return { category: "text", confidence: 1.0 };
}