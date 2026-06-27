export const dynamic = 'force-dynamic';
export const maxDuration = 60;
import { NextResponse } from 'next/server';

const NVIDIA = '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';
const NVIDIA_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const MODEL = 'meta/llama-3.1-8b-instruct';

async function ai(system: string, user: string, maxTokens = 800): Promise<string> {
  const res = await fetch(NVIDIA_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${NVIDIA}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages: [{ role: 'system', content: system }, { role: 'user', content: user }], temperature: 0.5, max_tokens: maxTokens }),
  });
  if (!res.ok) throw new Error(`NVIDIA ${res.status}`);
  const d = await res.json();
  return d.choices?.[0]?.message?.content || '';
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = clean.search(/[\[{]/);
  const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
  if (start === -1 || end === -1) throw new Error('No JSON found');
  return JSON.parse(clean.slice(start, end + 1));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, niche, keyword, seed, platform, type: contentType } = body;

    // --- Validate Niche ---
    if (action === 'validate_niche') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are a business niche analyst. Respond ONLY with valid JSON, no markdown.',
        `Validate this niche for an online business: "${topic}"
JSON:
{"signal":"GO","score":82,"market_size":"$2.4B","competition":"Low","trend":"rising","revenue_potential":"$2k-$8k/mo","time_to_revenue":"60-90 days","strengths":["s1","s2","s3"],"risks":["r1","r2"],"next_steps":["step1","step2","step3"],"keywords":["kw1","kw2","kw3"],"summary":"2-3 sentence plain-English verdict."}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json(result);
    }

    // --- Audience Intel ---
    if (action === 'audience_intel' || action === 'audience_analyze') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are an audience intelligence analyst. Respond ONLY with valid JSON, no markdown.',
        `Analyze the target audience for: "${topic}"
JSON:
{"total_market_size":"~45M active users globally","best_platform":"YouTube + LinkedIn","segments":[{"name":"Segment Name","age_range":"28-45","income":"$60k-$120k","platforms":["LinkedIn","YouTube"],"pain_points":["pain1","pain2","pain3"],"desires":["desire1","desire2"],"buying_triggers":["trigger1","trigger2"],"content_types":["type1","type2"]}],"content_strategy":"Specific content insight."}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json(result);
    }

    // --- Generator modes ---
    if (action === 'generate_ideas' || action === 'business_ideas') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are a business idea generator. Respond ONLY with valid JSON array, no markdown.',
        `Generate 8 business ideas for niche: "${topic}"
JSON array: [{"title":"Business Name","description":"What it does","revenue":"$2k-$8k/mo","effort":"Low/Medium/High","model":"SaaS/Service/Product","validation":"How to test in 7 days"}]`
      );
      const ideas = parseJSON<unknown[]>(raw);
      return NextResponse.json({ ideas, niche: topic });
    }

    if (action === 'brand_names') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are a brand naming expert. Respond ONLY with valid JSON array, no markdown.',
        `Generate 10 brand name ideas for a "${topic}" business.
JSON array: [{"name":"BrandName","domain":"brandname.com","tagline":"Short tagline","why":"Why this name works"}]`
      );
      const names = parseJSON<unknown[]>(raw);
      return NextResponse.json({ names, niche: topic });
    }

    if (action === 'monetization') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are a monetization strategist. Respond ONLY with valid JSON, no markdown.',
        `Create a monetization plan for a "${topic}" business.
JSON: {"primary_model":"SaaS/Service/Product","pricing_tiers":[{"name":"Starter","price":"$29/mo","features":["f1","f2"]}],"revenue_streams":["stream1","stream2"],"monthly_potential":"$5k-$20k/mo","payback_period":"60 days","upsell_strategy":"Description"}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json({ ...result, niche: topic });
    }

    if (action === 'positioning') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are a positioning strategist. Respond ONLY with valid JSON, no markdown.',
        `Create a positioning strategy for a "${topic}" business.
JSON: {"positioning_statement":"For [audience] who [need], [brand] is the [category] that [benefit]","differentiator":"What makes this unique","competitors":["comp1","comp2"],"icp":"Ideal customer profile description","messaging":{"headline":"Main headline","subheadline":"Supporting copy","cta":"Call to action"}}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json({ ...result, niche: topic });
    }

    // --- Starter Kit / Forecast ---
    if (action === 'generate_starter_kit' || action === 'forecast') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are a market intelligence AI. Respond ONLY with valid JSON, no markdown.',
        `Build a complete market starter kit for: "${topic}"
JSON:
{"niche":"${topic}","signal":"GO","score":85,"market_size":"$2.4B","competition":"Low","revenue_potential":"$3k-$12k/mo","time_to_revenue":"60-90 days","target_audience":"Who buys this","entry_strategy":"How to enter fast","monetization":["method1","method2"],"top_keywords":["kw1","kw2","kw3"],"content_angles":["angle1","angle2"],"quick_wins":["win1","win2"],"risks":["risk1","risk2"],"summary":"2-3 sentence verdict."}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json(result);
    }

    // --- Autopilot / Starter Kit ---
    if (!action || action === 'build_kit' || action === 'analyze') {
      const topic = niche || keyword || seed || 'AI tools';
      const raw = await ai(
        'You are a market intelligence AI. Respond ONLY with valid JSON, no markdown.',
        `Build a complete market starter kit for: "${topic}"
