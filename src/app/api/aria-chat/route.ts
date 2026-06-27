export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextRequest, NextResponse } from 'next/server';

const NVIDIA_BASE = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = 'meta/llama-3.1-8b-instruct';

async function callNvidia(messages: { role: string; content: string }[]) {
  const res = await fetch(NVIDIA_BASE + '/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer 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', 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: NVIDIA_MODEL, messages, temperature: 0.7, max_tokens: 800, top_p: 0.9 }),
  });
  if (!res.ok) throw new Error('NVIDIA ' + res.status);
  const d = await res.json();
  return d.choices?.[0]?.message?.content || '';
}

export async function POST(req: NextRequest) {
  const { messages, systemPrompt } = await req.json();
  if (!messages?.length) return NextResponse.json({ error: 'messages required' }, { status: 400 });

  const fullMessages = systemPrompt
    ? [{ role: 'system', content: systemPrompt }, ...messages]
    : messages;

  const content = await callNvidia(fullMessages);
  return NextResponse.json({ content });
}
