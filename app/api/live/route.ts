import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Live matches endpoint',
      matches: [],
    });
  } catch (error) {
    console.error('Live matches error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch live matches',
      },
      { status: 500 }
    );
  }
}
