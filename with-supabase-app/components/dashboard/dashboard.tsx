import SalesTeamMonitor from "./sales-team-monitor";
import CurrentLeads from "./current-leads"
import RevenueForecast from "./revenue-forecast"
import { Button } from "../ui/button";
import { Filter, Plus } from "lucide-react";

export default function Dashboard({ agents, leads, revenue }: { agents: any[], leads: any[], revenue: any[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="default" className="gap-2 bg-black text-white">
            <Plus size={16} />
            <span>New Agent</span>
          </Button>
          <Button variant="outline" className="gap-2">
            <Filter size={16} />
            <span>Filter</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesTeamMonitor agents={agents} />
        <CurrentLeads leads={leads} />
      </div>
      
      <RevenueForecast revenue={revenue} />
    </div>
  );
}