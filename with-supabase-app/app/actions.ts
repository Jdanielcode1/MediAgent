"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const updateCompanyProfileAction = async (formData: FormData) => {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return encodedRedirect("error", "/sign-in", "You must be logged in");
  }
  
  // Extract form data
  const companyName = formData.get("company_name")?.toString();
  const companyWebsite = formData.get("company_website")?.toString();
  const companyAddress = formData.get("company_address")?.toString();
  const companyPhone = formData.get("company_phone")?.toString();
  const companyEmail = formData.get("company_email")?.toString();
  const industry = formData.get("industry")?.toString();
  
  // Check if a company profile already exists for this user
  const { data: existingProfile } = await supabase
    .from('company_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();
  
  if (existingProfile) {
    // Update existing profile
    const { error } = await supabase
      .from('company_profiles')
      .update({
        company_name: companyName,
        company_website: companyWebsite,
        company_address: companyAddress,
        company_phone: companyPhone,
        company_email: companyEmail,
        industry: industry,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingProfile.id);
    
    if (error) {
      console.error("Error updating company profile:", error);
      return encodedRedirect("error", "/protected/settings", "Failed to update company profile");
    }
  } else {
    // Create new profile
    const { error } = await supabase
      .from('company_profiles')
      .insert({
        user_id: user.id,
        company_name: companyName,
        company_website: companyWebsite,
        company_address: companyAddress,
        company_phone: companyPhone,
        company_email: companyEmail,
        industry: industry,
      });
    
    if (error) {
      console.error("Error creating company profile:", error);
      return encodedRedirect("error", "/protected/settings", "Failed to create company profile");
    }
  }
  
  return encodedRedirect("success", "/protected/settings", "Company profile updated successfully");
};
