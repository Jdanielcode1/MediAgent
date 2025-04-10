"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, Database, Plus, Trash2, Edit2, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createClient } from "@/utils/supabase/client";

interface Agent {
  id: string;
  name: string;
  [key: string]: any;
}

export default function AgentHeader({ agent }: { agent: Agent }) {
  const [isEditing, setIsEditing] = useState(false);
  const [agentName, setAgentName] = useState(agent.name || `Agent ${agent.id.substring(0, 8)}`);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleRename = async () => {
    if (!agentName.trim()) {
      setAgentName(agent.name || `Agent ${agent.id.substring(0, 8)}`);
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('agents')
        .update({ name: agentName })
        .eq('id', agent.id);
      
      if (error) {
        console.error("Error updating agent name:", error);
        // Revert to original name on error
        setAgentName(agent.name || `Agent ${agent.id.substring(0, 8)}`);
      }
    } catch (error) {
      console.error("Error updating agent name:", error);
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              className="text-xl font-bold h-10 w-64"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                } else if (e.key === 'Escape') {
                  setAgentName(agent.name || `Agent ${agent.id.substring(0, 8)}`);
                  setIsEditing(false);
                }
              }}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRename}
              disabled={isSaving}
            >
              <Check size={18} className="text-green-500" />
            </Button>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">{agentName}</h1>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsEditing(true)}
              className="ml-1"
            >
              <Edit2 size={16} />
            </Button>
            <span className="text-sm text-orange-500">• ID: {agent.id.substring(0, 8)}...</span>
          </>
        )}
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
  );
}