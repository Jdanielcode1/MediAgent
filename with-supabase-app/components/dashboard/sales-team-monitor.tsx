import { MoreVertical } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function SalesTeamMonitor({ agents }: { agents: any[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Sales Team Activity Monitor</CardTitle>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {agents.map((agent) => (
          <div key={agent.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Agent {agent.id}</h3>
              <Button variant="secondary" className="h-8 rounded-md bg-blue-400 text-white">
                View
              </Button>
            </div>
            <div className="space-y-1 text-sm">
              {agent.isTopPerformer && (
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500">⭐</span>
                  <span>Top Performer</span>
                </div>
              )}
              <div>• Active Leads: {agent.activeLeads || 0}</div>
              <div>• Pipeline Value: ${agent.pipelineValue ? agent.pipelineValue.toLocaleString() : '0'}</div>
              <div>• Today's Meetings: {agent.todaysMeetings || 0}</div>
              <div>• Last Activity: {agent.lastActivity || 'None'}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}