"use client";

import { useState } from "react";
import { Linkedin, Building, Phone, Mail, User, MapPin, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { LeadGenerationService } from "@/services/lead-generation-service";

// Define Lead interface
interface Lead {
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

// Keep the mockLeads for fallback
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Wound Care Specialist",
    company: "Memorial Health Center",
    location: "Boston, MA",
    email: "sjohnson@memorialhealth.org",
    phone: "(617) 555-1234",
    linkedinUrl: "linkedin.com/in/sarahjohnson",
    tags: ["Medicare-certified", "50+ patients", "Manual tracking"],
    matchScore: 92
  },
  {
    id: "2",
    name: "Michael Rodriguez",
    title: "Director of Nursing",
    company: "Coastal Home Health Services",
    location: "San Diego, CA",
    email: "mrodriguez@coastalhealth.com",
    linkedinUrl: "linkedin.com/in/michaelrodriguez",
    tags: ["Home health", "Staff shortage", "Documentation issues"],
    matchScore: 87
  },
  {
    id: "3",
    name: "Jennifer Lee",
    title: "Clinical Director",
    company: "Advanced Wound Care Center",
    location: "Chicago, IL",
    phone: "(312) 555-9876",
    linkedinUrl: "linkedin.com/in/jenniferlee",
    tags: ["Chronic wounds", "Budget authority", "Interested in digital solutions"],
    matchScore: 85
  }
];

export default function LeadResults({ 
  query, 
  customLeads 
}: { 
  query: string;
  customLeads?: Lead[];
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enrichedLead, setEnrichedLead] = useState<Lead | null>(null);
  const leadService = new LeadGenerationService();
  
  // Use custom leads if provided, otherwise use mock leads
  const leads = customLeads || mockLeads;
  
  const handleContactLead = async (lead: Lead) => {
    setIsLoading(true);
    
    try {
      // Enrich the lead with additional data
      const enriched = await leadService.enrichLead(lead.id);
      if (enriched) {
        setEnrichedLead(enriched);
      }
      
      // Here you would typically update the lead status in your database
      // For now, just show a success message
      setTimeout(() => {
        setIsLoading(false);
        alert(`Contact initiated with ${lead.name}`);
      }, 1500);
    } catch (error) {
      console.error("Error contacting lead:", error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600">🔍</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Found {leads.length} potential leads matching your criteria</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leads.map((lead) => (
              <Card 
                key={lead.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedLead?.id === lead.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedLead(lead)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{lead.name}</h4>
                      <p className="text-sm text-gray-600">{lead.title}</p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Building size={14} className="mr-1" />
                        {lead.company}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <MapPin size={14} className="mr-1" />
                        {lead.location}
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-full px-2 py-1 text-xs font-medium">
                      {lead.matchScore}% match
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-1">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedLead && (
            <div className="mt-6 border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-medium">{selectedLead.name}</h3>
                  <p className="text-gray-600">{selectedLead.title} at {selectedLead.company}</p>
                </div>
                <div className="flex gap-2">
                  {selectedLead.linkedinUrl && (
                    <a 
                      href={`https://${selectedLead.linkedinUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    {selectedLead.email && (
                      <p className="text-sm flex items-center">
                        <Mail size={16} className="mr-2 text-gray-500" />
                        <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">
                          {selectedLead.email}
                        </a>
                      </p>
                    )}
                    {selectedLead.phone && (
                      <p className="text-sm flex items-center">
                        <Phone size={16} className="mr-2 text-gray-500" />
                        <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">
                          {selectedLead.phone}
                        </a>
                      </p>
                    )}
                    {selectedLead.linkedinUrl && (
                      <p className="text-sm flex items-center">
                        <Linkedin size={16} className="mr-2 text-gray-500" />
                        <a 
                          href={`https://${selectedLead.linkedinUrl}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {selectedLead.linkedinUrl}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Company Information</h4>
                  <p className="text-sm">{selectedLead.company}</p>
                  <p className="text-sm">{selectedLead.location}</p>
                  {selectedLead.industry && (
                    <p className="text-sm">Industry: {selectedLead.industry}</p>
                  )}
                  {selectedLead.companySize && (
                    <p className="text-sm">Size: {selectedLead.companySize} employees</p>
                  )}
                </div>
              </div>
              
              {enrichedLead && enrichedLead.id === selectedLead.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Additional Information</h4>
                  {enrichedLead.bio && (
                    <div className="mb-2">
                      <p className="text-sm text-gray-700">{enrichedLead.bio}</p>
                    </div>
                  )}
                  {enrichedLead.skills && enrichedLead.skills.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium">Skills:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {enrichedLead.skills.map((skill, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline">Save for Later</Button>
                <Button 
                  onClick={() => handleContactLead(selectedLead)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Initiating Contact...' : 'Contact Lead'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}