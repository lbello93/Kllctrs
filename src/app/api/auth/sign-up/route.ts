import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { fullName, username, email, password } = body as Record<
    string,
    unknown
  >;
  if (
    typeof fullName !== "string" ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return NextResponse.json(
      { error: "Name, username, email, and password are required." },
      { status: 400 },
    );
  }

  const cleanName = fullName.trim();
  const cleanUsername = username.trim();
  const cleanEmail = email.trim();

  if (cleanName.length < 2 || cleanName.length > 100) {
    return NextResponse.json(
      { error: "Enter a name between 2 and 100 characters." },
      { status: 400 },
    );
  }
  if (cleanUsername.length < 3 || !/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters and use only letters, numbers, or underscores." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }
  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      emailRedirectTo: new URL("/callback", request.url).toString(),
      data: {
        full_name: cleanName,
        username: cleanUsername,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (data.user && data.user.identities?.length === 0) {
    return NextResponse.json(
      { error: "An account with this email already exists. Try signing in instead." },
      { status: 409 },
    );
  }

  return NextResponse.json({ ok: true });
}
