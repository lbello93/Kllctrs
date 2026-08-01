"use client";

import { useState } from "react";
import { LocateFixed, Loader2, MapPin } from "lucide-react";
import { Country, State, City } from "country-state-city";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FieldGroup from "../../shared/FieldGroup";
import FieldLabel from "../../shared/FieldLabel";
import { selectTriggerClass } from "../../onboarding/shared/selectTriggerClass";

interface LocationSectionProps {
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;

  onCountryChange?: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onTimezoneChange?: (value: string) => void;
}

const allCountries = Country.getAllCountries();

export default function LocationSection({
  country = "",
  state = "",
  city = "",
  timezone = "",
  onCountryChange,
  onStateChange,
  onCityChange,
  onTimezoneChange,
}: LocationSectionProps) {
  const [isLocating, setIsLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const selectedCountry = allCountries.find((c) => c.name === country);
  const states = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode)
    : [];

  const selectedState = states.find((s) => s.name === state);
  const cities =
    selectedCountry && selectedState
      ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
      : [];

  async function handleUseMyLocation() {
    setLocateError(null);

    if (!navigator.geolocation) {
      setLocateError("Location isn't supported in this browser.");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(
            `/api/geocode/reverse?lat=${latitude}&lon=${longitude}`,
          );
          const json = await res.json();

          if (!res.ok) throw new Error(json.error || "Lookup failed");

          const matchedCountry = json.countryCode
            ? allCountries.find((c) => c.isoCode === json.countryCode)
            : allCountries.find(
                (c) =>
                  c.name.toLowerCase() === (json.country ?? "").toLowerCase(),
              );

          if (!matchedCountry) {
            setLocateError(
              "Couldn't match your country. Please select manually.",
            );
            return;
          }

          onCountryChange?.(matchedCountry.name);

          const countryStates = State.getStatesOfCountry(
            matchedCountry.isoCode,
          );
          const matchedState = countryStates.find(
            (s) => s.name.toLowerCase() === (json.state ?? "").toLowerCase(),
          );

          if (!matchedState) {
            setLocateError(
              "Couldn't match your state. Please select manually.",
            );
            return;
          }

          onStateChange(matchedState.name);

          const stateCities = City.getCitiesOfState(
            matchedCountry.isoCode,
            matchedState.isoCode,
          );
          const matchedCity = stateCities.find(
            (c) => c.name.toLowerCase() === (json.city ?? "").toLowerCase(),
          );

          onCityChange(matchedCity ? matchedCity.name : (json.city ?? ""));
        } catch (err) {
          setLocateError(
            err instanceof Error
              ? err.message
              : "Couldn't detect your location.",
          );
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocateError("Location permission denied. Please select manually.");
        setIsLocating(false);
      },
    );
  }

  return (
    <FieldGroup label="Location">
      <Button
        type="button"
        variant="outline"
        onClick={handleUseMyLocation}
        disabled={isLocating}
        className="w-full sm:w-auto"
      >
        {isLocating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Detecting your location…
          </>
        ) : (
          <>
            <LocateFixed className="mr-2 h-4 w-4" />
            Use my location
          </>
        )}
      </Button>

      {locateError && <p className="text-xs text-red-400">{locateError}</p>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Country */}
        <div>
          <FieldLabel>Country</FieldLabel>

          <Select
            value={country}
            onValueChange={(value) => {
              onCountryChange?.(value);
              onStateChange("");
              onCityChange("");
            }}
          >
            <SelectTrigger className={selectTriggerClass}>
              <span className="flex min-w-0 items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <SelectValue placeholder="Select your country" />
              </span>
            </SelectTrigger>

            <SelectContent className="max-h-72 rounded-xl border border-white/10 bg-[#1E1240]">
              {allCountries.map((countryItem) => (
                <SelectItem
                  key={countryItem.isoCode}
                  value={countryItem.name}
                  className="rounded-lg text-sm text-white focus:bg-[#E8B85C]/10 focus:text-[#E8B85C]"
                >
                  {countryItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* State */}
        <div>
          <FieldLabel>State</FieldLabel>

          <Select
            value={state}
            onValueChange={(value) => {
              onStateChange(value);
              onCityChange("");
            }}
            disabled={!country}
          >
            <SelectTrigger className={selectTriggerClass}>
              <span className="flex min-w-0 items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <SelectValue
                  placeholder={
                    country ? "Select your state" : "Choose country first"
                  }
                />
              </span>
            </SelectTrigger>

            <SelectContent className="max-h-72 rounded-xl border border-white/10 bg-[#1E1240]">
              {states.map((stateItem) => (
                <SelectItem
                  key={stateItem.isoCode}
                  value={stateItem.name}
                  className="rounded-lg text-sm text-white focus:bg-[#E8B85C]/10 focus:text-[#E8B85C]"
                >
                  {stateItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div>
          <FieldLabel>City</FieldLabel>

          <Select value={city} onValueChange={onCityChange} disabled={!state}>
            <SelectTrigger className={selectTriggerClass}>
              <span className="flex min-w-0 items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-white/40" />
                <SelectValue
                  placeholder={
                    state ? "Select your city" : "Choose state first"
                  }
                />
              </span>
            </SelectTrigger>

            <SelectContent className="max-h-72 rounded-xl border border-white/10 bg-[#1E1240]">
              {cities.map((cityItem) => (
                <SelectItem
                  key={cityItem.name}
                  value={cityItem.name}
                  className="rounded-lg text-sm text-white focus:bg-[#E8B85C]/10 focus:text-[#E8B85C]"
                >
                  {cityItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </FieldGroup>
  );
}
