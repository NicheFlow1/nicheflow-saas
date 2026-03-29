// NVIDIA NIM - Free tier AI - meta/llama-3.3-70b-instruct
const NVIDIA_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const NVIDIA_MODEL = 'meta/llama-3.3-70b-instruct';

async function callNvidia(systemPrompt: string, userPrompt: string): Promise<{content: string; tokens: number}> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('NVIDIA_API_KEY not set');
  const res = await fetch(NVIDIA_BASE_URL + '/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: NVIDIA_MODEL, messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }], temperature: 0.7, max_tokens: 2048, top_p: 0.9 })
  });
  if (!res.ok) throw new Error('NVIDIA ' + res.status + ': ' + await res.text());
  const d = await res.json();
  return { content: d.choices?.[0]?.message?.content || '', tokens: (d.usage?.prompt_tokens || 0) + (d.usage?.completion_tokens || 0) };
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const start = clean.search(/[\[{]/);
  const end = Math.max(clean.lastIndexOf('}'), clean.lastIndexOf(']'));
  if (start === -1 || end === -1) throw new Error('No JSON in response');
  return JSON.parse(clean.slice(start, end + 1));
}

export interface IdeaOutput { businessName: string; tagline: string; description: string; problemSolved: string; uniqueValue: string; nicheScore: number; keywords: string[]; }
export interface MarketOutput { marketSize: string; targetAudience: string; competitionLevel: 'low' | 'medium' | 'high'; competitors: string[]; opportunities: string[]; threats: string[]; nicheScore: number; demandScore: number; }
export interface ProductOutput { mvpFeatures: string[]; techStack: string[]; monetizationModel: string; roadmap: {phase: string; features: string[]}[]; usp: string; pricingStrategy: string; }
export interface BrandOutput { brandName: string; tagline: string; logoDescription: string; primaryColor: string; secondaryColor: string; fontStyle: string; brandVoice: string; brandValues: string[]; missionStatement: string; }
export interface LandingOutput { headline: string; subheadline: string; heroCTA: string; features: {title: string; description: string; icon: string}[]; socialProof: string; finalCTA: string; seoTitle: string; seoDescription: string; }
export interface ContentOutput { blogPosts: {title: string; outline: string[]}[]; socialPosts: {platform: string; content: string}[]; emailSubject: string; emailBody: string; adCopy: string[]; }
export interface GrowthOutput { channels: {name: string; priority: 'low' | 'medium' | 'high'; tactic: string}[]; launchPlan: string[]; retentionStrategies: string[]; kpis: {metric: string; target: string}[]; monthlyMilestones: {month: number; goal: string}[]; }

export async function generateIdea(niche: string) {
  const { content, tokens } = await callNvidia('You are an expert startup idea generator. Respond with ONLY valid JSON.',
    'Generate a SaaS business idea for "' + niche + '"\nJSON: {"businessName":"","tagline":"","description":"","problemSolved":"","uniqueValue":"","nicheScore":85,"keywords":[""]}');
  return { output: parseJSON<IdeaOutput>(content), tokens };
}
export async function analyzeMarket(niche: string, idea: IdeaOutput) {
  const { content, tokens } = await callNvidia('You are a market analyst. Respond with ONLY valid JSON.',
    'Market analysis for "' + idea.businessName + '" in "' + niche + '"\nJSON: {"marketSize":"$XB","targetAudience":"","competitionLevel":"medium","competitors":[""],"opportunities":[""],"threats":[""],"nicheScore":78,"demandScore":82}');
  return { output: parseJSON<MarketOutput>(content), tokens };
}
export async function buildProduct(niche: string, idea: IdeaOutput, market: MarketOutput) {
  const { content, tokens } = await callNvidia('You are a product architect. Respond with ONLY valid JSON.',
    'MVP for "' + idea.businessName + '"\nJSON: {"mvpFeatures":[""],"techStack":[""],"monetizationModel":"","roadmap":[{"phase":"Phase 1","features":[""]},{}],"usp":"","pricingStrategy":""}');
  return { output: parseJSON<ProductOutput>(content), tokens };
}
export async function generateBrand(idea: IdeaOutput, market: MarketOutput) {
  const { content, tokens } = await callNvidia('You are a brand strategist. Respond with ONLY valid JSON.',
    'Brand for "' + idea.businessName + '"\nJSON: {"brandName":"","tagline":"","logoDescription":"","primaryColor":"#7C3AED","secondaryColor":"#06B6D4","fontStyle":"","brandVoice":"","brandValues":[""],"missionStatement":""}');
  return { output: parseJSON<BrandOutput>(content), tokens };
}
export async function generateLanding(idea: IdeaOutput, brand: BrandOutput, market: MarketOutput) {
  const { content, tokens } = await callNvidia('You are a conversion copywriter. Respond with ONLY valid JSON.',
    'Landing page for "' + brand.brandName + '"\nJSON: {"headline":"","subheadline":"","heroCTA":"Get Started Free","features":[{"title":"","description":"","icon":"\u2728"}],"socialProof":"","finalCTA":"","seoTitle":"","seoDescription":""}');
  return { output: parseJSON<LandingOutput>(content), tokens };
}
export async function generateContent(idea: IdeaOutput, brand: BrandOutput, market: MarketOutput) {
  const { content, tokens } = await callNvidia('You are a content marketing expert. Respond with ONLY valid JSON.',
    'Content for "' + brand.brandName + '"\nJSON: {"blogPosts":[{"title":"","outline":["",""]}],"socialPosts":[{"platform":"Twitter/X","content":""}],"emailSubject":"","emailBody":"","adCopy":["",""]}');
  return { output: parseJSON<ContentOutput>(content), tokens };
}
export async function generateGrowthPlan(idea: IdeaOutput, market: MarketOutput, product: ProductOutput) {
  const { content, tokens } = await callNvidia('You are a growth strategist. Respond with ONLY valid JSON.',
    'Growth plan for "' + idea.businessName + '"\nJSON: {"channels":[{"name":"","priority":"high","tactic":""}],"launchPlan":[""],"retentionStrategies":[""],"kpis":[{"metric":"","target":""}],"monthlyMilestones":[{"month":1,"goal":""}]}');
  return { output: parseJSON<GrowthOutput>(content), tokens };
}
