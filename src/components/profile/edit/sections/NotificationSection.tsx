"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export interface NotificationPreferences {
  event_notifications: boolean;
  shop_notifications: boolean;
  community_notifications: boolean;
  marketing_notifications: boolean;
}

interface NotificationSectionProps {
  value: NotificationPreferences;
  onChange: (value: NotificationPreferences) => void;
}

const ITEMS = [
  {
    key: "event_notifications" as const,
    title: "Event Notifications",
    description: "Get notified when new events are added near you.",
  },
  {
    key: "shop_notifications" as const,
    title: "Shop Updates",
    description: "Receive updates from your favorite card shops.",
  },
  {
    key: "community_notifications" as const,
    title: "Community Activity",
    description: "Replies, mentions, likes and follows.",
  },
  {
    key: "marketing_notifications" as const,
    title: "Monthly Newsletter",
    description: "Get our monthly roundup of news, drops, and promotions.",
  },
];

export default function NotificationSection({
  value,
  onChange,
}: NotificationSectionProps) {
  function update<K extends keyof NotificationPreferences>(
    key: K,
    checked: boolean,
  ) {
    onChange({
      ...value,
      [key]: checked,
    });
  }

  const allEnabled = ITEMS.every((item) => value[item.key]);
  const allDisabled = ITEMS.every((item) => !value[item.key]);

  function toggleAll(checked: boolean) {
    onChange({
      event_notifications: checked,
      shop_notifications: checked,
      community_notifications: checked,
      marketing_notifications: checked,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Notification Preferences
        </h3>

        <p className="text-sm text-white/50">
          Choose which notifications you would like to receive.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#E8B85C]/30 bg-[#E8B85C]/5 p-4">
        <div className="space-y-1">
          <Label className="font-medium text-white">All Notifications</Label>
          <p className="text-sm text-white/50">
            Turn every notification on or off at once.
          </p>
        </div>

        <Switch
          checked={allEnabled}
          onCheckedChange={toggleAll}
          aria-label="Toggle all notifications"
        />
      </div>

      <div className="space-y-4">
        {ITEMS.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-[#1E1240] p-4"
          >
            <div className="space-y-1">
              <Label className="font-medium text-white">{item.title}</Label>

              <p className="text-sm text-white/50">{item.description}</p>
            </div>

            <Switch
              checked={value[item.key]}
              onCheckedChange={(checked) => update(item.key, checked)}
            />
          </div>
        ))}
      </div>

      {!allEnabled && !allDisabled && (
        <p className="text-xs text-white/40">
          Some notifications are on, some are off.
        </p>
      )}
    </div>
  );
}
