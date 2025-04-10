"use client";

import { useState, useRef } from "react";
import { Edit2, Check, Trash2 } from "lucide-react";
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
  const [name, setName] = useState(agent.name);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);
  };

  const handleSave = async () => {
    if (name.trim() === '') {
      setName(agent.name);
      setIsEditing(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('agents')
        .update({ name })
        .eq('id', agent.id);
      
      if (error) throw error;
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating agent name:', error);
      setName(agent.name);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setName(agent.name);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="text-2xl font-bold h-auto py-1"
            />
            <Button size="sm" variant="ghost" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            <Button size="sm" variant="ghost" onClick={handleEdit}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="text-sm text-gray-500">
          • ID: {agent.id.substring(0, 8)}...
        </div>
      </div>
      
      <div>
        <Button variant="outline" className="gap-2 text-red-500 hover:text-red-600">
          <Trash2 size={16} />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  );
}