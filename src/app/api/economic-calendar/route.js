import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json');
    if (!res.ok) {
      throw new Error(`Failed to fetch from external API: ${res.status}`);
    }
    const calendarData = await res.json();
    
    // Group events by day of the week
    const groupedEvents = {
      0: [], // Mon
      1: [], // Tue
      2: [], // Wed
      3: [], // Thu
      4: [], // Fri
    };

    calendarData.forEach(event => {
      const d = new Date(event.date);
      // getDay() returns 0 for Sunday, 1 for Monday, etc.
      let dayIndex = d.getDay() - 1; 
      
      // We only care about Monday to Friday (0 to 4 in our array)
      if (dayIndex >= 0 && dayIndex <= 4) {
        
        let status = 'upcoming';
        if (d < new Date()) {
          status = 'past';
        }

        groupedEvents[dayIndex].push({
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          country: event.country,
          event: event.title,
          impact: event.impact.toLowerCase(), // 'high', 'medium', 'low'
          actual: event.actual || '-',
          forecast: event.forecast || '-',
          previous: event.previous || '-',
          status: status
        });
      }
    });

    // Generate dynamic days array based on the current week
    const now = new Date();
    // Get Monday of the current week
    const currentDay = now.getDay();
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(now.setDate(diff));

    const days = [0, 1, 2, 3, 4].map(idx => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + idx);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        id: idx,
        day: dayName,
        date: dateStr
      };
    });

    return NextResponse.json({ days, events: groupedEvents });

  } catch (error) {
    console.error('Failed to fetch economic calendar:', error);
    return NextResponse.json({ error: 'Failed to fetch economic calendar' }, { status: 500 });
  }
}
