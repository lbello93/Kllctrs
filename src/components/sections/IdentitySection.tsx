"use client";

import { Input } from "@/components/ui/input";
import FieldGroup from "../profile/shared/FieldGroup";
import FieldLabel from "../profile/shared/FieldLabel";

interface IdentitySectionProps {
  displayName?: string;
  username?: string;

  onDisplayNameChange: (value: string) => void;
  onUsernameChange: (value: string) => void;
}

export default function IdentitySection({
  displayName = "",
  username = "",
  onDisplayNameChange,
  onUsernameChange,
}: IdentitySectionProps) {
  return (
    <FieldGroup label="Identity">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <FieldLabel>Display Name</FieldLabel>

          <Input
            value={displayName}
            placeholder="John Doe"
            onChange={(e) => onDisplayNameChange(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#1E1240] text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#E8B85C]/20 focus-visible:border-[#E8B85C]/40"
          />
        </div>

        <div>
          <FieldLabel>Username</FieldLabel>

          <Input
            value={username}
            placeholder="john_doe"
            onChange={(e) => onUsernameChange(e.target.value)}
            className="h-11 rounded-xl border border-white/10 bg-[#1E1240] text-white placeholder:text-white/40 focus-visible:ring-2 focus-visible:ring-[#E8B85C]/20 focus-visible:border-[#E8B85C]/40"
          />
        </div>
      </div>
    </FieldGroup>
  );
}
