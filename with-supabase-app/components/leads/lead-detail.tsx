"use client";

import { useState } from "react";
import { 
  Linkedin, Building, Phone, Mail, User, MapPin, 
  ArrowLeft, Calendar, Send, Edit, Trash, ExternalLink 
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Lead } from "@/lib/types/lead-types";
import Link from "next/link";
import { Textarea } from "../ui/textarea";

export default function LeadDetail({ lead }: { lead: Lead }) {
  const [emailContent, setEmailContent] = useState("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  
  const handleGenerateEmail = async () => {
    setIsGeneratingEmail(true);
    
    try {
      // Simulate email generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setEmailContent(`Subject: Innovative Solutions for ${lead.company}'s Healthcare Challenges

Dear ${lead.name},

I hope this email finds you well. As the ${lead.title} at ${lead.company}, I understand the unique challenges you face in optimizing patient care while managing operational efficiency.

Our platform has helped organizations like yours streamline their processes and improve outcomes. I'd love to schedule a brief 15-minute call to discuss how we might be able to address your specific needs.

Would you have time next week for a quick conversation?

Best regards,
Your Name
MediAgent
your.email@mediagent.com
(555) 123-4567`);
    } catch (error) {
      console.error("Error generating email:", error);
    } finally {
      setIsGeneratingEmail(false);
    }
  };
  
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
        <div className="flex items-center gap-2">
          <Link href="/protected/leads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          {lead.matchScore && (
            <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm font-medium">
              {lead.matchScore}% match
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button variant="destructive" size="sm" className="gap-2">
            <Trash className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column: Lead info */}
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{lead.title}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{lead.company}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{lead.location}</span>
                </div>
                
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
                      onClick={() => openLinkedIn(lead.linkedinUrl!)}
                    >
                      View LinkedIn Profile <ExternalLink className="h-3 w-3 inline ml-1" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Actions</h2>
                <div className="space-y-2">
                  <Button className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    <span>Send Email</span>
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Schedule Meeting</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right column: Tabs with different views */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardContent className="p-4 space-y-6">
                  {lead.bio && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Bio</h3>
                      <p>{lead.bio}</p>
                    </div>
                  )}
                  
                  {lead.skills && lead.skills.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {lead.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-gray-100">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lead.tags && lead.tags.length > 0 && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {lead.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {lead.industry && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Industry</h3>
                      <p>{lead.industry}</p>
                    </div>
                  )}
                  
                  {lead.companySize && (
                    <div>
                      <h3 className="text-md font-medium mb-2">Company Size</h3>
                      <p>{lead.companySize}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium">Email Draft</h3>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleGenerateEmail}
                        disabled={isGeneratingEmail}
                      >
                        {isGeneratingEmail ? "Generating..." : "Generate Email"}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={!emailContent}
                        onClick={() => navigator.clipboard.writeText(emailContent)}
                      >
                        Copy to Clipboard
                      </Button>
                    </div>
                  </div>
                  
                  <Textarea 
                    className="min-h-[300px] font-mono text-sm"
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    placeholder="Click 'Generate Email' to create a personalized email draft for this lead."
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notes">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-md font-medium mb-4">Notes</h3>
                  <Textarea 
                    className="min-h-[200px]"
                    placeholder="Add notes about this lead here..."
                  />
                  <Button className="mt-4">Save Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-md font-medium mb-4">Activity History</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email Sent</p>
                        <p className="text-sm text-gray-500">Introduction email sent to lead</p>
                        <p className="text-xs text-gray-400 mt-1">June 15, 2023 - 10:23 AM</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Lead Created</p>
                        <p className="text-sm text-gray-500">Lead added to database</p>
                        <p className="text-xs text-gray-400 mt-1">June 10, 2023 - 2:45 PM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}