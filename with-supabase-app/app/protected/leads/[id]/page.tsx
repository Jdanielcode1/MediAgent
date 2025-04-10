import LeadDetail from "@/components/leads/lead-detail";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

export default async function LeadDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  
  // Fetch lead data
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', params.id)
    .single();
  
  if (error || !lead) {
    return notFound();
  }
  
  return <LeadDetail lead={lead} />;
}