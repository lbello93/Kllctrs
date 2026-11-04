"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Stat } from "@/lib/content-studio";

interface Props {
  stats: Stat[];
  onChange: (stats: Stat[]) => void;
}

/** Dynamic list of {label, value, unit} stat fields. */
export function StatInput({ stats, onChange }: Props) {
  const update = (i: number, patch: Partial<Stat>) => {
    onChange(stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };
  const remove = (i: number) => onChange(stats.filter((_, idx) => idx !== i));
  const add = () => onChange([...stats, { label: "", value: "", unit: "" }]);

  return (
    <div className="space-y-2">
      {stats.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder="Label (e.g. Range)"
            value={s.label}
            onChange={(e) => update(i, { label: e.target.value })}
          />
          <Input
            className="w-24"
            placeholder="Value"
            value={s.value}
            onChange={(e) => update(i, { value: e.target.value })}
          />
          <Input
            className="w-24"
            placeholder="Unit"
            value={s.unit ?? ""}
            onChange={(e) => update(i, { unit: e.target.value })}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => remove(i)}
            aria-label="Remove stat"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <Plus className="size-3.5" /> Add stat
      </Button>
    </div>
  );
}
