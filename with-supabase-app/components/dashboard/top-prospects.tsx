import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MoreVertical, Building, MapPin, ArrowUpRight } from "lucide-react";
import { Badge } from "../ui/badge";
import { Lead } from "@/lib/types/lead-types";
import Link from "next/link";

export default function TopProspects({ leads }: { leads: Lead[] }) {
  // Sort leads by match score and take top 5
  const topLeads = [...leads]
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Top Hospital Prospects</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b">
                <th className="pb-2 font-medium">Hospital/Facility</th>
                <th className="pb-2 font-medium">Contact</th>
                <th className="pb-2 font-medium">Location</th>
                <th className="pb-2 font-medium">Beds</th>
                <th className="pb-2 font-medium">Match</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {topLeads.map((lead) => (
                <tr key={lead.id} className="text-sm">
                  <td className="py-3">
                    <div className="font-medium">{lead.company}</div>
                    <div className="text-xs text-gray-500">{lead.industry || "Healthcare"}</div>
                  </td>
                  <td className="py-3">
                    <div>{lead.name}</div>
                    <div className="text-xs text-gray-500">{lead.title}</div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                      {lead.location}
                    </div>
                  </td>
                  <td className="py-3">
                    {lead.companySize || "100+"}
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                      {lead.matchScore}%
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                      {lead.status || "New Lead"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Link href={`/protected/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}