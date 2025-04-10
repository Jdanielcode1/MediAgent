"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Database, Plus, Trash2, Search } from "lucide-react";
import { Button } from "../ui/button";
import LeadResults from "./lead-results";
import AgentHeader from "./agent-header"
import SearchInterface from "./search-interface"

// Define a proper type for the agent
interface Agent {
  id: string;
  name: string;
  [key: string]: any; // For other properties
}

export default function AgentWorkspace({ agent }: { agent: Agent }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchStage, setSearchStage] = useState<"idle" | "searching" | "analyzing" | "complete">("idle");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [query]);

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchStage("searching");
    
    // Simulate search stages
    setTimeout(() => {
      setSearchStage("analyzing");
      
      setTimeout(() => {
        setSearchStage("complete");
        setIsSearching(false);
        setShowResults(true);
      }, 2000);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
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

      {/* Header */}
      <AgentHeader agent={agent} />

      {/* Main content */}
      <div className="flex-1 space-y-6">
        <SearchInterface 
          query={query}
          setQuery={setQuery}
          textareaRef={textareaRef as React.RefObject<HTMLTextAreaElement>}
          handleKeyDown={handleKeyDown}
          isSearching={isSearching}
          showResults={showResults}
        />

        {/* Loading indicator with stages */}
        {isSearching && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm">🔍</span>
            </div>
            
            <div className="flex-1">
              <p className="text-lg mb-2">
                {searchStage === "searching" && "Searching for your ideal leads based on input..."}
                {searchStage === "analyzing" && "Analyzing potential matches and qualifying leads..."}
              </p>
              
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${searchStage === "searching" ? "bg-blue-500" : "bg-gray-300"} animate-pulse`}></div>
                <div className={`w-4 h-4 rounded-full ${searchStage === "analyzing" ? "bg-blue-500" : "bg-gray-300"} animate-pulse`} style={{ animationDelay: "0.2s" }}></div>
                <div className={`w-4 h-4 rounded-full ${searchStage === "complete" ? "bg-blue-500" : "bg-gray-300"} animate-pulse`} style={{ animationDelay: "0.4s" }}></div>
              </div>
              
              {searchStage === "searching" && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Search className="text-blue-600" size={20} />
                    <span className="font-medium">Searching LinkedIn for wound care specialists & nursing directors...</span>
                  </div>
                </div>
              )}
              
              {searchStage === "analyzing" && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <Search className="text-green-600" size={20} />
                    <span className="font-medium">Identifying Medicare-certified facilities with manual tracking systems...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search results */}
        {showResults && <LeadResults query={query} />}
      </div>
    </div>
  );
}