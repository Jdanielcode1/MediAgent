"use client";

import { useState } from "react";
import SalesTeamMonitor from "./sales-team-monitor";
import CurrentLeads from "./current-leads";
import RevenueForecast from "./revenue-forecast";
import SalesPerformance from "./sales-performance"
import TopProspects from "./top-prospects"
import { Button } from "../ui/button";
import { Filter, Plus, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid'

export default function Dashboard({ agents, leads, revenue }: { agents: any[], leads: any[], revenue: any[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreateAgent = async () => {
    if (!newAgentName.trim() || !newAgentEmail.trim()) return;
    
    setIsCreating(true);
    const supabase = createClient();
    
    try {
      const { data, error } = await supabase
        .from('agents')
        .insert([
          { 
            id: uuidv4(),
            name: newAgentName,
            email: newAgentEmail,
            created_at: new Date().toISOString()
          }
        ])
        .select();
        
      if (error) throw error;
      
      // Close dialog and reset form
      setIsDialogOpen(false);
      setNewAgentName("");
      setNewAgentEmail("");
      
      // Refresh the page to show the new agent
      router.refresh();
      
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">WoundTrack Pro Sales Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your team's performance and pipeline</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            <span>Export Report</span>
          </Button>
          <Button 
            variant="default" 
            className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus size={16} />
            <span>New Agent</span>
          </Button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Monthly Revenue</div>
            <div className="text-2xl font-bold mt-1">$60,000</div>
            <div className="text-sm text-green-600 mt-1">↑ 12% from last month</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Units Sold</div>
            <div className="text-2xl font-bold mt-1">24</div>
            <div className="text-sm text-green-600 mt-1">↑ 4 more than last month</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Active Leads</div>
            <div className="text-2xl font-bold mt-1">{leads.length}</div>
            <div className="text-sm text-green-600 mt-1">↑ 8 new this week</div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-l-4 border-l-amber-500">
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Avg. Sales Cycle</div>
            <div className="text-2xl font-bold mt-1">32 days</div>
            <div className="text-sm text-red-600 mt-1">↑ 3 days longer than target</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTeamMonitor agents={agents} />
        <CurrentLeads leads={leads} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueForecast revenue={revenue} />
        <SalesPerformance />
      </div>
      
      <TopProspects leads={leads} />
      
      {/* New Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Sales Agent</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="col-span-3"
                placeholder="Enter agent name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newAgentEmail}
                onChange={(e) => setNewAgentEmail(e.target.value)}
                className="col-span-3"
                placeholder="agent@woundtrack.com"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateAgent}
              disabled={isCreating || !newAgentName.trim() || !newAgentEmail.trim()}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isCreating ? "Creating..." : "Create Agent"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}