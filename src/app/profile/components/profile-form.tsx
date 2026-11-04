"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

import { updateProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Tables } from "@/types/database";

import { AvatarUpload } from "./avatar-upload";

type Profile = Tables<"profiles">;

/** Edit the current user's profile (display name, bio, location, interests). */
export function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    display_name: profile.display_name ?? "",
    bio: profile.bio ?? "",
    location: profile.location ?? profile.city ?? "",
    favorite_categories: (profile.favorite_categories ?? []).join(", "),
    collecting_since: profile.collecting_since ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const { error } = await updateProfile(profile.id, {
      display_name: form.display_name.trim() || null,
      bio: form.bio.trim() || null,
      location: form.location.trim() || null,
      favorite_categories: form.favorite_categories
        ? form.favorite_categories.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      collecting_since: form.collecting_since || null,
    });
    setSaving(false);
    if (error) return setError(error.message);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <AvatarUpload userId={profile.id} avatarUrl={profile.avatar_url} displayName={form.display_name} />

      <div>
        <Label className="mb-1.5">Display name</Label>
        <Input value={form.display_name} onChange={(e) => set("display_name", e.target.value)} />
      </div>
      <div>
        <Label className="mb-1.5">Bio</Label>
        <textarea
          rows={3}
          value={form.bio}
          onChange={(e) => set("bio", e.target.value)}
          className="w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-1.5">Location</Label>
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </div>
        <div>
          <Label className="mb-1.5">Collecting since</Label>
          <Input type="date" value={form.collecting_since} onChange={(e) => set("collecting_since", e.target.value)} />
        </div>
      </div>
      <div>
        <Label className="mb-1.5">Favorite categories (comma-separated)</Label>
        <Input
          value={form.favorite_categories}
          onChange={(e) => set("favorite_categories", e.target.value)}
          placeholder="pokemon, sports, magic"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={saving}>
        {saving ? <Loader2 className="size-4 animate-spin" /> : saved ? <Check className="size-4" /> : null}
        {saved ? "Saved" : "Save changes"}
      </Button>
    </form>
  );
}

export default ProfileForm;
