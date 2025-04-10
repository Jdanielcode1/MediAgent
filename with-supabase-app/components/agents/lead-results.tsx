"use client";

import { useEffect } from "react";
import { useState } from "react";
import { Linkedin, Building, Phone, Mail, User, MapPin, ChevronRight, Send, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { LeadGenerationService } from "@/services/lead-generation-service";
import { Textarea } from "../ui/textarea"

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
  customLeads,
  searchStage
}: { 
  query: string;
  customLeads?: Lead[];
  searchStage: string;
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [enrichedLead, setEnrichedLead] = useState<Lead | null>(null);
  const [emailContent, setEmailContent] = useState<string>('');
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [contactStatus, setContactStatus] = useState<{[key: string]: string}>({});
  const leadService = new LeadGenerationService();
  
  // Use custom leads if provided, otherwise use mock leads
  const leads = customLeads || mockLeads;
  
  // Reset email content when new leads are loaded or query changes
  useEffect(() => {
    setEmailContent('');
    setSelectedLead(null);
    setContactStatus({});
  }, [customLeads, query]);
  
  const handleContactLead = async (lead: Lead) => {
    setIsLoading(true);
    setContactStatus({...contactStatus, [lead.id]: 'contacting'});
    
    try {
      // Enrich the lead with additional data
      const enriched = await leadService.enrichLead(lead.id);
      if (enriched) {
        setEnrichedLead(enriched);
      }
      
      // Simulate a contact process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update status to contacted
      setContactStatus({...contactStatus, [lead.id]: 'contacted'});
      
      // Here you would typically update the lead status in your database
      console.log(`Contact initiated with ${lead.name}`);
    } catch (error) {
      console.error("Error contacting lead:", error);
      setContactStatus({...contactStatus, [lead.id]: 'error'});
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateEmail = async (lead: Lead) => {
    setIsGeneratingEmail(true);
    setSelectedLead(lead);
    
    try {
      // Generate an email for the selected lead
      const email = await leadService.generateEmail(lead, query);
      setEmailContent(email);
    } catch (error) {
      console.error("Error generating email:", error);
      setEmailContent("Sorry, there was an error generating the email. Please try again.");
    } finally {
      setIsGeneratingEmail(false);
    }
  };
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailContent);
    alert("Email copied to clipboard!");
  };
  
  const openLinkedIn = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      // Ensure URL has https:// prefix
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank');
    }
  };

  const getContactButtonText = (leadId: string) => {
    const status = contactStatus[leadId];
    if (status === 'contacting') return 'Contacting...';
    if (status === 'contacted') return 'Contacted';
    if (status === 'error') return 'Retry';
    return 'Contact';
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Found {leads.length} potential leads matching your criteria
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Lead cards */}
        <div className="space-y-4">
          {leads.map((lead) => (
            <Card 
              key={lead.id} 
              className={`cursor-pointer hover:border-blue-400 transition-colors ${selectedLead?.id === lead.id ? 'border-blue-500' : ''}`}
              onClick={() => setSelectedLead(lead)}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{lead.name}</h3>
                    {lead.title && <p className="text-gray-600">{lead.title}</p>}
                    
                    <div className="mt-2 space-y-1">
                      {lead.company && (
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{lead.company}</span>
                        </div>
                      )}
                      
                      {lead.location && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{lead.location}</span>
                        </div>
                      )}
                      
                      {lead.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{lead.email}</span>
                        </div>
                      )}
                      
                      {lead.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{lead.phone}</span>
                        </div>
                      )}
                      
                      {lead.linkedinUrl && (
                        <div className="flex items-center text-sm">
                          <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                          <button 
                            className="text-blue-600 hover:underline"
                            onClick={(e) => openLinkedIn(lead.linkedinUrl!, e)}
                          >
                            View LinkedIn Profile <ExternalLink className="h-3 w-3 inline ml-1" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lead.tags.map((tag, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                      {lead.matchScore}% match
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateEmail(lead);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Draft Email
                  </Button>
                  
                  <Button 
                    variant={contactStatus[lead.id] === 'contacted' ? "secondary" : "default"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleContactLead(lead);
                    }}
                    disabled={isLoading || contactStatus[lead.id] === 'contacting'}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    {getContactButtonText(lead.id)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Right column: Email draft or lead details */}
        <div>
          {emailContent ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Email Draft</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopyEmail}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
                
                <Textarea 
                  className="min-h-[300px] font-mono text-sm"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                />
              </CardContent>
            </Card>
          ) : selectedLead ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">Lead Details</h3>
                {/* Display more detailed information about the selected lead */}
                <div className="mt-4 space-y-3">
                  {selectedLead.bio && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                      <p>{selectedLead.bio}</p>
                    </div>
                  )}
                  
                  {selectedLead.skills && selectedLead.skills.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Skills</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedLead.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedLead.industry && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                      <p>{selectedLead.industry}</p>
                    </div>
                  )}
                  
                  {selectedLead.companySize && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Company Size</h4>
                      <p>{selectedLead.companySize}</p>
                    </div>
                  )}
                  
                  {isGeneratingEmail && (
                    <div className="py-4 text-center">
                      <div className="animate-pulse">Generating email...</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4 text-center text-gray-500">
                <p>Select a lead to view details or generate an email</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}