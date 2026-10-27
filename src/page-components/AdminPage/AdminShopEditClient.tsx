"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2, CheckCircle2 } from "lucide-react";

interface Shop {
  id: string;
  name: string | null;
  slug: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  phone: string | null;
  website: string | null;
  specialty: string | null;
  status: string | null;
  lat: number | string | null;
  lng: number | string | null;
  google_place_id: string | null;
}

interface ShopForm {
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website: string;
  specialty: string;
  status: string;
  lat: string;
  lng: string;
  google_place_id: string;
}

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export default function AdminShopEditClient({ shop }: { shop: Shop }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<ShopForm>({
    name: shop.name ?? "",
    slug: shop.slug ?? "",
    address: shop.address ?? "",
    city: shop.city ?? "",
    state: shop.state ?? "",
    zip_code: shop.zip_code ?? "",
    phone: shop.phone ?? "",
    website: shop.website ?? "",
    specialty: shop.specialty ?? "both",
    status: shop.status ?? "pending",
    lat: String(shop.lat ?? ""),
    lng: String(shop.lng ?? ""),
    google_place_id: shop.google_place_id ?? "",
  });

  async function saveShop() {
    setSaving(true);

    const res = await fetch(`/api/admin/shops/${shop.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);

    if (!res.ok) {
      toast.error("Failed to save shop");
      return;
    }

    toast.success("Shop saved");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/shop"
        className="inline-flex items-center gap-2 text-sm text-[#5f2eea] hover:text-[#4a1fa8] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="rounded-2xl border border-violet-100 bg-white p-6 space-y-5">
        <h1 className="text-2xl font-black text-[#1a0a3d]">Edit Shop</h1>

        <Input
          label="Name"
          value={form.name}
          onChange={(v) => setForm({ ...form, name: v })}
        />
        <Input
          label="Slug"
          value={form.slug}
          onChange={(v) => setForm({ ...form, slug: v })}
        />
        <Input
          label="Address"
          value={form.address}
          onChange={(v) => setForm({ ...form, address: v })}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="City"
            value={form.city}
            onChange={(v) => setForm({ ...form, city: v })}
          />
          <Input
            label="State"
            value={form.state}
            onChange={(v) => setForm({ ...form, state: v })}
          />
          <Input
            label="Zip"
            value={form.zip_code}
            onChange={(v) => setForm({ ...form, zip_code: v })}
          />
        </div>

        <Input
          label="Phone"
          value={form.phone}
          onChange={(v) => setForm({ ...form, phone: v })}
        />
        <Input
          label="Website"
          value={form.website}
          onChange={(v) => setForm({ ...form, website: v })}
        />
        <Input
          label="Google Place ID"
          value={form.google_place_id}
          onChange={(v) => setForm({ ...form, google_place_id: v })}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Latitude"
            value={form.lat}
            onChange={(v) => setForm({ ...form, lat: v })}
          />
          <Input
            label="Longitude"
            value={form.lng}
            onChange={(v) => setForm({ ...form, lng: v })}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Select
            label="Specialty"
            value={form.specialty}
            onChange={(v) => setForm({ ...form, specialty: v })}
            options={["sports", "pokemon", "both"]}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v })}
            options={["approved", "pending", "rejected"]}
          />
        </div>

        <button
          onClick={saveShop}
          disabled={saving}
          className="h-11 px-5 rounded-xl bg-green-500 hover:bg-green-600 text-white font-black flex items-center gap-2 disabled:opacity-50 cursor-pointer transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Save Shop
        </button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: InputProps) {
  return (
    <div>
      <label className="block mb-1 text-sm text-[#4a3f6b]/60">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }: SelectProps) {
  return (
    <div>
      <label className="block mb-1 text-sm text-[#4a3f6b]/60">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 border border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
