// lib/api-clients/pdl.ts
class PeopleDataLabsClient {
    private apiKey: string;
    private baseUrl: string = 'https://api.peopledatalabs.com/v5';
  
    constructor(apiKey: string) {
      this.apiKey = apiKey;
      console.log('PDL Client initialized with API key:', apiKey ? `${apiKey.substring(0, 4)}...` : 'missing');
    }
  
    async companySearch(params: any) {
      try {
        console.log('PDL companySearch: Starting with params', params);
        const requestParams: Record<string, string> = {};

        if (params.sql) {
          requestParams.sql = params.sql;
        } else if (params.query) {
          requestParams.query = typeof params.query === 'string'
            ? params.query
            : JSON.stringify(params.query);
        }

        if (params.size) {
          requestParams.size = params.size.toString();
        }

        const url = new URL(`${this.baseUrl}/company/search`);
        Object.entries(requestParams).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });

        const fullUrl = url.toString();
        console.log('PDL companySearch: Request URL', fullUrl);

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        });

        console.log('PDL companySearch: Response status', response.status, response.statusText);

        // Always try to parse JSON, even for errors, as PDL often includes error details in the body
        const data = await response.json();

        // Log the raw response data received from PDL
        console.log('PDL companySearch: Raw response data received', JSON.stringify(data, null, 2));

        // Add the status code to the returned object for the handler to check
        data.status = response.status; // Overwrite or add status from the response itself

        // Don't throw error here, let the route handler decide based on status
        // if (!response.ok) {
        //   console.error('PDL API error response details:', data);
        //   throw new Error(`PDL API error: ${response.status} ${response.statusText}`);
        // }

        return data;
      } catch (error) {
        console.error('PDL companySearch: Fetch/Parse error', error);
        // Return a structured error object if fetch or JSON parsing fails
        return {
          status: 500, // Indicate internal error
          error: {
             type: 'client_fetch_error',
             message: error instanceof Error ? error.message : 'Unknown fetch error'
          }
        };
      }
    }
  
    async personSearch(params: any) {
      try {
        console.log('PDL personSearch: Starting with params', params);
        const requestParams: Record<string, string> = {};

        if (params.sql) {
          requestParams.sql = params.sql;
        } else if (params.query) {
          requestParams.query = typeof params.query === 'string'
            ? params.query
            : JSON.stringify(params.query);
        }

        if (params.size) {
          requestParams.size = params.size.toString();
        }

        const url = new URL(`${this.baseUrl}/person/search`);
        Object.entries(requestParams).forEach(([key, value]) => {
           // Ensure value is defined before appending
           if (value !== undefined && value !== null) {
             url.searchParams.append(key, value);
           }
        });

        const fullUrl = url.toString();
        console.log('PDL personSearch: Request URL', fullUrl);

        const response = await fetch(fullUrl, {
          method: 'GET',
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        });

        console.log('PDL personSearch: Response status', response.status, response.statusText);

        // Always try to parse JSON, even for errors
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            // Handle cases where the response is not valid JSON (e.g., unexpected server error HTML)
            console.error('PDL personSearch: Failed to parse JSON response', jsonError);
            const errorText = await response.text().catch(() => 'Could not read error text'); // Try reading text as fallback
            data = {
                status: response.status, // Still report the original status
                error: {
                    type: 'invalid_json_response',
                    message: 'Failed to parse JSON response from PDL.',
                    details: errorText // Include raw text if possible
                }
            };
        }


        // Log the raw response data received from PDL (or the error structure)
        console.log('PDL personSearch: Raw response data received', JSON.stringify(data, null, 2));

        // Add the status code to the returned object if it wasn't added during JSON parse error handling
        if (data.status === undefined) {
            data.status = response.status;
        }

        return data; // Return the data object (could be success or error structure)
      } catch (error) {
        // This catch block now handles network errors or unexpected issues during fetch setup
        console.error('PDL personSearch: Fetch setup or network error', error);
         // Return a structured error object
        return {
          status: 500, // Indicate internal client error
          error: {
             type: 'client_fetch_error',
             message: error instanceof Error ? error.message : 'Unknown fetch error'
          }
        };
      }
    }
  
    async personEnrich(params: any) {
      try {
        console.log('PDL personEnrich: Starting with params', params);
        const queryParams = new URLSearchParams();
        
        // Add all params to query string
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value as string);
          }
        });
        
        const fullUrl = `${this.baseUrl}/person/enrich?${queryParams.toString()}`;
        console.log('PDL personEnrich: Request URL', fullUrl);
        
        const response = await fetch(fullUrl, {
          headers: {
            'X-Api-Key': this.apiKey,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('PDL personEnrich: Response status', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('PDL API error response:', errorText);
          throw new Error(`PDL API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('PDL personEnrich: Response data received');
        return data;
      } catch (error) {
        console.error('PDL personEnrich: Fetch error', error);
        throw error;
      }
    }
}

// Singleton instance
let pdlClient: PeopleDataLabsClient | null = null;

export function getPDLClient() {
  if (!pdlClient) {
    // For server-side API routes, use the server-side variable
    const apiKey = process.env.PDL_API_KEY;
    console.log('PDL API Key available:', !!apiKey);
    
    if (!apiKey) {
      throw new Error('PDL API key is not defined');
    }
    pdlClient = new PeopleDataLabsClient(apiKey);
  }
  return pdlClient;
}