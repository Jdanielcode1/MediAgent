// services/lead-generation-service.ts
import { createClient } from "@/utils/supabase/client";
import { Lead, SearchParams } from "@/lib/types/lead-types";

export class LeadGenerationService {
  private supabase;
  
  constructor() {
    this.supabase = createClient();
  }
  
  async searchLeads(searchParams: SearchParams): Promise<Lead[]> {
    try {
      console.log('searchLeads: Starting with query', searchParams.query);
      // Parse the query using NLP
      const keywords = await this.parseQueryWithNLP(searchParams.query);
      console.log('searchLeads: Parsed keywords', keywords);
      
      // Skip PDL API calls and directly use mock person generator
      console.log('searchLeads: Bypassing PDL and using mock person generator');
      
      try {
        // Generate mock people based on the original query
        // We don't need to pass keywords here since generateMockPerson will get them
        const leads = await this.generateMockPerson(searchParams.query);
        
        // Save leads to Supabase
        await this.saveLeadsToDatabase(leads);
        
        return leads;
      } catch (mockError) {
        console.error('Error generating mock person:', mockError);
        // Final fallback to hardcoded mock data if everything else fails
        return [
          {
            id: "1",
            name: "Sarah Johnson",
            title: "Wound Care Specialist",
            company: "Memorial Health Center",
            location: "Boston, MA",
            email: "sjohnson@memorialhealth.org",
            phone: "(617) 555-1234",
            linkedinUrl: "linkedin.com/in/sarahjohnson",
            tags: ["Wound care", "Medicare-certified", "Staff shortage"],
            matchScore: 95
          },
          // Add more mock leads here
        ];
      }
    } catch (error) {
      console.error('Error searching leads:', error);
      throw error;
    }
  }
  
  private parseQuery(query: string): any {
    // Extract keywords from the query
    const keywords: {
      titles: string[];
      industries: string[];
      location: string;
      companySize: string;
      tags: string[];
    } = {
      titles: [],
      industries: [],
      location: '',
      companySize: '',
      tags: []
    };
    
    // Simple parsing logic - can be enhanced with NLP
    const lowerQuery = query.toLowerCase();
    
    // Extract titles
    if (lowerQuery.includes('wound care')) keywords.titles.push('wound care');
    if (lowerQuery.includes('nursing')) keywords.titles.push('nursing');
    if (lowerQuery.includes('director')) keywords.titles.push('director');
    if (lowerQuery.includes('clinical')) keywords.titles.push('clinical');
    if (lowerQuery.includes('medical')) keywords.titles.push('medical');
    
    // Extract industries
    if (lowerQuery.includes('hospital')) keywords.industries.push('hospital & health care');
    if (lowerQuery.includes('health care') || lowerQuery.includes('healthcare')) {
      keywords.industries.push('hospital & health care');
    }
    if (lowerQuery.includes('medical device')) keywords.industries.push('medical device');
    
    // Extract location
    if (lowerQuery.includes('boston')) keywords.location = 'boston';
    if (lowerQuery.includes('chicago')) keywords.location = 'chicago';
    if (lowerQuery.includes('san diego')) keywords.location = 'san diego';
    
    // Extract company size
    if (lowerQuery.includes('50+')) keywords.companySize = '51-200';
    if (lowerQuery.includes('100+')) keywords.companySize = '101-250';
    if (lowerQuery.includes('large')) keywords.companySize = '501-1000';
    
    // Extract tags
    if (lowerQuery.includes('medicare')) keywords.tags.push('Medicare-certified');
    if (lowerQuery.includes('manual tracking')) keywords.tags.push('Manual tracking');
    if (lowerQuery.includes('staff shortage')) keywords.tags.push('Staff shortage');
    if (lowerQuery.includes('documentation issues')) keywords.tags.push('Documentation issues');
    
    return keywords;
  }
  
  private async saveLeadsToDatabase(leads: Lead[]) {
    try {
      // Insert leads into Supabase
      const { error } = await this.supabase
        .from('leads')
        .upsert(
          leads.map(lead => ({
            id: lead.id,
            name: lead.name,
            title: lead.title,
            company: lead.company,
            location: lead.location,
            email: lead.email,
            phone: lead.phone,
            linkedin_url: lead.linkedinUrl,
            tags: lead.tags,
            match_score: lead.matchScore,
            bio: lead.bio,
            skills: lead.skills,
            industry: lead.industry,
            company_size: lead.companySize,
            company_website: lead.companyWebsite,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })),
          { onConflict: 'id' }
        );
      
      if (error) {
        console.error('Error saving leads to database:', error);
      }
    } catch (error) {
      console.error('Error saving leads to database:', error);
    }
  }
  
