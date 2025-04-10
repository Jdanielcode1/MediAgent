"use client";

import { MoreVertical, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Link from "next/link";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CurrentLeads({ leads }: { leads: any[] }) {
  // Calculate lead statistics
  const totalLeads = leads.length;
  const contacted = leads.filter(lead => lead.status === "contacted").length;
  const inQualification = leads.filter(lead => lead.status === "qualification").length;
  const proposalSent = leads.filter(lead => lead.status === "proposal").length;
  const closedWon = leads.filter(lead => lead.status === "closed_won").length;
  
  // Prepare chart data
  const data = {
    labels: ["Contacted", "In Qualification", "Proposal Sent", "Closed Won", "Other"],
    datasets: [
      {
        data: [
          contacted, 
          inQualification, 
          proposalSent, 
          closedWon,
          totalLeads - (contacted + inQualification + proposalSent + closedWon)
        ],
        backgroundColor: [
          "#4F46E5", // Purple
          "#10B981", // Green
          "#FBBF24", // Yellow
          "#34D399", // Teal
          "#6B7280", // Gray
        ],
        borderWidth: 0,
      },
    ],
  };
  
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "70%",
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Lead Pipeline</CardTitle>
        <Link href="/protected/leads">
          <Button variant="ghost" size="sm" className="gap-1">
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-48 h-48 relative">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold">{totalLeads}</div>
            <div className="text-sm text-gray-500">Total Leads</div>
          </div>
        </div>
        <div className="space-y-4 mt-4 md:mt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>
              <div className="flex-1">{contacted} Contacted</div>
              <div className="text-sm font-medium">{Math.round((contacted/totalLeads)*100) || 0}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <div className="flex-1">{inQualification} In Qualification</div>
              <div className="text-sm font-medium">{Math.round((inQualification/totalLeads)*100) || 0}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div>
              <div className="flex-1">{proposalSent} Proposal Sent</div>
              <div className="text-sm font-medium">{Math.round((proposalSent/totalLeads)*100) || 0}%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#34D399]"></div>
              <div className="flex-1">{closedWon} Closed Won</div>
              <div className="text-sm font-medium">{Math.round((closedWon/totalLeads)*100) || 0}%</div>
            </div>
          </div>
          
          <div className="pt-4 text-sm border-t">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <div>Dr. Sarah Johnson at Boston Medical reviewing proposal</div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <div>Demo scheduled with Mass General Wound Care Unit</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}