JSON format:
{
  "niche": "${topic}",
  "signal": "GO",
  "score": 85,
  "market_size": "$2.4B",
  "competition": "Low",
  "revenue_potential": "$3k-$12k/mo",
  "time_to_revenue": "60-90 days",
  "target_audience": "Description of who buys this",
  "entry_strategy": "Specific how-to enter this market",
  "monetization": ["method1", "method2", "method3"],
  "top_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "content_angles": ["angle1", "angle2", "angle3"],
  "quick_wins": ["win1", "win2", "win3"],
  "risks": ["risk1", "risk2"],
  "summary": "2-3 sentence verdict on this niche."
}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json(result);
    }

    // --- Keyword Clusters ---
    if (action === 'keyword_clusters') {
      const topic = seed || keyword || niche || 'AI tools';
      const raw = await ai(
        'You are an SEO expert. Respond ONLY with valid JSON, no markdown.',
        `Generate 5 keyword clusters for: "${topic}"
JSON array format:
[{"name":"cluster name","intent":"informational","volume":"22K/mo","difficulty":"34","content_angle":"specific strategy","keywords":[{"term":"keyword","volume":"5.4K","difficulty":28,"cpc":"$1.20"}]}]
Intents: informational, commercial, transactional, navigational.`
      );
      const clusters = parseJSON<unknown[]>(raw);
      return NextResponse.json({ clusters, seed: topic });
    }

    // --- Radar Analyze ---
    if (action === 'radar_analyze') {
      const topic = niche || keyword || 'emerging trends 2026';
      const raw = await ai(
        'You are a niche trend analyst. Respond ONLY with valid JSON array, no markdown.',
        `Generate 6 trending niche signals for: "${topic}"
JSON array:
[{"niche":"niche name","signal_strength":87,"trend":"rising","category":"AI/Tech","why_now":"specific reason","competition":"Low","revenue_potential":"$3k-$12k/mo","keywords":["kw1","kw2"],"sources":["Reddit","Twitter"]}]
Trends: rising, stable, declining. Competition: Low, Medium, High.`
      );
      const signals = parseJSON<unknown[]>(raw);
      return NextResponse.json({ signals });
    }

    // --- Audience Analysis ---
    if (action === 'audience_analyze') {
      const topic = niche || keyword || 'AI tools';
      const raw = await ai(
        'You are an audience intelligence analyst. Respond ONLY with valid JSON, no markdown.',
        `Analyze the target audience for: "${topic}"
JSON format:
{
  "total_market_size": "~45M active users globally",
  "best_platform": "YouTube + LinkedIn",
  "segments": [
    {
      "name": "Segment Name",
      "age_range": "28-45",
      "income": "$60k-$120k",
      "platforms": ["LinkedIn","YouTube"],
      "pain_points": ["pain1","pain2","pain3"],
      "desires": ["desire1","desire2"],
      "buying_triggers": ["trigger1","trigger2"],
      "content_types": ["type1","type2"]
    }
  ],
  "content_strategy": "Specific content insight for this niche."
}`
      );
      const result = parseJSON<Record<string, unknown>>(raw);
      return NextResponse.json(result);
    }

    // --- Content Generation ---
    if (action === 'generate_content') {
      const topic = keyword || niche || 'AI tools';
      const raw = await ai(
        `You are an expert ${platform || 'social media'} copywriter. Write engaging content only, no preamble.`,
        `Write a ${contentType || 'post'} for ${platform || 'Twitter'} about: "${topic}". Make it specific, punchy, and high-converting. 150-300 words.`,
        600
      );
      return NextResponse.json({ content: raw.trim() });
    }

    // --- Daily Picks ---
    if (action === 'daily_picks') {
      const raw = await ai(
        'You are a niche market analyst. Respond ONLY with valid JSON array, no markdown.',
        `Generate 5 top niche business opportunities for today (${new Date().toDateString()}).
JSON array:
[{"id":"1","name":"Niche Name","score":88,"signal":"GO","competition":"Low","revenue":"$2k-$8k/mo","category":"AI/Tech","why":"Specific reason why this niche is hot right now in 2-3 sentences."}]
Signals: GO, WATCH, AVOID.`
      );
      const picks = parseJSON<unknown[]>(raw);
      return NextResponse.json(picks);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (e: any) {
    console.error('[autopilot]', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ ok: true, model: 'meta/llama-3.1-8b-instruct', ts: Date.now() });
}
