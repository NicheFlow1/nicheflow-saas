export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = 'meta/llama-3.1-8b-instruct';

async function callNvidia(system: string, user: string): Promise<string> {
  const res = await fetch(NVIDIA_BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: NVIDIA_MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.4, max_tokens: 800 }),
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

const NON_BUSINESS = ['war', 'weapon', 'hack', 'drug', 'gun', 'violence', 'politic', 'news', 'terror', 'death', 'kill'];

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();
  if (!keyword) return NextResponse.json({ error: 'keyword required' }, { status: 400 });

  const lower = keyword.toLowerCase();
  if (NON_BUSINESS.some(w => lower.includes(w))) {
    return NextResponse.json({ error: 'Please enter a business niche, not a news topic.' }, { status: 422 });
  }

  const raw = await callNvidia(
    'You are a niche business analyst. Respond ONLY with valid JSON, no markdown.',
    `Validate this niche for an online business: "${keyword}"
JSON format:
{
  "signal": "GO" | "WAIT" | "NO_GO",
  "score": 75,
  "market_size": "$2.4B",
  "competition": "Low" | "Medium" | "High",
  "trend": "rising" | "stable" | "declining",
  "revenue_potential": "$2k-$8k/mo",
  "time_to_revenue": "60-90 days",
  "strengths": ["point1", "point2", "point3"],
  "risks": ["risk1", "risk2"],
  "next_steps": ["step1", "step2", "step3"],
  "keywords": ["kw1", "kw2", "kw3"],
  "summary": "2-3 sentence plain-English verdict."
}`
  );

  const result = parseJSON<Record<string, unknown>>(raw);
  return NextResponse.json(result);
}
