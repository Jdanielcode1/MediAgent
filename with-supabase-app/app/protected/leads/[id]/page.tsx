import LeadDetail from "@/components/leads/lead-detail";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// Define the correct type for the page props
type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  // Await the params Promise to get the actual values
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const supabase = await createClient();
  
  // Fetch lead data
  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !lead) {
    return notFound();
  }
  
  return <LeadDetail lead={lead} />;
}