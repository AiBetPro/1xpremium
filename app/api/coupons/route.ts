import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalizeCode(value: unknown) {
  return String(value ?? '').trim().toUpperCase();
}

export async function GET(request: Request) {
  const code = normalizeCode(new URL(request.url).searchParams.get('code'));
  if (!code) return NextResponse.json({ success: false, error: 'Code requis.' }, { status: 400 });

  try {
    const coupon = await prisma.coupon.findUnique({ where: { code } });
    if (!coupon) return NextResponse.json({ success: false, error: 'Coupon introuvable.' }, { status: 404 });
    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Coupon GET error:', error);
    return NextResponse.json({ success: false, error: 'Service de réservation indisponible.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = normalizeCode(body.code);
    const selections = Array.isArray(body.selections) ? body.selections : [];
    const stake = Number(body.stake ?? 0);

    if (!/^GX-[A-Z0-9]{6}$/.test(code)) {
      return NextResponse.json({ success: false, error: 'Code de réservation invalide.' }, { status: 400 });
    }
    if (!selections.length) {
      return NextResponse.json({ success: false, error: 'Le coupon est vide.' }, { status: 400 });
    }

    const coupon = await prisma.coupon.upsert({
      where: { code },
      create: { code, selections, stake: Number.isFinite(stake) ? stake : 0 },
      update: { selections, stake: Number.isFinite(stake) ? stake : 0 },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error('Coupon POST error:', error);
    return NextResponse.json({ success: false, error: 'Enregistrement serveur indisponible.' }, { status: 503 });
  }
}
