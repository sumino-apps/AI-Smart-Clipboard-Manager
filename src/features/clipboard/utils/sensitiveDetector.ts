const SENSITIVE_PATTERNS = [
  { label: "Credit Card", pattern: /\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/ },
  { label: "SSN", pattern: /\b\d{3}-\d{2}-\d{4}\b/ },
  { label: "Private Key", pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { label: "AWS Key", pattern: /AKIA[0-9A-Z]{16}/ },
  {
    label: "JWT Token",
    pattern: /^eyJ[A-Za-z0-9\-_]+\.eyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/,
  },
  { label: "Password Hint", pattern: /password\s*[:=]\s*\S+/i },
  { label: "API Key", pattern: /api[_-]?key\s*[:=]\s*['"]\S+['"]/i },
];

export function detectSensitive(content: string): string | null {
  const match = SENSITIVE_PATTERNS.find(({ pattern }) => pattern.test(content));
  return match?.label ?? null;
}