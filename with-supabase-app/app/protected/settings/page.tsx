// app/protected/settings/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/settings/settings-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signOutAction } from "@/app/actions";

export default async function SettingsPage() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  // Get the company profile for the current user
  const { data: companyProfile } = await supabase
    .from('company_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();
  
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="company" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="company">Company Information</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Profile</CardTitle>
              <CardDescription>
                Update your company information that will be used across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsForm initialData={companyProfile} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Email Address</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                
                <form action={signOutAction}>
                  <button 
                    type="submit"
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Sign Out
                  </button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}