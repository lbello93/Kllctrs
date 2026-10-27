import type { Metadata } from "next";
import AuthPage from "@/page-components/AuthPage/AuthPage";

export const metadata: Metadata = {
  title: "Sign in | KLLCTRS",
  description: "Sign in or create your KLLCTRS account.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <AuthPage />;
}
