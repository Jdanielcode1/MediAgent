import LeadDatabase from "@/components/leads/lead-database"
import { createClient } from "@/utils/supabase/server";

export default async function LeadsPage() {
  const supabase = await createClient();
  
  // Fetch leads data
  const { data: leads } = await supabase
    .from('leads')
    .select('*');
  
  return <LeadDatabase leads={leads || []} />;
}