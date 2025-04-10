"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Settings, ChevronDown, Database } from "lucide-react";

interface Agent {
  id: string;
  name?: string;
  [key: string]: any;
}

export default function Sidebar({ agents = [] }: { agents?: Agent[] }) {
  const [expandedWorkspace, setExpandedWorkspace] = useState(true);
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-[#FEE8E8] text-black flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold">MediAgent</h1>
      </div>
      
      <div className="p-4 font-medium">MENU</div>
      
      <div className="flex-1 overflow-y-auto">
        <Link 
          href="/protected/dashboard" 
          className={`flex items-center gap-2 p-4 mx-2 rounded-lg ${
            pathname === "/protected/dashboard" ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
          }`}
        >
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </Link>
        
        <Link 
          href="/protected/leads" 
          className={`flex items-center gap-2 p-4 mx-2 rounded-lg ${
            pathname === "/protected/leads" ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
          }`}
        >
          <Database size={20} />
          <span>Lead Database</span>
        </Link>
        
        <div className="p-4 font-medium mt-4">Workspaces</div>
        
        <div className="px-2">
          <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => setExpandedWorkspace(!expandedWorkspace)}>
            <ChevronDown size={16} className={`transition-transform ${expandedWorkspace ? 'rotate-0' : '-rotate-90'}`} />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                <span className="text-xs">📄</span>
              </div>
              <span>Agent Workspace</span>
            </div>
          </div>
          
          {expandedWorkspace && agents && agents.length > 0 && (
            <div className="ml-6 mt-2 space-y-4">
              {agents.map(agent => (
                <Link 
                  key={agent.id}
                  href={`/protected/agent/${agent.id}`}
                  className={`flex items-center gap-2 p-2 rounded-lg ${
                    pathname === `/protected/agent/${agent.id}` ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${pathname === `/protected/agent/${agent.id}` ? "bg-white" : "bg-black"}`}></div>
                  <span>{agent.name || `Agent ${agent.id.substring(0, 6)}`}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link 
          href="/protected/settings" 
          className={`flex items-center gap-2 p-2 rounded-lg ${
            pathname === "/protected/settings" ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}