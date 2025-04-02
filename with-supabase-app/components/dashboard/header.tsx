"use client";

import { useState } from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className="border-b border-gray-200 bg-[#FEE8E8]">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500">Dashboard</span>
        </div>
        
        <div className="flex-1 max-w-xl mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-black text-white"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2">
            <Bell size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm">JD</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">John Doe</div>
              <div className="text-gray-500 text-xs">johndoe@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}