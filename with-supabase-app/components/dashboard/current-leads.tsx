"use client";

import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function CurrentLeads({ leads }: { leads: any[] }) {
  // Calculate lead statistics
  const totalLeads = leads.length;
  const contacted = leads.filter(lead => lead.status === "contacted").length;
  const inQualification = leads.filter(lead => lead.status === "qualification").length;
  const proposalSent = leads.filter(lead => lead.status === "proposal").length;
  
  // Prepare chart data
  const data = {
    labels: ["Contacted", "In Qualification", "Proposal Sent", "Other"],
    datasets: [
      {
        data: [contacted, inQualification, proposalSent, totalLeads - (contacted + inQualification + proposalSent)],
        backgroundColor: [
          "#4F46E5", // Purple
          "#10B981", // Green
          "#FBBF24", // Yellow
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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Current Leads</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row items-center justify-between">
        <div className="w-48 h-48">
          <Doughnut data={data} options={options} />
        </div>
        <div className="space-y-4 mt-4 md:mt-0">
          <div className="text-lg font-medium">{totalLeads} active</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4F46E5]"></div>
              <div>{contacted} Contacted</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
              <div>{inQualification} In Qualification</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div>
              <div>{proposalSent} Proposal Sent</div>
            </div>
          </div>
          
          <div className="pt-4">
            <div>Agent 2 is currently Qualifying Lead</div>
            <div className="mt-2">Agent 3 is currently contacting leads</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}