import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  
  // Check if user is already logged in
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    redirect("/protected/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="w-full max-w-sm px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">MediAgent</h1>
          <p className="text-muted-foreground">
            AI Sales Agents for Medical Device Companies
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild className="w-full" variant="outline">
            <Link href="/sign-in">
              Sign In
            </Link>
          </Button>
          
          <Button asChild className="w-full">
            <Link href="/sign-up">
              Create Account
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}