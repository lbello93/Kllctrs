import type { DatabaseEvent } from "../models/database-event";

import { GeoapifyProvider } from "../providers/geoapify";

export class GeocoderService {

  private readonly provider =
    new GeoapifyProvider();

  buildAddress(event: DatabaseEvent): string {

    return [

      event.venue_address,

      event.city,

      event.state,

      event.zip_code,

      event.country,

    ]
      .filter(Boolean)
      .join(", ");

  }

  async geocode(
    event: DatabaseEvent
  ): Promise<DatabaseEvent> {

    if (!event.venue_address?.trim() || !process.env.GEOAPIFY_API_KEY) {
      return event;
    }

    const address =
      this.buildAddress(event);

    const result =
      await this.provider.geocode(
        address
      );

    return {

      ...event,

      lat: result.latitude,

      lng: result.longitude,

    };

  }

}
