import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { niche } = await req.json();
  if (!niche) return NextResponse.json({ error: 'niche required' }, { status: 400 });

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 400,
    messages: [{
      role: 'user',
      content: `Analyze this specific niche trend signal. Be specific — use the actual data provided. Do NOT write generic statements like "rapidly growing interest".

NICHE: ${niche.name}
SOCIAL SCORE: ${niche.score}/100
PRIMARY PLATFORM: ${niche.platform} (${(niche.mentions/1000).toFixed(0)}k mentions)
TREND DIRECTION: ${niche.trend_direction} (+${niche.growth}% in 30 days)
RELATED TOPICS RISING: ${niche.related?.join(', ')}
SIGNAL: ${niche.signal}

Write TWO sections:

WHY TRENDING (1-2 specific sentences): What specific event, cultural shift, demographic change, or technology development is driving this RIGHT NOW in 2026? Name the actual driver. Never say "rapidly growing interest" — that's meaningless.

OPPORTUNITY (1 specific sentence): What specific market gap exists for a founder entering this niche TODAY? Be specific about who is underserved and what they are willing to pay for.

Return ONLY JSON (no markdown, no backticks):
{"why_trending": "...", "opportunity": "..."}`
    }]
  });

  const raw = res.content[0].type === 'text' ? res.content[0].text : '{}';
  const clean = raw.replace(/```json|```/g, '').trim();
  const data = JSON.parse(clean);
  return NextResponse.json(data);
}
