import type { Metadata } from "next";
import AuthPage from "@/page-components/AuthPage/AuthPage";

export const metadata: Metadata = {
  title: "Sign in | KLLCTRS",
  robots: { index: false, follow: false },
};

// Spec route /auth/login — reuses the shared auth UI (login + signup via ?mode).
export default function AuthLoginPage() {
  return <AuthPage />;
}
