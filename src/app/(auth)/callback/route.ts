import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type OtpType =
  | "signup"
  | "invite"
  | "magiclink"
  | "recovery"
  | "email_change"
  | "email";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const fail = (message: string) =>
    NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(message)}`,
    );

  const supabase = await createClient();

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("[callback] exchangeCodeForSession:", error);
        return fail(
          "That verification link is invalid or has expired. Sign in below and we can send you a new one.",
        );
      }
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as OtpType,
      });
      if (error) {
        console.error("[callback] verifyOtp:", error);
        return fail(
          "That verification link is invalid or has expired. Sign in below and we can send you a new one.",
        );
      }
    } else {
      return fail("That verification link is not valid.");
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return fail("We couldn't confirm your account. Please sign in.");
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name ?? "",
        username:
          user.user_metadata.username ?? user.email?.split("@")[0] ?? "",
      });

      if (insertError) {
        console.error("[callback] profile insert failed:", insertError);
      }
    }

    return NextResponse.redirect(`${origin}/profile`);
  } catch (err) {
    console.error("[callback] unexpected error:", err);
    return fail("Something went wrong. Please try again.");
  }
}