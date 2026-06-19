import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { messages, systemPrompt } = await req.json();
  if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 });

  const res = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1000,
    system: systemPrompt || 'You are ARIA, NicheFlow\'s market intelligence AI. Help founders find and validate business niches. Be specific and actionable. The year is 2026.',
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
  });

  const reply = res.content[0].type === 'text' ? res.content[0].text : 'Sorry, I encountered an error.';
  return NextResponse.json({ reply });
}
