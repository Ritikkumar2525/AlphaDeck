import { NextResponse } from 'next/server';
import { httpClient } from '@/lib/httpClient';

export async function GET() {
  try {
    const apiKey = process.env.FINNHUB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Finnhub API key missing' }, { status: 500 });
    }

    // Finnhub general news
    const res = await httpClient.get(`https://finnhub.io/api/v1/news?category=general`, { 
      headers: { 'X-Finnhub-Token': apiKey }
    });

    if (!Array.isArray(res.data)) {
      throw new Error('Invalid response from Finnhub');
    }

    // Filter out articles with placeholder logos or missing images to ensure high-quality thumbnails
    const validNews = res.data.filter(n => 
      n.image && 
      !n.image.includes('finnhub/logo') &&
      !n.image.includes('placeholder')
    );

    // Format news items
    const news = validNews.slice(0, 20).map(n => ({
      id: n.id,
      title: n.headline,
      url: n.url,
      source: n.source,
      summary: n.summary,
      image: n.image,
      publishedAt: new Date(n.datetime * 1000).toISOString()
    }));

    return NextResponse.json(news);
  } catch (err) {
    console.error('Failed to fetch market news:', err);
    return NextResponse.json({ error: 'Failed to fetch market news' }, { status: 500 });
  }
}
