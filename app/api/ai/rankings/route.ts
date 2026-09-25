import { NextResponse } from 'next/server';
import { rankMatches } from '../../../../lib/ai-engine';

export async function GET() {
  try {
    const rankings = rankMatches();

    return NextResponse.json({
      success: true,
      rankings,
    });
  } catch (error) {
    console.error('AI rankings error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate AI rankings',
      },
      { status: 500 }
    );
  }
}
