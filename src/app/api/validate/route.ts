import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { keyword } = await req.json();
  if (!keyword) return NextResponse.json({ error: 'keyword required' }, { status: 400 });

  // Step 1: Business niche classifier
  try {
    const classifierResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Is "${keyword}" a potential business niche/market opportunity, OR is it a news event, political topic, natural disaster, celebrity gossip, or current event?

Reply with JSON only: {"is_business_niche": true/false, "reason": "one sentence"}`
      }]
    });
    const classifierText = classifierResponse.content[0].type === 'text' ? classifierResponse.content[0].text : '{}';
    const cleanClassifier = classifierText.replace(/```json|```/g, '').trim();
    const { is_business_niche, reason } = JSON.parse(cleanClassifier);

    if (!is_business_niche) {
      return NextResponse.json({
        error: 'not_a_niche',
        message: `"${keyword}" appears to be a news event rather than a business niche. Try something like "AI productivity tools for lawyers" or "pet health monitoring devices".`,
        reason
      }, { status: 400 });
    }
  } catch (e) {
    // classifier fail — allow through
  }

  // Step 2: Full niche validation
  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1200,
    messages: [{
      role: 'user',
      content: `You are a niche market analyst. Validate this business niche for 2026: "${keyword}"

Analyze it thoroughly and return ONLY valid JSON (no markdown, no backticks):
{
  "overall_score": <0-100 integer>,
  "signal": "<GO|WAIT|WATCH>",
  "verdict": "<8 words max>",
  "summary": "<2-3 specific sentences about this exact niche>",
  "scores": {
    "trend_momentum": <0-100>,
    "competition_gap": <0-100>,
    "monetization": <0-100>,
    "audience_size": <0-100>
  },
  "market_size": "<e.g. $2.1B TAM>",
  "competition_level": "<Low|Medium|High>",
  "trend": "<Rising|Stable|Declining>",
  "revenue_potential": "<e.g. $1k-5k/mo>",
  "keywords": ["<kw1>", "<kw2>", "<kw3>", "<kw4>", "<kw5>"],
  "opportunity": "<specific gap in this market right now>",
  "top_entry_strategies": ["<strategy1>", "<strategy2>", "<strategy3>"],
  "biggest_risk": "<one sentence>"
}

Score thresholds: 70+ = GO (strong signal), 40-69 = WATCH (monitor), <40 = WAIT (not ready).
Be specific to THIS niche — no generic statements. Use real 2026 market context.`
    }]
  });

  const raw = res.content[0].type === 'text' ? res.content[0].text : '{}';
  const clean = raw.replace(/```json|```/g, '').trim();
  const data = JSON.parse(clean);
  return NextResponse.json(data);
}
