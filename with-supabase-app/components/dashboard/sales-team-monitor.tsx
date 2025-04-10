import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { MoreVertical, Award, TrendingUp, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { Progress } from "../ui/progress"

interface Agent {
  id: string;
  name?: string;
  activeLeads?: number;
  pipelineValue?: number;
  todaysMeetings?: number;
  lastActivity?: string;
  isTopPerformer?: boolean;
  quota?: number;
  quotaProgress?: number;
}

export default function SalesTeamMonitor({ agents }: { agents: Agent[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Sales Team Activity</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {agents.map((agent) => (
          <div key={agent.id} className="space-y-3 border-b pb-4 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {agent.name?.substring(0, 2) || "A"}
                </div>
                <div>
                  <h3 className="font-medium">{agent.name || `Agent ${agent.id.substring(0, 8)}`}</h3>
                  <div className="text-xs text-gray-500">Medical Device Specialist</div>
                </div>
                {agent.isTopPerformer && (
                  <div className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full flex items-center">
                    <Award className="h-3 w-3 mr-1" />
                    Top Performer
                  </div>
                )}
              </div>
              <Link href={`/protected/agent/${agent.id}`}>
                <Button variant="secondary" className="h-8 rounded-md bg-blue-500 hover:bg-blue-600 text-white">
                  View
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-gray-500">Pipeline</div>
                  <div className="font-medium">${agent.pipelineValue?.toLocaleString() || '0'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-gray-500">Today's Meetings</div>
                  <div className="font-medium">{agent.todaysMeetings || 0}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="text-gray-500">Last Activity</div>
                  <div className="font-medium">{agent.lastActivity || 'None'}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <span className="text-xs">•</span>
                </div>
                <div>
                  <div className="text-gray-500">Active Leads</div>
                  <div className="font-medium">{agent.activeLeads || 0}</div>
                </div>
              </div>
            </div>
            
            {agent.quota && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Quota Progress</span>
                  <span>{agent.quotaProgress || 0}% of ${agent.quota.toLocaleString()}</span>
                </div>
                <Progress value={agent.quotaProgress || 0} className="h-2" />
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}