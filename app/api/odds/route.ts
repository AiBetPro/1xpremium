import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Odds endpoint',
      odds: [],
    });
  } catch (error) {
    console.error('Odds error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch odds',
      },
      { status: 500 }
    );
  }
}
