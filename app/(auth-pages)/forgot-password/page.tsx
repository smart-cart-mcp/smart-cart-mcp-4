import { forgotPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function ForgotPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <form className="w-full">
      <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Enter your email and we'll send you a link to reset your password
      </p>
      <p className="text-sm text-foreground">
        Already have an account?{" "}
        <Link className="text-primary font-medium hover:underline" href="/sign-in">
          Sign in
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input name="email" placeholder="you@example.com" required />
        <SubmitButton formAction={forgotPasswordAction}>
          Reset Password
        </SubmitButton>
        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
