export type SecretDetection = { kind: string; match: string };

const RULES: Array<{ kind: string; re: RegExp }> = [
  { kind: "anthropic_api_key", re: /\bsk-ant-[A-Za-z0-9_\-]{20,}\b/g },
  { kind: "openai_api_key", re: /\bsk-[A-Za-z0-9]{20,}\b/g },
  { kind: "private_key_block", re: /-----BEGIN (?:RSA|OPENSSH|EC|DSA)? ?PRIVATE KEY-----/g },
  { kind: "aws_access_key_id", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { kind: "jwt_like", re: /\beyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\b/g },
];

export function detectSecrets(text: string, maxFindings: number = 5): SecretDetection[] {
  const findings: SecretDetection[] = [];
  for (const rule of RULES) {
    const matches = text.match(rule.re) ?? [];
    for (const m of matches) {
      findings.push({ kind: rule.kind, match: m.slice(0, 24) + (m.length > 24 ? "…" : "") });
      if (findings.length >= maxFindings) return findings;
    }
  }
  return findings;
}

export function maskSecrets(text: string): string {
  let out = text;
  for (const rule of RULES) {
    out = out.replace(rule.re, `[REDACTED:${rule.kind}]`);
  }
  return out;
}

