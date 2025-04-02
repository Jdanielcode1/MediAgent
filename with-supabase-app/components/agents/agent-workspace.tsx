"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Database, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import SearchResults from "./search-results";

export default function AgentWorkspace({ agent }: { agent: any }) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
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
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
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
        <span>Agent {agent.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold">Agent Workspace {agent.id}</h1>
          <span className="text-sm text-orange-500">• Created Workspace 5/11/2023</span>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Plus size={16} />
            <span>Create New Lead</span>
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Calendar size={16} />
            <span>Meetings</span>
          </Button>
          
          <Button variant="outline" className="gap-2">
            <Database size={16} />
            <span>Database</span>
          </Button>
          
          <Button variant="outline" className="gap-2 text-red-500 hover:text-red-600">
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 space-y-6">
        {/* Question */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mt-1">
            <span className="text-sm">👤</span>
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-medium mb-2">Who are you looking to reach out today?</h2>
            
            <div className="relative">
              <textarea
                ref={textareaRef}
                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
                placeholder="Describe your target audience..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              
              {!isSearching && !showResults && (
                <div className="absolute bottom-4 right-4 text-sm text-gray-500">
                  Press Enter to search
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Loading indicator */}
        {isSearching && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm">🔍</span>
            </div>
            
            <div className="flex-1">
              <p className="text-lg mb-2">Searching for your ideal leads based on input...</p>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse"></div>
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-4 h-4 rounded-full bg-gray-300 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Search results */}
        {showResults && <SearchResults />}
      </div>
    </div>
  );
}