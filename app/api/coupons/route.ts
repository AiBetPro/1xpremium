import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const coupon = await prisma.coupon.findUnique({
        where: { id },
      });

      return NextResponse.json(coupon);
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(coupons);
  } catch (error) {
    console.error('GET /api/coupons error:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la récupération des coupons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await request.json();

    const coupon = await prisma.coupon.upsert({
      where: {
        id: body.id,
      },
      update: body,
      create: body,
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('POST /api/coupons error:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la création du coupon' },
      { status: 500 }
    );
  }
}