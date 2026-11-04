"use client";

import { useState } from "react";
import { Loader2, Upload } from "lucide-react";

import { supabase, updateProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;
  avatarUrl: string | null;
  displayName?: string | null;
  onChange?: (url: string) => void;
}

/** Uploads an avatar to the `avatars` bucket (path: <userId>/<file>) and saves it. */
export function AvatarUpload({ userId, avatarUrl, displayName, onChange }: Props) {
  const [url, setUrl] = useState(avatarUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${userId}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (upErr) throw upErr;

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = data.publicUrl;
      const { error: dbErr } = await updateProfile(userId, { avatar_url: publicUrl });
      if (dbErr) throw dbErr;

      setUrl(publicUrl);
      onChange?.(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const initial = (displayName || "U").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Avatar" className="size-16 rounded-full object-cover" />
      ) : (
        <div className="flex size-16 items-center justify-center rounded-full bg-amethyst-500 text-xl font-bold text-white">
          {initial}
        </div>
      )}
      <div>
        <Button asChild variant="outline" size="sm" disabled={loading}>
          <label className="cursor-pointer">
            {loading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
            Change avatar
            <input type="file" accept="image/*" className="hidden" onChange={onFile} />
          </label>
        </Button>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}

export default AvatarUpload;
