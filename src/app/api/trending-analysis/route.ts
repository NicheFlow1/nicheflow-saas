export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = 'meta/llama-3.1-8b-instruct';

async function callNvidia(system: string, user: string): Promise<string> {
  const res = await fetch(NVIDIA_BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: NVIDIA_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.6, max_tokens: 800 }),
  });
  if (!res.ok) throw new Error('NVIDIA ' + res.status);
  const d = await res.json();
  return d.choices?.[0]?.message?.content || '';
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = clean.search(/[\[{]/);
  const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
  if (start === -1 || end === -1) throw new Error('No JSON');
  return JSON.parse(clean.slice(start, end + 1));
}

export async function POST(req: NextRequest) {
  const { niche } = await req.json();
  if (!niche) return NextResponse.json({ error: 'niche required' }, { status: 400 });

  const raw = await callNvidia(
    'You are a market trend analyst. Respond ONLY with valid JSON, no markdown.',
    `Analyze this trending niche: "${niche}"
JSON format:
{
  "why_trending": "Specific reason this is trending right now in 2026",
  "opportunity": "Concrete business opportunity to act on",
  "target_audience": "Who to sell to",
  "entry_strategy": "How to enter this market fast",
  "revenue_model": "How to monetize",
  "competition": "Low" | "Medium" | "High",
  "urgency": "high" | "medium" | "low",
  "keywords": ["kw1", "kw2", "kw3"]
}`
  );

  const result = parseJSON<Record<string, unknown>>(raw);
  return NextResponse.json(result);
}
