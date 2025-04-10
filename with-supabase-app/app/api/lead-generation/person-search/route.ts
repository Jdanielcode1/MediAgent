// app/api/lead-generation/person-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPDLClient } from '@/lib/api-clients/pdl';

export async function POST(request: NextRequest) {
  // Clone the request here
  const requestClone = request.clone();
  let body: any;

  try {
    console.log('Person search: Starting request');
    const pdlClient = getPDLClient();
    body = await request.json(); // Read from original request
    console.log('Person search: Request body', body);

    // Build SQL query based on search parameters
    let sqlQuery = "SELECT * FROM person WHERE";
    const conditions = [];

    // Add role/title filter
    if (body.titles && body.titles.length > 0) {
      const titleConditions = body.titles.map((title: string) => `job_title LIKE '%${title}%'`).join(' OR ');
      conditions.push(`(${titleConditions})`);
    } else {
      conditions.push(`(job_title LIKE '%wound%' OR job_title LIKE '%nursing%' OR job_title LIKE '%clinical%' OR job_title LIKE '%medical%')`);
    }

    // Add seniority filter
    conditions.push(`job_title_levels IN ('director', 'executive', 'senior', 'manager', 'vp')`);

    // Add industry filter - Map 'hospitals' to PDL standard term
    if (body.industry && body.industry.length > 0) {
       const industries = body.industry.map((i: string) => {
        const lowerI = i.toLowerCase();
        if (lowerI === 'hospitals') {
          return `'hospital & health care'`;
        }
        return `'${lowerI}'`;
      }).join(', ');
      conditions.push(`industry IN (${industries})`);
    } else {
      // Default to medical industries
      conditions.push(`industry IN ('hospital & health care', 'medical device', 'medical practice')`);
    }

    // Add location filter
    if (body.location) {
      const locationLower = body.location.toLowerCase();
      const usStatesLower = ['california', 'ca', 'texas', 'tx', 'florida', 'fl', 'new york', 'ny'];

      if (usStatesLower.includes(locationLower)) {
         conditions.push(`location_region='${body.location}'`);
         conditions.push(`location_country='us'`);
      } else if (locationLower === 'us' || locationLower === 'usa' || locationLower === 'united states') {
         conditions.push(`location_country='us'`);
      } else if (locationLower.length === 2) {
         conditions.push(`location_country='${locationLower}'`);
      } else {
         conditions.push(`location_country='us'`);
         console.warn(`Unclear location format: ${body.location}, defaulting country to 'us'`);
      }
    } else {
       conditions.push(`location_country='us'`);
    }


    // Combine all conditions
    if (conditions.length === 0) {
      console.error("Person search: No valid conditions generated.");
      return NextResponse.json({ status: 400, error: { message: "No search conditions provided" }, data: [] });
    }
    sqlQuery += ` ${conditions.join(' AND ')}`;
    console.log('Person search: SQL query', sqlQuery);

    // Execute the search
    console.log('Person search: Calling PDL API');
    const result = await pdlClient.personSearch({
      sql: sqlQuery,
      size: body.limit || 10
    });

    // Log the full result object received from the client method
    console.log('Person search: Full result object from PDL client', JSON.stringify(result, null, 2));

    // Check the status code returned by the client method
    if (result.status !== 200 || !result.data || result.data.length === 0) {
       console.log(`Person search: PDL status ${result.status}. No results found or error occurred, returning mock data.`);
       const locationForMock = body?.location || 'Florida';
       return NextResponse.json(getMockPersonData(locationForMock)); // Use helper
    }

    // Return the actual successful data from PDL
    console.log('Person search: Success, returning actual PDL data.');
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error in person search route handler:', error);
    // Try to get location from the cloned request's body for mock data context
    let locationForMock = 'Florida'; // Default
    try {
      const requestBody = await requestClone.json(); // Use the clone here
      locationForMock = requestBody.location || 'Florida';
    } catch (parseError) {
      console.warn('Could not parse request body in catch block for mock data context.');
    }
    return NextResponse.json(getMockPersonData(locationForMock)); // Use helper
  }
}

// --- Add the getMockPersonData helper function here if you haven't already ---
function getMockPersonData(location: string) {
  const locationName = location === 'us' ? 'USA' : location;
  return {
    status: 200, // Keep mock status as 200
    data: [
      {
        id: 'person-mock-fallback',
        first_name: 'Jamie',
        last_name: 'Rodriguez',
        full_name: 'Jamie Rodriguez',
        job_title: 'Director of Nursing (Mock)',
        job_company_name: `${locationName} Health System (Mock)`,
        industry: 'hospital & health care',
        location: {
          name: `${locationName}, USA`,
          locality: locationName,
          region: locationName,
          country: 'us'
        },
        work_email: `jrodriguez@${location.toLowerCase().replace(/\s+/g, '')}hs.example.com`,
        phone_numbers: ['(555) 555-1122'],
        linkedin_url: 'https://linkedin.com/in/jamie-rodriguez-nursing-mock',
        skills: ['Nursing Leadership', 'Patient Safety', 'Clinical Operations', 'Healthcare Management'],
        bio: `Experienced Director of Nursing leading teams in ${locationName}.`
      }
    ]
  };
}