import Dashboard from "@/components/dashboard/dashboard";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  
  // Fetch agents data with more details
  const { data: agents } = await supabase
    .from('agents')
    .select('*');
  
  // Add medical device sales specific data
  const enhancedAgents = agents?.map(agent => ({
    ...agent,
    quota: Math.floor(Math.random() * 100000) + 50000,
    quotaProgress: Math.floor(Math.random() * 100),
    isTopPerformer: Math.random() > 0.7,
    activeLeads: Math.floor(Math.random() * 20),
    pipelineValue: Math.floor(Math.random() * 200000),
    todaysMeetings: Math.floor(Math.random() * 3),
    lastActivity: ['1h ago', '3h ago', 'Yesterday', '2d ago'][Math.floor(Math.random() * 4)]
  })) || [];
  
  // Fetch leads data with medical device context
  const { data: rawLeads } = await supabase
    .from('leads')
    .select('*');
  
  // Enhance leads with medical device specific data
  const leads = rawLeads?.map(lead => ({
    ...lead,
    status: ['new', 'contacted', 'qualification', 'proposal', 'closed_won'][Math.floor(Math.random() * 5)],
    industry: 'Healthcare',
    companySize: ['100-250', '250-500', '500-1000', '1000+'][Math.floor(Math.random() * 4)],
    tags: [
      ...lead.tags || [],
      ['Wound Care', 'Orthopedics', 'Cardiology', 'Neurology'][Math.floor(Math.random() * 4)]
    ],
    matchScore: lead.matchScore || Math.floor(Math.random() * 30) + 70
  })) || [];
  
  // Fetch revenue data
  const { data: revenue } = await supabase
    .from('revenue')
    .select('*');
  
  return (
    <Dashboard 
      agents={enhancedAgents} 
      leads={leads} 
      revenue={revenue || []} 
    />
  );
}
