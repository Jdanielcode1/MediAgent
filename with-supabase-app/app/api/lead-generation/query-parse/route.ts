import { NextRequest, NextResponse } from 'next/server';
import { getOpenAIClient } from '@/lib/api-clients/openai-client';

export async function POST(request: NextRequest) {
  try {
    const openai = getOpenAIClient();
    const { query } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that extracts structured information from text queries about lead generation for medical devices. 
          Extract the following information and format as JSON:
          - titles: array of job titles mentioned
          - industries: array of industries mentioned
          - location: string of location if mentioned
          - companySize: string representing company size
          - tags: array of relevant tags like "Medicare-certified", "Manual tracking", etc.
          - specialties: array of medical specialties mentioned
          - painPoints: array of pain points or challenges mentioned
          - budgetInfo: any budget information mentioned
          - timeframe: any timeframe or urgency mentioned`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.1,
      response_format: { type: "json_object" }
    });
    
    // Parse the JSON response
    const content = response.choices[0].message.content;
    if (!content) {
      return NextResponse.json({ error: 'Empty response from OpenAI' }, { status: 500 });
    }

    const parsedData = JSON.parse(content);
    
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error in OpenAI query parsing:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}