"use client";

import { useEffect, useMemo, useState } from "react";

import AvatarUploader from "@/components/profile/edit/AvatarUploader";
import IdentitySection from "@/components/sections/IdentitySection";
import BioSection from "@/components/sections/BioSection";
import { createClient } from "@/lib/supabase/client";
import { validateBasicInfo } from "@/lib/profile/validation";

import type { OnboardingData } from "@/hooks/useOnboarding";

const MAX_FILE_MB = 5;

const FILE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
};

interface BasicInfoStepProps {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function BasicInfoStep({
  data,
  updateData,
}: BasicInfoStepProps) {
  const supabase = useMemo(() => createClient(), []);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [touched, setTouched] = useState({
    displayName: false,
    username: false,
  });

  const { errors } = validateBasicInfo(data);

  async function handleAvatar(file: File) {
    setUploadError(null);

    const extension = FILE_EXTENSIONS[file.type];

    if (!extension) {
      setUploadError("Use a PNG, JPG or WEBP image.");
      return;
    }

    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setUploadError(`Keep the photo under ${MAX_FILE_MB} MB.`);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Please sign in again.");

      const fileName = `${user.id}-${Date.now()}.${extension}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });

      if (uploadErr) throw uploadErr;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      updateData({ avatar_url: publicUrlData.publicUrl });
    } catch (err) {
      setPreviewUrl(null);
      setUploadError(
        err instanceof Error
          ? err.message
          : "Could not upload the photo. Try again.",
      );
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
      <div className="flex flex-col items-center gap-2 sm:shrink-0 sm:items-start">
        <AvatarUploader
          avatarUrl={data.avatar_url}
          previewUrl={previewUrl}
          onFileSelect={handleAvatar}
        />

        {isUploading && (
          <p
            role="status"
            className="font-inter text-[12px] leading-[15px] text-[#FEF9FF]/60"
          >
            Uploading…
          </p>
        )}

        {uploadError && (
          <p
            role="alert"
            className="max-w-[160px] font-inter text-[12px] leading-[15px] text-red-400"
          >
            {uploadError}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <IdentitySection
          displayName={data.display_name}
          username={data.username}
          displayNameError={touched.displayName ? errors.displayName : null}
          usernameError={touched.username ? errors.username : null}
          onDisplayNameChange={(value) => updateData({ display_name: value })}
          onUsernameChange={(value) => updateData({ username: value })}
          onDisplayNameBlur={() =>
            setTouched((t) => ({ ...t, displayName: true }))
          }
          onUsernameBlur={() => setTouched((t) => ({ ...t, username: true }))}
        />

        <BioSection
          bio={data.bio}
          onChange={(value) => updateData({ bio: value })}
        />
      </div>
    </div>
  );
}
