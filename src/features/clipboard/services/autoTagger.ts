const TAG_RULES: Array<{ tag: string; test: (content: string) => boolean }> = [
  { tag: "github", test: (s) => /github\.com/.test(s) },
  { tag: "youtube", test: (s) => /(youtube\.com|youtu\.be)/.test(s) },
  { tag: "npm", test: (s) => /npmjs\.com|npm install|pnpm add|yarn add/.test(s) },
  {
    tag: "json",
    test: (s) => {
      try {
        JSON.parse(s);
        return s.trim().startsWith("{") || s.trim().startsWith("[");
      } catch {
        return false;
      }
    },
  },
  { tag: "sql", test: (s) => /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|CREATE|DROP)\b/i.test(s) },
  { tag: "base64", test: (s) => /^[A-Za-z0-9+/]{20,}={0,2}$/.test(s.trim()) },
  {
    tag: "uuid",
    test: (s) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s.trim()),
  },
  { tag: "markdown", test: (s) => /^#{1,6}\s|^\*\*|^- \[|\*\*.*\*\*/.test(s) },
  { tag: "multiline", test: (s) => s.split("\n").length > 5 },
  { tag: "long", test: (s) => s.length > 500 },
  { tag: "short", test: (s) => s.trim().length <= 20 },
  { tag: "google", test: (s) => /google\.com/.test(s) },
  { tag: "twitter", test: (s) => /(twitter\.com|x\.com)/.test(s) },
  {
    tag: "command",
    test: (s) => /^(npm|yarn|pnpm|git|sudo|cd|ls|curl|wget|docker|python|node)\s/.test(s.trim()),
  },
  { tag: "env-var", test: (s) => /^[A-Z_]{2,}=.+/.test(s.trim()) },
  { tag: "color-hex", test: (s) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s.trim()) },
  { tag: "ts", test: (s) => /interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|void)/.test(s) },
  { tag: "react", test: (s) => /(import React|from "react"|from 'react'|jsx|tsx|<\/\w+>)/.test(s) },
];

export function generateTags(content: string): string[] {
  return TAG_RULES.filter((rule) => rule.test(content))
    .map((rule) => rule.tag)
    .slice(0, 4);
}