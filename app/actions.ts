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
  console.log("Starting signUp process");
  
  try {
    const email = getFormField(formData, "email");
    const password = getFormField(formData, "password");
    console.log(`Email provided: ${email ? "YES" : "NO"}, Password provided: ${password ? "YES" : "NO"}`);
    
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    console.log(`Origin URL: ${origin}`);

    if (!email || !password) {
      console.log("Missing credentials");
      return encodedRedirect(
        "error",
        "/sign-up",
        "Email and password are required",
      );
    }

    console.log(`Attempting to sign up with email: ${email} and redirect to: ${origin}/auth/callback`);
    const signUpResult = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    
    console.log("Sign up response:", JSON.stringify(signUpResult, null, 2));

    if (signUpResult.error) {
      console.error("Signup error details:", {
        code: signUpResult.error.code,
        message: signUpResult.error.message,
        stack: signUpResult.error.stack
      });
      
      // In case of "Error sending confirmation email", which indicates a Supabase email configuration issue
      if (signUpResult.error.message === "Error sending confirmation email") {
        console.error("SUPABASE EMAIL CONFIG ISSUE: The email service in Supabase may not be properly configured.");
        return encodedRedirect("error", "/sign-up", 
          "Account created, but we couldn't send a verification email. Please contact support.");
      }
      
      return encodedRedirect("error", "/sign-up", signUpResult.error.message);
    } else {
      console.log("Signup successful, user data:", JSON.stringify(signUpResult.data, null, 2));
      return encodedRedirect(
        "success",
        "/sign-up",
        "Thanks for signing up! Please check your email for a verification link.",
      );
    }
  } catch (err) {
    console.error("Unexpected error during signup:", err);
    return encodedRedirect("error", "/sign-up", "An unexpected error occurred. Please try again.");
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