  private transformToLeads(people: any[], companies: any[], keywords: any): Lead[] {
    return people.map(person => {
      // Find matching company if available
      const personCompany = person.job_company_name;
      const matchingCompany = companies.find(c => 
        c.name.toLowerCase() === personCompany?.toLowerCase()
      );
      
      // Calculate match score based on relevance to search criteria
      let matchScore = 70; // Base score
      
      // Increase score based on title match
      if (keywords.titles.some((title: string) => 
        person.job_title?.toLowerCase().includes(title.toLowerCase())
      )) {
        matchScore += 10;
      }
      
      // Increase score based on industry match
      if (keywords.industries.some((industry: string) => 
        person.job_company_industry?.toLowerCase().includes(industry.toLowerCase())
      )) {
        matchScore += 5;
      }
      
      // Increase score based on location match
      if (keywords.location && 
          person.location?.name?.toLowerCase().includes(keywords.location.toLowerCase())) {
        matchScore += 5;
      }
      
      // Increase score based on specialty match (new field from NLP)
      if (keywords.specialties && keywords.specialties.length > 0 &&
          person.skills?.some((skill: string) => 
            keywords.specialties.some((specialty: string) => 
              skill.toLowerCase().includes(specialty.toLowerCase())
            )
          )
      ) {
        matchScore += 8;
      }
      
      // Generate tags based on available data and keywords
      const tags: string[] = [];
      
      // Add keyword tags
      keywords.tags.forEach((tag: string) => {
        tags.push(tag);
      });
      
      // Add pain point tags (new field from NLP)
      if (keywords.painPoints) {
        keywords.painPoints.forEach((point: string) => {
          tags.push(point);
        });
      }
      
      // Add company size tag if available
      if (matchingCompany?.size) {
        tags.push(`${matchingCompany.size} employees`);
      }
      
      // Add industry tag if available
      if (person.job_company_industry) {
        tags.push(person.job_company_industry);
      }
      
      return {
        id: person.id || `lead-${Math.random().toString(36).substr(2, 9)}`,
        name: `${person.first_name || ''} ${person.last_name || ''}`.trim(),
        title: person.job_title || 'Unknown Title',
        company: person.job_company_name || 'Unknown Company',
        location: person.location?.name || 'Unknown Location',
        email: person.work_email || person.personal_emails?.[0] || person.emails?.[0],
        phone: person.phone_numbers?.[0],
        linkedinUrl: person.linkedin_url,
        tags: tags.slice(0, 5), // Limit to 5 tags
        matchScore,
        bio: person.bio,
        skills: person.skills,
        industry: person.job_company_industry,
        companySize: matchingCompany?.size,
        companyWebsite: matchingCompany?.website,
        companyLinkedin: matchingCompany?.linkedin_url,
        companyFounded: matchingCompany?.founded,
        companyRevenue: matchingCompany?.estimated_annual_revenue,
        // Add new fields from NLP analysis
        specialties: keywords.specialties,
        painPoints: keywords.painPoints,
        budgetInfo: keywords.budgetInfo,
        timeframe: keywords.timeframe
      };
    });
  }
  
  async enrichLead(leadId: string): Promise<Lead | null> {
    try {
      // First, get the lead from the database
      const { data: lead, error } = await this.supabase
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      if (error || !lead) {
        console.error('Error fetching lead:', error);
        return null;
      }
      
      // Prepare parameters for enrichment
      const params = new URLSearchParams();
      if (lead.email) params.append('email', lead.email);
      if (lead.linkedin_url) params.append('linkedin', lead.linkedin_url);
      if (lead.name && lead.company) {
        params.append('name', lead.name);
        params.append('company', lead.company);
      }
      
      // Call the enrichment API
      const response = await fetch(`/api/lead-generation/person-enrich?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to enrich lead');
      }
      
      const enrichedData = await response.json();
      
      // Update the lead in the database with enriched data
      if (enrichedData.data) {
        const { error: updateError } = await this.supabase
          .from('leads')
          .update({
            bio: enrichedData.data.bio,
            skills: enrichedData.data.skills,
            industry: enrichedData.data.job_company_industry,
            updated_at: new Date().toISOString()
          })
          .eq('id', leadId);
        
        if (updateError) {
          console.error('Error updating lead with enriched data:', updateError);
        }
      }
      
      // Return the enriched lead
      return {
        ...lead,
        bio: enrichedData.data?.bio,
        skills: enrichedData.data?.skills,
        industry: enrichedData.data?.job_company_industry,
        // Transform other fields as needed
        id: lead.id,
        name: lead.name,
        title: lead.title,
        company: lead.company,
        location: lead.location,
        email: lead.email,
        phone: lead.phone,
        linkedinUrl: lead.linkedin_url,
        tags: lead.tags,
        matchScore: lead.match_score
      };
    } catch (error) {
      console.error('Error enriching lead:', error);
      return null;
    }
  }

  async parseQueryWithNLP(query: string): Promise<any> {
    try {
      // Call the OpenAI API route
      const response = await fetch('/api/lead-generation/query-parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      if (!response.ok) {
        throw new Error('Failed to parse query with NLP');
      }
      
      const parsedData = await response.json();
      
      // Ensure we have the expected structure even if some fields are missing
      return {
        titles: parsedData.titles || [],
        industries: parsedData.industries || [],
        location: parsedData.location || '',
        companySize: parsedData.companySize || '',
        tags: parsedData.tags || [],
        specialties: parsedData.specialties || [],
        painPoints: parsedData.painPoints || [],
        budgetInfo: parsedData.budgetInfo || '',
        timeframe: parsedData.timeframe || ''
      };
    } catch (error) {
      console.error('Error parsing query with NLP:', error);
      // Fall back to the basic parsing method
      return this.parseQuery(query);
    }
  }

  async generateMockPerson(prompt: string): Promise<Lead[]> {
    try {
      console.log('Generating mock person with prompt:', prompt);
      
      // First, parse the query to get keywords for tags
      const keywords = await this.parseQueryWithNLP(prompt);
      console.log('Generated keywords for mock person:', keywords);
      
      const response = await fetch('/api/generate-mock-person', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate mock person');
      }
      
      const result = await response.json();
      console.log('Generated mock person result:', result);
      
      // The API returns data in an array format similar to PDL responses
      // Pass the keywords to ensure tags are properly applied
      return this.transformToLeads(result.data || [], [], keywords);
    } catch (error) {
      console.error('Error generating mock person:', error);
      throw error;
    }
  }
}