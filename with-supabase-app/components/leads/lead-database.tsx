"use client";

import { useState } from "react";
import { 
  Linkedin, Building, Phone, Mail, User, MapPin, 
  Search, Filter, Plus, ExternalLink, MoreHorizontal 
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Lead } from "@/lib/types/lead-types";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function LeadDatabase({ leads }: { leads: Lead[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Filter leads based on search term
  const filteredLeads = leads.filter(lead => {
    const searchLower = searchTerm.toLowerCase();
    return (
      lead.name.toLowerCase().includes(searchLower) ||
      lead.title.toLowerCase().includes(searchLower) ||
      lead.company.toLowerCase().includes(searchLower) ||
      lead.location.toLowerCase().includes(searchLower)
    );
  });
  
  const openLinkedIn = (url: string) => {
    if (url) {
      // Ensure URL has https:// prefix
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      window.open(formattedUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lead Database</h1>
        <div className="flex gap-2">
          <Button variant="default" className="gap-2">
            <Plus size={16} />
            <span>Add Lead</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search leads by name, title, company..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Lead table */}
        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Match</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id}
                      className={`cursor-pointer ${selectedLead?.id === lead.id ? 'bg-blue-50' : ''}`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.title}</TableCell>
                      <TableCell>{lead.company}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          {lead.matchScore}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Draft Email</DropdownMenuItem>
                            <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                            <DropdownMenuItem>Edit Lead</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Lead details */}
        <div>
          {selectedLead ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{selectedLead.name}</h2>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {selectedLead.matchScore}% match
                  </Badge>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedLead.title}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedLead.company}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{selectedLead.location}</span>
                    </div>
                    
                    {selectedLead.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedLead.email}</span>
                      </div>
                    )}
                    
                    {selectedLead.phone && (
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{selectedLead.phone}</span>
                      </div>
                    )}
                    
                    {selectedLead.linkedinUrl && (
                      <div className="flex items-center text-sm">
                        <Linkedin className="h-4 w-4 mr-2 text-blue-600" />
                        <button 
                          className="text-blue-600 hover:underline"
                          onClick={() => openLinkedIn(selectedLead.linkedinUrl!)}
                        >
                          View LinkedIn Profile <ExternalLink className="h-3 w-3 inline ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {selectedLead.tags && selectedLead.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedLead.bio && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Bio</h3>
                      <p className="text-sm">{selectedLead.bio}</p>
                    </div>
                  )}
                  
                  {selectedLead.skills && selectedLead.skills.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedLead.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-4 flex gap-2">
                    <Button size="sm" className="gap-2">
                      <Mail className="h-4 w-4" />
                      Draft Email
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Schedule Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-gray-500">
                <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>Select a lead to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}