import { NextResponse } from 'next/server';

const SUPABASE_URL = 'https://aincmpxokmsygyghvtnm.supabase.co';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    // Forward the user's JWT from the incoming request
    const authHeader = req.headers.get('Authorization') || '';

    // Route to correct edge function
    let endpoint = '/functions/v1/autopilot';
    if (action === 'keyword_clusters') endpoint = '/functions/v1/keyword-clusters';
    else if (action === 'radar_analyze') endpoint = '/functions/v1/radar-analyze';

    const res = await fetch(SUPABASE_URL + endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`[autopilot] ${action} → ${res.status}: ${errText}`);
      return NextResponse.json({ error: `Upstream ${res.status}`, detail: errText }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error('[autopilot] catch:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
