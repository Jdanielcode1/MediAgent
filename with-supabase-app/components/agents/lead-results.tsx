"use client";

import { useState } from "react";
import { Linkedin, Building, Phone, Mail, User, MapPin, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

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
}

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

export default function LeadResults({ query }: { query: string }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleContactLead = (lead: Lead) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Here you would typically update the lead status in your database
      alert(`Contact initiated with ${lead.name}`);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600">🔍</span>
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-4">Found {mockLeads.length} potential leads matching your criteria</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {mockLeads.map((lead) => (
              <Card 
                key={lead.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedLead?.id === lead.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedLead(lead)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <User size={24} className="text-gray-500" />
                      </div>
                      
                      <div>
                        <h4 className="font-medium">{lead.name}</h4>
                        <p className="text-sm text-gray-600">{lead.title}</p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Building size={14} className="mr-1" />
                          {lead.company}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {lead.location}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                      <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        {lead.matchScore}% Match
                      </div>
                      <div className="flex mt-2 gap-2">
                        {lead.linkedinUrl && (
                          <a href={`https://${lead.linkedinUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                            <Linkedin size={18} />
                          </a>
                        )}
                        {lead.email && (
                          <a href={`mailto:${lead.email}`} className="text-gray-600">
                            <Mail size={18} />
                          </a>
                        )}
                        {lead.phone && (
                          <a href={`tel:${lead.phone}`} className="text-gray-600">
                            <Phone size={18} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap gap-2">
                    {lead.tags.map((tag, index) => (
                      <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {selectedLead?.id === lead.id && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <div className="text-sm">
                          <p>This lead matches your search criteria for wound care specialists with manual tracking systems.</p>
                        </div>
                        <Button 
                          onClick={() => handleContactLead(lead)} 
                          disabled={isLoading}
                          className="flex items-center gap-1"
                        >
                          {isLoading ? 'Initiating...' : 'Contact Lead'}
                          {!isLoading && <ChevronRight size={16} />}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}