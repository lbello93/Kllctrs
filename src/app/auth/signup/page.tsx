import { redirect } from "next/navigation";

// Spec route /auth/signup — opens the shared auth UI in signup mode.
export default function AuthSignupPage() {
  redirect("/auth/login?mode=signup");
}
