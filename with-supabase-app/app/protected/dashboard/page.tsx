import Dashboard from "@/components/dashboard/dashboard";
import { createClient } from "@/utils/supabase/client";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch agents data
  const { data: agents } = await supabase
    .from('agents')
    .select('*');
  
  // Fetch leads data
  const { data: leads } = await supabase
    .from('leads')
    .select('*');
  
  // Fetch revenue data
  const { data: revenue } = await supabase
    .from('revenue')
    .select('*');
  
  return (
    <Dashboard 
      agents={agents || []} 
      leads={leads || []} 
      revenue={revenue || []} 
    />
  );
}
