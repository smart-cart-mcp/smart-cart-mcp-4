import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const dynamic = 'force-dynamic';

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="w-full flex justify-center items-center min-h-[calc(100vh-200px)] py-12">
      <div className="w-full max-w-md px-4">
        <form className="w-full" action={resetPasswordAction}>
          <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Please enter your new password below.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="New password"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                required
              />
            </div>
            <SubmitButton>
              Reset password
            </SubmitButton>
            <FormMessage message={searchParams} />
          </div>
        </form>
      </div>
    </div>
  );
}
