import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Placeholder for bets endpoint
    return NextResponse.json({
      success: true,
      message: 'Bets endpoint',
      bets: []
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch bets' },
      { status: 500 }
    );
  }
}
