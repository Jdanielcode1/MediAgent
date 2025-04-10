import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lead, context } = body;

    if (!lead) {
      return NextResponse.json({ error: 'Lead information is required' }, { status: 400 });
    }

    console.log('Generate Email: Received request for lead:', lead.name);

    // Extract key points from the context to personalize the email
    const searchContext = context || '';
    
    // Create a prompt that includes all relevant lead information
    const prompt = `
      Generate a personalized, professional outreach email to a potential lead with the following information:
      
      Name: ${lead.name}
      Title: ${lead.title || 'Unknown'}
      Company: ${lead.company || 'Unknown'}
      Industry: ${lead.industry || 'Healthcare'}
      Location: ${lead.location || 'Unknown'}
      
      Search context: "${searchContext}"
      
      The email should:
      1. Be concise (3-4 paragraphs maximum)
      2. Include a personalized introduction referencing their role and company
      3. Briefly mention how our solution can help with common pain points in their industry
      4. Reference specific elements from the search context to make it highly relevant
      5. Include a clear, low-pressure call to action (like scheduling a brief call)
      6. Have a professional signature
      
      Format the email with proper salutation, body paragraphs, and signature.
    `;

    // Call OpenAI to generate the email
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert sales development representative who writes effective, personalized outreach emails. Your emails are concise, relevant, and focused on the recipient's specific needs based on their role and industry."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    });

    const emailContent = completion.choices[0]?.message?.content;

    if (!emailContent) {
      throw new Error('OpenAI did not return content.');
    }

    console.log('Generate Email: Successfully generated email');

    // Return the generated email
    return NextResponse.json({
      status: 200,
      email: emailContent
    });

  } catch (error) {
    console.error('Error generating email:', error);
    let errorMessage = 'Unknown error generating email';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    return NextResponse.json(
      { error: 'Failed to generate email', details: errorMessage },
      { status: 500 }
    );
  }
}