import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex items-center justify-center">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <form className="w-full">
      <h1 className="text-2xl font-bold mb-2">Join Smart Cart Today</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Create your account to start your personalized shopping experience
      </p>
      <p className="text-sm text text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          minLength={6}
          required
        />
        <SubmitButton formAction={signUpAction} pendingText="Signing up...">
          Sign up
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
