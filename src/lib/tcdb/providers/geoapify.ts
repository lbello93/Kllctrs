export interface GeoapifyResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
}

export class GeoapifyProvider {
  private readonly apiKey: string | undefined;

  constructor() {
    const key = process.env.GEOAPIFY_API_KEY;

    this.apiKey = key;
  }

  async geocode(address: string): Promise<GeoapifyResult> {
    if (!this.apiKey) throw new Error("GEOAPIFY_API_KEY is missing.");
    const params = new URLSearchParams({
      text: address,
      apiKey: this.apiKey,
    });

    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?${params.toString()}`,
      { signal: AbortSignal.timeout(10_000) },
    );

    if (!response.ok) {
      throw new Error(
        `Geoapify request failed (${response.status})`
      );
    }

    const json = await response.json();

    if (
      !json.features ||
      json.features.length === 0
    ) {
      throw new Error(
        `No location found for ${address}`
      );
    }

    const feature = json.features[0];

    return {
      latitude: feature.properties.lat,
      longitude: feature.properties.lon,
      formattedAddress: feature.properties.formatted,
    };
  }
}
