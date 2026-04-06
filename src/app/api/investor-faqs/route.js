import { NextResponse } from 'next/server';
import { fetchAPI } from '@/lib/strapi';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const start = parseInt(searchParams.get('start') || '0');
    const limit = parseInt(searchParams.get('limit') || '4');

    // Check if Strapi URL is configured
    if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
      return NextResponse.json({
        faqs: [],
        hasMore: false,
        total: 0,
        message: 'Strapi not configured'
      });
    }

    // Fetch FAQs from Strapi
    const data = await fetchAPI(`investor-faqs?pagination[start]=${start}&pagination[limit]=${limit}&sort=id:asc`, {
      cache: 'no-store',
    });

    // Handle null response (404 or other errors)
    if (!data) {
      return NextResponse.json({
        faqs: [],
        hasMore: false,
        total: 0,
        message: 'Strapi endpoint not found'
      });
    }

    // Map Strapi data to component format
    const faqs = (data.data || []).map((item, index) => ({
      id: start + index,
      question: item.attributes?.question || item.attributes?.title || '',
      answer: item.attributes?.answer || item.attributes?.content || ''
    }));

    const hasMore = data.meta?.pagination 
      ? (start + limit) < data.meta.pagination.total
      : faqs.length === limit;

    return NextResponse.json({
      faqs,
      hasMore,
      total: data.meta?.pagination?.total || faqs.length
    });
  } catch (error) {
    // Silently handle errors - Strapi not available yet
    // Return empty response so component can fall back to existing data
    return NextResponse.json({
      faqs: [],
      hasMore: false,
      total: 0,
      error: 'Strapi API not available'
    }, { status: 200 }); // Return 200 so it doesn't trigger error handling
  }
}

