import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    // Récupérer un coupon précis
    if (idParam) {
      const id = Number(idParam);

      if (!Number.isInteger(id)) {
        return NextResponse.json(
          { error: 'ID de coupon invalide' },
          { status: 400 }
        );
      }

      const coupon = await prisma.coupon.findUnique({
        where: { id },
      });

      if (!coupon) {
        return NextResponse.json(
          { error: 'Coupon introuvable' },
          { status: 404 }
        );
      }

      return NextResponse.json(coupon);
    }

    // Récupérer tous les coupons
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

    // Vérification des champs obligatoires
    if (!body.code) {
      return NextResponse.json(
        { error: 'Le code du coupon est obligatoire' },
        { status: 400 }
      );
    }

    if (!body.selections) {
      return NextResponse.json(
        { error: 'Les sélections du coupon sont obligatoires' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: body.code,
        selections: body.selections,
        stake: body.stake !== undefined ? Number(body.stake) : 0,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (error) {
    console.error('POST /api/coupons error:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la création du coupon' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: 'ID de coupon invalide' },
        { status: 400 }
      );
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(body.code !== undefined && { code: body.code }),
        ...(body.selections !== undefined && {
          selections: body.selections,
        }),
        ...(body.stake !== undefined && {
          stake: Number(body.stake),
        }),
      },
    });

    return NextResponse.json(coupon);
  } catch (error) {
    console.error('PUT /api/coupons error:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la modification du coupon' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const prisma = getPrisma();
    const { searchParams } = new URL(request.url);
    const idParam = searchParams.get('id');

    if (!idParam) {
      return NextResponse.json(
        { error: 'ID du coupon obligatoire' },
        { status: 400 }
      );
    }

    const id = Number(idParam);

    if (!Number.isInteger(id)) {
      return NextResponse.json(
        { error: 'ID de coupon invalide' },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Coupon supprimé',
    });
  } catch (error) {
    console.error('DELETE /api/coupons error:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la suppression du coupon' },
      { status: 500 }
    );
  }
}