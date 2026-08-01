"use client";

import { useEffect, useState } from "react";

import AvatarUploader from "@/components/profile/edit/AvatarUploader";
import { createClient } from "@/lib/supabase/client";

import type { OnboardingData } from "@/hooks/useOnboarding";
import IdentitySection from "@/components/sections/IdentitySection";
import BioSection from "@/components/sections/BioSection";

interface BasicInfoStepProps {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
}

export default function BasicInfoStep({
  data,
  updateData,
}: BasicInfoStepProps) {
  const supabase = createClient();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleAvatar(file: File) {
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadError(null);
    setIsUploading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not signed in");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadErr) {
        throw uploadErr;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      updateData({
        avatar_url: publicUrlData.publicUrl,
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Failed to upload photo",
      );
    } finally {
      setIsUploading(false);
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:gap-8">
      <div className="flex flex-col items-center gap-2 sm:shrink-0 sm:items-start">
        <AvatarUploader
          avatarUrl={data.avatar_url}
          previewUrl={previewUrl}
          onFileSelect={handleAvatar}
        />

        {isUploading && <p className="text-xs text-white/50">Uploading…</p>}

        {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
      </div>

      <div className="flex flex-1 flex-col gap-8 min-w-0">
        <IdentitySection
          displayName={data.display_name}
          username={data.username}
          onDisplayNameChange={(value) =>
            updateData({
              display_name: value,
            })
          }
          onUsernameChange={(value) =>
            updateData({
              username: value,
            })
          }
        />

        <BioSection
          bio={data.bio}
          onChange={(value) =>
            updateData({
              bio: value,
            })
          }
        />
      </div>
    </div>
  );
}
