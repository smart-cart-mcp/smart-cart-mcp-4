import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="w-full" action={signInAction}>
      <h1 className="text-2xl font-bold mb-2">Welcome Back to Smart Cart</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Sign in to your account to continue your shopping experience
      </p>
      <p className="text-sm text-foreground">
        Don't have an account?{" "}
        <Link className="text-primary font-medium hover:underline" href="/sign-up">
          Sign up
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" placeholder="you@example.com" required />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-primary hover:underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Your password"
          required
        />
        <SubmitButton pendingText="Signing In...">
          Sign in
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
