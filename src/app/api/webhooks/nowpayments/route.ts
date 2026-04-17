import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyIpnSignature, parsePlanFromOrderId, PLANS } from '@/lib/nowpayments';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  try {
    const raw = await req.text();
    const sig = req.headers.get('x-nowpayments-sig') || '';
    const secret = process.env.NOWPAYMENTSIHPNSECRET;
    if (secret && sig && !verifyIpnSignature(raw, sig, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    const payload = JSON.parse(raw);
    const { payment_status, order_id, payment_id } = payload;
    await admin.from('stripe_events').upsert({ id: String(payment_id), type: payment_status, data: payload });
    if (!['finished', 'confirmed', 'complete'].includes(payment_status)) {
      return NextResponse.json({ received: true });
    }
    const parsed = parsePlanFromOrderId(order_id);
    if (!parsed) return NextResponse.json({ error: 'Bad order' }, { status: 400 });
    const { userId, plan } = parsed;
    const planData = PLANS[plan];
    await admin.from('profiles').update({ plan, generations_limit: planData.generationsLimit, subscription_status: 'active' }).eq('id', userId);
    await admin.from('activity_feed').insert({ user_id: userId, type: 'subscription_upgraded', message: `Upgraded to ${planData.name}`, metadata: { plan, payment_id: String(payment_id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
