// lib/types/lead-types.ts
export interface Lead {
    id: string;
    name: string;
    title: string;
    company: string;
    location: string;
    email?: string;
    phone?: string;
    linkedinUrl?: string;
    tags: string[];
    matchScore: number;
    status?: string;
    // Additional fields from PDL/Clearbit
    bio?: string;
    skills?: string[];
    companySize?: string;
    industry?: string;
    companyWebsite?: string;
    companyLinkedin?: string;
    companyFounded?: number;
    companyRevenue?: string;
  }
  
  export interface SearchParams {
    query: string;
    filters?: {
      location?: string;
      companySize?: string;
      industry?: string[];
      title?: string[];
    };
    limit?: number;
  }