import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabase = await createClient();

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        return NextResponse.redirect(
          `${origin}/callback-error?message=${encodeURIComponent(error.message)}`,
        );
      }
    } else if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email",
      });
      if (error) {
        return NextResponse.redirect(
          `${origin}/callback-error?message=${encodeURIComponent(error.message)}`,
        );
      }
    } else {
      return NextResponse.redirect(
        `${origin}/callback-error?message=${encodeURIComponent("Invalid verification link.")}`,
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(
        `${origin}/callback-error?message=${encodeURIComponent("Unable to fetch authenticated user.")}`,
      );
    }

    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (!existingProfile) {
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata.full_name ?? "",
        username: user.user_metadata.username ?? user.email?.split("@")[0] ?? "",
      });
    }

    return NextResponse.redirect(`${origin}/profile`);
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(
      `${origin}/callback-error?message=${encodeURIComponent("Something went wrong during authentication.")}`,
    );
  }
}