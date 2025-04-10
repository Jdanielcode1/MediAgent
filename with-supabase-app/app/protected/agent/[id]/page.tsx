import { createClient } from "@/utils/supabase/server";
import AgentWorkspace from "@/components/agents/agent-workspace";
import AgentNotFound from "@/components/agents/agent-not-found";

// Define the correct type for the page props
type AgentPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function AgentPage({ params }: AgentPageProps) {
  // Await the params Promise to get the actual values
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const supabase = await createClient();
  
  // Fetch agent data
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (!agent) {
    return <AgentNotFound />;
  }

  return <AgentWorkspace agent={agent} />;
}