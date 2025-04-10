"use client";

import { useState } from "react";
import { Calendar, Database, Plus, Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import LeadResults from "./lead-results";
import AgentHeader from "./agent-header";
import { LeadGenerationService } from "@/services/lead-generation-service";
import { Lead } from "@/lib/types/lead-types";
import SearchStageIndicator from "./search-stage-indicator";
import FileDatabase from "./file-database";
import MeetingsView from "./meetings-view";
import CreateLeadForm from "./create-lead-form";

// Define a proper type for the agent
interface Agent {
  id: string;
  name: string;
  [key: string]: any; // For other properties
}

export default function AgentWorkspace({ agent }: { agent: Agent }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchStage, setSearchStage] = useState<string>("");
  const [showResults, setShowResults] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeView, setActiveView] = useState<string>("search"); // search, database, meetings, createLead
  
  const leadService = new LeadGenerationService();
  
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchStage("searching");
    setShowResults(false); // Hide previous results while searching
    setActiveView("search");
    
    try {
      // First stage: searching
      setTimeout(() => {
        setSearchStage("analyzing");
      }, 1500);
      
      // Perform the actual search
      const results = await leadService.searchLeads({ query });
      
      // Second stage: analyzing
      setTimeout(() => {
        setLeads(results);
        setSearchStage("complete");
        setIsSearching(false);
        setShowResults(true);
      }, 1500);
    } catch (error) {
      console.error("Error searching leads:", error);
      setIsSearching(false);
      setSearchStage("error");
    }
  };
  
  const handleViewChange = (view: string) => {
    setActiveView(view);
    // Hide search results when switching views
    if (view !== "search") {
      setShowResults(false);
    } else if (leads.length > 0) {
      // Show results again if we have them and we're switching back to search
      setShowResults(true);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-4">
        <span>Dashboard</span>
        <span className="mx-2">/</span>
        <span>Agent {agent.id.substring(0, 8)}</span>
      </div>

      {/* Header with agent info */}
      <div className="mb-6">
        <AgentHeader agent={agent} />
        
        {/* Action buttons - moved from AgentHeader to here */}
        <div className="mt-4 flex gap-2">
          <Button 
            variant={activeView === "createLead" ? "default" : "outline"} 
            className="gap-2"
            onClick={() => handleViewChange("createLead")}
          >
            <Plus size={16} />
            <span>Create New Lead</span>
          </Button>
          
          <Button 
            variant={activeView === "meetings" ? "default" : "outline"} 
            className="gap-2"
            onClick={() => handleViewChange("meetings")}
          >
            <Calendar size={16} />
            <span>Meetings</span>
          </Button>
          
          <Button 
            variant={activeView === "database" ? "default" : "outline"} 
            className="gap-2"
            onClick={() => handleViewChange("database")}
          >
            <Database size={16} />
            <span>Knowledge Base</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        {activeView === "search" && (
          <>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Who are you looking to reach out today?</h2>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Find nursing directors in Mississippi"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} disabled={isSearching || !query.trim()}>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
            
            {/* Show the search stage indicator when searching */}
            {(searchStage === "searching" || searchStage === "analyzing") && (
              <SearchStageIndicator stage={searchStage} query={query} />
            )}
            
            {/* Show results when search is complete */}
            {showResults && (
              <LeadResults 
                query={query} 
                customLeads={leads} 
                searchStage={searchStage}
              />
            )}
          </>
        )}
        
        {activeView === "database" && <FileDatabase agentId={agent.id} />}
        {activeView === "meetings" && <MeetingsView agentId={agent.id} />}
        {activeView === "createLead" && <CreateLeadForm agentId={agent.id} />}
      </div>
    </div>
  );
}