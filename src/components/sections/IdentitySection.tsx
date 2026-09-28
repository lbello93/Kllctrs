"use client";

import { Input } from "@/components/ui/input";
import { USERNAME_RULES } from "@/lib/profile/constants";
import FieldGroup from "../profile/shared/FieldGroup";
import FieldLabel from "../profile/shared/FieldLabel";

interface IdentitySectionProps {
  displayName?: string;
  username?: string;
  displayNameError?: string | null;
  usernameError?: string | null;
  onDisplayNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
  onDisplayNameBlur?: () => void;
  onUsernameBlur?: () => void;
}

const inputBase =
  "h-11 rounded-xl border bg-[#FEF9FF]/[0.06] font-inter text-[14px] text-[#FEF9FF] placeholder:text-[#FEF9FF]/40 focus-visible:ring-2";
const inputOk =
  "border-white/10 focus-visible:border-[#9C7CF7] focus-visible:ring-[#9C7CF7]/20";
const inputBad =
  "border-red-400/60 focus-visible:border-red-400 focus-visible:ring-red-400/20";

function Message({ error, hint }: { error?: string | null; hint?: string }) {
  if (error) {
    return (
      <p
        role="alert"
        className="mt-1.5 font-inter text-[12px] leading-[15px] text-red-400"
      >
        {error}
      </p>
    );
  }

  if (hint) {
    return (
      <p className="mt-1.5 font-inter text-[12px] leading-[15px] text-[#FEF9FF]/50">
        {hint}
      </p>
    );
  }

  return null;
}

export default function IdentitySection({
  displayName = "",
  username = "",
  displayNameError,
  usernameError,
  onDisplayNameChange,
  onUsernameChange,
  onDisplayNameBlur,
  onUsernameBlur,
}: IdentitySectionProps) {
  return (
    <FieldGroup label="Identity">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Display name</FieldLabel>
          <Input
            aria-label="Display name"
            aria-invalid={Boolean(displayNameError)}
            value={displayName}
            placeholder="John Doe"
            maxLength={40}
            autoComplete="name"
            onChange={(e) => onDisplayNameChange(e.target.value)}
            onBlur={onDisplayNameBlur}
            className={`${inputBase} ${displayNameError ? inputBad : inputOk}`}
          />
          <Message error={displayNameError} />
        </div>

        <div>
          <FieldLabel>Username</FieldLabel>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-inter text-[14px] text-[#FEF9FF]/40">
              @
            </span>
            <Input
              aria-label="Username"
              aria-invalid={Boolean(usernameError)}
              value={username}
              placeholder="john_doe"
              maxLength={USERNAME_RULES.MAX_LENGTH}
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              onChange={(e) => onUsernameChange(e.target.value)}
              onBlur={onUsernameBlur}
              className={`${inputBase} pl-8 ${usernameError ? inputBad : inputOk}`}
            />
          </div>
          <Message
            error={usernameError}
            hint={`${USERNAME_RULES.MIN_LENGTH} to ${USERNAME_RULES.MAX_LENGTH} letters, numbers or underscores`}
          />
        </div>
      </div>
    </FieldGroup>
  );
}
