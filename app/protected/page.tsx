import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  redirect('/dashboard');
}
