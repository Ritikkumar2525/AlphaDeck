import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET() {
  try {
    const finnhubKey = process.env.FINNHUB_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    if (!finnhubKey || !openRouterKey) {
       // Return fallback data if keys are missing
       return NextResponse.json([
        {
          id: 1,
          title: "The AI Data Center Boom: Constraints & Opportunities",
          description: "An in-depth analysis of power consumption, supply chain bottlenecks, and the structural winners in the AI infrastructure build-out.",
          sector: "Technology",
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          readTime: "15 min",
          premium: true,
          gradient: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"
        }
       ]);
    }

    // Fetch latest general market news from Finnhub
    const newsRes = await fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubKey}`);
    const newsData = await newsRes.json();
    
    // Take top 10 news articles to synthesize
    const topNews = newsData.slice(0, 10).map(n => n.headline + ": " + n.summary).join("\n\n");

    // Use OpenRouter to generate research reports
    const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5',
        messages: [{
          role: 'system',
          content: 'You are an elite financial analyst. Based on the following recent news headlines, generate 4 compelling, institutional-grade research report concepts. Return ONLY valid JSON format: a JSON array of objects, where each object has: "id" (number), "title" (string, max 50 chars), "description" (string, max 120 chars, compelling summary), "sector" (string, e.g. Technology, Macro, Healthcare), "readTime" (string, e.g. "12 min"), "premium" (boolean, randomly true or false).'
        }, {
          role: 'user',
          content: `Recent News:\n${topNews}`
        }],
        response_format: { type: 'json_object' }
      })
    });

    const aiData = await aiRes.json();
    let parsedReports = [];
    try {
      const content = aiData.choices[0].message.content;
      // Extract array if it was wrapped in an object by the AI
      const rawJson = JSON.parse(content);
      parsedReports = Array.isArray(rawJson) ? rawJson : (rawJson.reports || rawJson.data || []);
    } catch (e) {
      console.error("Failed to parse AI research reports", e);
    }

    // Add standard gradients and format dates
    const gradients = [
      "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
      "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
      "linear-gradient(135deg, #3a1c71 0%, #d76d77 50%, #ffaf7b 100%)",
      "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
      "linear-gradient(135deg, #232526 0%, #414345 100%)",
      "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)"
    ];

    const finalReports = parsedReports.map((report, idx) => ({
      ...report,
      id: idx + 1,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      gradient: gradients[idx % gradients.length]
    }));

    return NextResponse.json(finalReports);
  } catch (error) {
    console.error("Error generating research:", error);
    return NextResponse.json({ error: "Failed to generate research" }, { status: 500 });
  }
}
