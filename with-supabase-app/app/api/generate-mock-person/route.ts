import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the structure we want OpenAI to generate (based on existing mock data)
const mockPersonSchema = `{
  "id": "string (generate a unique-ish mock ID)",
  "first_name": "string",
  "last_name": "string",
  "full_name": "string (first + last name)",
  "job_title": "string (relevant to the prompt, make it a director or leadership role)",
  "job_company_name": "string (plausible company name, related to prompt industry/location)",
  "job_company_industry": "string (same as industry field)",
  "industry": "string (relevant industry from prompt, use PDL-like terms e.g., 'hospital & health care')",
  "location": {
    "name": "string (e.g., 'City, State, USA' or 'City, Country')",
    "locality": "string (City)",
    "region": "string (State/Region)",
    "country": "string (2-letter code, e.g., 'us')"
  },
  "work_email": "string (generate a plausible but fake email, e.g., firstname.lastname@example-company.com)",
  "emails": ["string (include work_email here)"],
  "phone_numbers": ["string (generate a plausible but fake US-style phone number)"],
  "linkedin_url": "string (generate a plausible but fake LinkedIn URL, e.g., https://linkedin.com/in/firstname-lastname-mock)",
  "skills": ["string (list 3-5 relevant skills based on job title/industry)"],
  "bio": "string (generate a short, 1-2 sentence bio relevant to the role/industry/location)"
}`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userPrompt = body.prompt;

    if (!userPrompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Generate Mock Person: Received prompt:', userPrompt);

    // --- OpenAI API Call ---
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125", // Or use "gpt-4" if preferred/available
      messages: [
        {
          role: "system",
          content: `You are an expert data generator. Your task is to create a single, realistic but entirely fictional person profile based on the user's prompt. Generate data for all fields according to the provided JSON schema. Ensure emails, phone numbers, and LinkedIn URLs are plausible formats but clearly fake (e.g., use example.com domains, standard phone patterns). The output MUST be only the valid JSON object matching this structure: ${mockPersonSchema}`
        },
        {
          role: "user",
          content: `Generate a mock person profile for: ${userPrompt}`
        }
      ],
      response_format: { type: "json_object" }, // Use JSON mode if available
      temperature: 0.7, // Adjust creativity vs. predictability
    });

    const generatedJsonString = completion.choices[0]?.message?.content;

    if (!generatedJsonString) {
      throw new Error('OpenAI did not return content.');
    }

    console.log('Generate Mock Person: OpenAI raw response:', generatedJsonString);

    // Parse the JSON string from OpenAI
    const mockPerson = JSON.parse(generatedJsonString);

    console.log('Generate Mock Person: Parsed mock data:', mockPerson);

    // Return the generated mock person data
    // We wrap it in a structure similar to the search results for consistency
    return NextResponse.json({
        status: 200, // Indicate success
        data: [mockPerson] // Return as an array containing the single person
    });

  } catch (error) {
    console.error('Error generating mock person:', error);
    let errorMessage = 'Unknown error generating mock data';
    if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    }
    // Check for specific OpenAI errors if needed
    // if (error.response) { ... }

    return NextResponse.json(
      { error: 'Failed to generate mock person data', details: errorMessage },
      { status: 500 }
    );
  }
}