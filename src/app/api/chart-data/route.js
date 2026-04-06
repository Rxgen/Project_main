import { NextResponse } from 'next/server';
import { getFullChartData } from '@/lib/chart-api';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const chartData = await getFullChartData();
    const res = NextResponse.json(chartData);
    res.headers.set('Cache-Control', 'no-store, max-age=0');
    return res;
  } catch (err) {
    console.error('Chart API error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}
