import AgentWorkspace from "@/components/agents/agent-workspace";   
import { createClient } from "@/utils/supabase/server";

export default async function AgentPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Fetch agent data
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', params.id)
    .single();
  
  return <AgentWorkspace agent={agent || { id: params.id, name: `Agent ${params.id}` }} />;
}