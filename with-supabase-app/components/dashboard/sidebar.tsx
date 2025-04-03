"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Settings, ChevronDown } from "lucide-react";

export default function Sidebar() {
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
          href="/" 
          className={`flex items-center gap-2 p-4 mx-2 rounded-lg ${
            pathname === "/" ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
          }`}
        >
          <LayoutGrid size={20} />
          <span>Dashboard</span>
        </Link>
        
        <div className="p-4 font-medium mt-4">Workspaces</div>
        
        <div className="px-2">
          <div className="flex items-center gap-2 p-2 cursor-pointer" onClick={() => setExpandedWorkspace(!expandedWorkspace)}>
            <ChevronDown size={16} className={`transition-transform ${expandedWorkspace ? 'rotate-0' : '-rotate-90'}`} />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                <span className="text-xs">📄</span>
              </div>
              <span>Agent Workspace 1</span>
            </div>
          </div>
          
          {expandedWorkspace && (
            <div className="ml-6 mt-2 space-y-4">
              <Link 
                href="/protected/agent/1" 
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  pathname === "/protected/agent/1" ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${pathname === "/protected/agent/1" ? "bg-white" : "bg-black"}`}></div>
                <span>Agent 1</span>
              </Link>
              <Link 
                href="/protected/agent/2" 
                className={`flex items-center gap-2 p-2 rounded-lg ${
                  pathname === "/protected/agent/2" ? "bg-[#231F20] text-white" : "hover:bg-gray-200"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${pathname === "/protected/agent/2" ? "bg-white" : "bg-black"}`}></div>
                <span>Agent 2</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings" className="flex items-center gap-2">
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}