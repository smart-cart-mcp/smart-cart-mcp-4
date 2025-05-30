"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Helper function to get form field values accounting for Next.js 15 format changes
function getFormField(formData: FormData, fieldName: string): string | undefined {
  // Try direct access first
  let value = formData.get(fieldName)?.toString();
  
  // If not found, try looking for prefixed versions (Next.js 15 form format)
  if (!value) {
    // Convert FormData entries to array for compatibility
    const entries = Array.from(formData.entries());
    for (const [key, val] of entries) {
      if (key.endsWith(`_${fieldName}`)) {
        value = val.toString();
        break;
      }
    }
  }
  
  return value;
}

export const signUpAction = async (formData: FormData) => {
  const email = getFormField(formData, "email");
  const password = getFormField(formData, "password");
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
    // Redirect to sign-in page with success message after successful signup
    return encodedRedirect(
      "success",
      "/sign-in",
      "Thanks for signing up! You can now sign in with your credentials.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = getFormField(formData, "email");
  const password = getFormField(formData, "password");
  const supabase = await createClient();

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "Email and password are required",
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = getFormField(formData, "email");
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = getFormField(formData, "callbackUrl");

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

  const password = getFormField(formData, "password");
  const confirmPassword = getFormField(formData, "confirmPassword");

  if (!password || !confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  return encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
