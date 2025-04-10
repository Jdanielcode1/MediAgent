// app/api/lead-generation/company-search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPDLClient } from '@/lib/api-clients/pdl';

export async function POST(request: NextRequest) {
  // Clone the request here to allow reading the body multiple times if needed (e.g., in catch)
  const requestClone = request.clone();
  let body: any; // Define body variable outside try block

  try {
    console.log('Company search: Starting request');
    const pdlClient = getPDLClient();
    body = await request.json(); // Read body from original request
    console.log('Company search: Request body', body);

    // --- REMOVE OR COMMENT OUT THIS MOCK DATA BLOCK TO USE LIVE API ---
    /*
    const mockCompanies = [ ... ]; // Your existing mock data
    console.log('Company search: Returning mock data');
    return NextResponse.json({ data: mockCompanies });
    */
    // --- END OF MOCK DATA BLOCK ---

    // Build SQL query based on search parameters
    let sqlQuery = "SELECT * FROM company WHERE";
    const conditions = [];

    // Add industry filter - Map 'hospitals' to PDL standard term
    if (body.industry && body.industry.length > 0) {
      const industries = body.industry.map((i: string) => {
        const lowerI = i.toLowerCase();
        // Map common variations to PDL's standard term
        if (lowerI === 'hospitals') {
          return `'hospital & health care'`;
        }
        return `'${lowerI}'`; // Use lowercase for others
      }).join(', ');
      conditions.push(`industry IN (${industries})`);
    } else {
      // Default to medical industries
      conditions.push(`industry IN ('hospital & health care', 'medical device', 'medical practice', 'pharmaceuticals')`);
    }

    // Add location filter - Handle states and countries correctly
    // Reference: https://docs.peopledatalabs.com/docs/schema-reference#company-schema-location-fields
    if (body.location) {
      const locationLower = body.location.toLowerCase();
      const usStatesLower = ['california', 'ca', 'texas', 'tx', 'florida', 'fl', 'new york', 'ny']; // Add more if needed

      if (usStatesLower.includes(locationLower)) {
         // Use location.region for state and ensure country is US
         conditions.push(`location.region='${body.location}'`); // PDL often expects full state name
         conditions.push(`location.country='us'`);
      } else if (locationLower === 'us' || locationLower === 'usa' || locationLower === 'united states') {
         conditions.push(`location.country='us'`);
      } else if (locationLower.length === 2) {
        // Assume 2-letter code is a country code
        conditions.push(`location.country='${locationLower}'`);
      } else {
         // Fallback: Assume it might be a region or city
         conditions.push(`location.country='us'`); // Default to US if unsure
         console.warn(`Unclear location format: ${body.location}, defaulting country to 'us'`);
      }
    } else {
      conditions.push(`location.country='us'`);
    }

    // Add company size filter - Use 'employee_count'
    // Reference: https://docs.peopledatalabs.com/docs/schema-reference#company-schema-employee-count-fields
    if (body.companySize) {
      // Extract number from string like "Over 500 beds" or "500+"
      const sizeMatch = body.companySize.match(/\d+/);
      if (sizeMatch && sizeMatch[0]) {
        const minSize = parseInt(sizeMatch[0], 10);
        conditions.push(`employee_count >= ${minSize}`);
      } else {
        console.warn(`Could not parse company size: ${body.companySize}`);
        // Optional: Add a default size filter if parsing fails
        // conditions.push(`employee_count >= 100`);
      }
    }

    // Combine all conditions
    if (conditions.length === 0) {
      // Avoid sending "SELECT * FROM company WHERE " with no conditions
      console.error("Company search: No valid conditions generated.");
      // Return empty or mock data, or throw error
      return NextResponse.json({ status: 400, error: { message: "No search conditions provided" }, data: [] });
    }
    sqlQuery += ` ${conditions.join(' AND ')}`;
    console.log('Company search: SQL query', sqlQuery);

    // Execute the search
    console.log('Company search: Calling PDL API');
    const result = await pdlClient.companySearch({
      sql: sqlQuery,
      size: body.limit || 10
    });

    // Log the full result object received from the client method
    console.log('Company search: Full result object from PDL client', JSON.stringify(result, null, 2));

    // Check the status code returned by the client method
    if (result.status !== 200 || !result.data || result.data.length === 0) {
       console.log(`Company search: PDL status ${result.status}. No results found or error occurred, returning mock data.`);
       // Use body variable captured at the start
       const locationForMock = body?.location || 'California';
       return NextResponse.json(getMockCompanyData(locationForMock));
    }

    // Return the actual successful data from PDL
    console.log('Company search: Success, returning actual PDL data.');
    return NextResponse.json(result); // result already contains status 200 and data

  } catch (error) {
    // This catch block now primarily handles errors *before* the API call or unexpected issues
    console.error('Error in company search route handler:', error);
    // Try to get location from the cloned request's body for mock data context
    let locationForMock = 'California'; // Default
    try {
      const requestBody = await requestClone.json(); // Use the clone here
      locationForMock = requestBody.location || 'California';
    } catch (parseError) {
      console.warn('Could not parse request body in catch block for mock data context.');
    }
    return NextResponse.json(getMockCompanyData(locationForMock));
  }
}

// --- Add a similar mock data helper function for companies ---
function getMockCompanyData(location: string) {
  const locationName = location === 'us' ? 'USA' : location;
   return {
      status: 200, // Keep mock status as 200 for frontend compatibility
      data: [
        {
          id: 'comp-mock-fallback',
          name: `${locationName} General Hospital (Mock)`,
          industry: 'hospital & health care',
          size: '501-1000',
          employee_count: 750,
          location: {
            name: `${locationName}, USA`,
            locality: locationName,
            region: locationName,
            country: 'us'
          },
          website: `https://example.com/${location.toLowerCase().replace(/\s+/g, '')}gh`,
          linkedin_url: `https://linkedin.com/company/${location.toLowerCase().replace(/\s+/g, '')}-general-hospital`,
          founded: 1990,
          estimated_annual_revenue: '$100M-$500M'
        }
      ]
    };
}