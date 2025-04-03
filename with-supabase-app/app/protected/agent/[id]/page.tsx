import AgentWorkspace from "@/components/agents/agent-workspace";
import { createClient } from "@/utils/supabase/server";

type AgentPageProps = {
  params: {
    id: string;
  };
};

export default async function Page({ params }: AgentPageProps) {
  // Ensure we're working with the id after params is resolved
  const id = params.id;
  
  const supabase = await createClient();
  
  // Fetch agent data
  const { data: agent } = await supabase
    .from('agents')
    .select('*')
    .eq('id', id)
    .single();

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Agent Not Found</h1>
          <p className="mt-2 text-gray-600">The agent you're looking for doesn't exist or you don't have access.</p>
        </div>
      </div>
    );
  }

  return <AgentWorkspace agent={agent} />;
}