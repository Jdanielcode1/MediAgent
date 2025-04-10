// components/settings/settings-form.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { updateCompanyProfileAction } from "@/app/actions";

interface CompanyProfile {
  id?: string;
  company_name?: string;
  company_website?: string;
  company_address?: string;
  company_phone?: string;
  company_email?: string;
  industry?: string;
}

export default function SettingsForm({ initialData }: { initialData?: CompanyProfile }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CompanyProfile>({
    company_name: initialData?.company_name || "",
    company_website: initialData?.company_website || "",
    company_address: initialData?.company_address || "",
    company_phone: initialData?.company_phone || "",
    company_email: initialData?.company_email || "",
    industry: initialData?.industry || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value as string);
      });
      
      await updateCompanyProfileAction(formDataToSubmit);
      router.refresh();
    } catch (error) {
      console.error("Error updating company profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            name="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Your Company Name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            placeholder="e.g. Healthcare, Technology"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company_website">Website</Label>
          <Input
            id="company_website"
            name="company_website"
            value={formData.company_website}
            onChange={handleChange}
            placeholder="https://yourcompany.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company_email">Company Email</Label>
          <Input
            id="company_email"
            name="company_email"
            value={formData.company_email}
            onChange={handleChange}
            placeholder="contact@yourcompany.com"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company_phone">Phone Number</Label>
          <Input
            id="company_phone"
            name="company_phone"
            value={formData.company_phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company_address">Address</Label>
        <Input
          id="company_address"
          name="company_address"
          value={formData.company_address}
          onChange={handleChange}
          placeholder="123 Business St, City, State, ZIP"
        />
      </div>
      
      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  );
}