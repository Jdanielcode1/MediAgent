// app/api/lead-generation/person-enrich/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPDLClient } from '@/lib/api-clients/pdl';

export async function GET(request: NextRequest) {
  try {
    const pdlClient = getPDLClient();
    const searchParams = request.nextUrl.searchParams;
    
    // Get parameters from query string
    const email = searchParams.get('email');
    const linkedin = searchParams.get('linkedin');
    const name = searchParams.get('name');
    const company = searchParams.get('company');
    
    console.log('Person enrich: Request parameters', { email, linkedin, name, company });
    
    // At least one identifier is required
    if (!email && !linkedin && !(name && company)) {
      console.log('Person enrich: Missing required identifiers');
      return NextResponse.json(
        { error: 'At least one identifier (email, linkedin, or name+company) is required' },
        { status: 400 }
      );
    }
    
    // Build parameters for PDL
    const params: Record<string, string> = {
      pretty: 'false',
      min_likelihood: '2',
      include_if_matched: 'false',
      titlecase: 'false'
    };
    
    if (email) params.email = email;
    if (linkedin) params.linkedin = linkedin;
    if (name) params.name = name;
    if (company) params.company = company;
    
    console.log('Person enrich: Calling PDL with params', params);
    
    // Execute the enrichment
    const result = await pdlClient.personEnrich(params);
    
    console.log('Person enrich: Received response from PDL');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in person enrichment:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}