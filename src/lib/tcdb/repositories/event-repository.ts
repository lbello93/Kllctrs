import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

import type { EventInsertRow } from "@/lib/events/supabase-mapper";
import { findEventIdentityMatch } from "@/lib/events/deduplication";
import type { EventCandidate } from "@/lib/events/ingestion-contract";

export class EventRepository {

  constructor(
    private readonly supabase: SupabaseClient<Database>
  ) {}

  //--------------------------------------------------
  // Create
  //--------------------------------------------------

  async create(
    row: EventInsertRow
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .insert(row)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Batch Create
  //--------------------------------------------------

  async createMany(
    rows: EventInsertRow[]
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .insert(rows)
        .select();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Find By ID
  //--------------------------------------------------

  async findById(
    id: string
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Find By Slug
  //--------------------------------------------------

  async findBySlug(
    slug: string
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Update
  //--------------------------------------------------

  async update(
    id: string,
    updates: Partial<EventInsertRow>
  ) {

    const { data, error } =
      await this.supabase
        .from("events")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Delete
  //--------------------------------------------------

  async delete(
    id: string
  ) {

    const { error } =
      await this.supabase
        .from("events")
        .delete()
        .eq("id", id);

    if (error) {
      throw error;
    }

  }

  //--------------------------------------------------
  // Pending Events
  //--------------------------------------------------

  async pending() {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("status", "pending")
        .order("date_start");

    if (error) {
      throw error;
    }

    return data;

  }

  //--------------------------------------------------
  // Approved Events
  //--------------------------------------------------

  async approved() {

    const { data, error } =
      await this.supabase
        .from("events")
        .select("*")
        .eq("status", "approved")
        .order("date_start");

    if (error) {
      throw error;
    }

    return data;

  }
async findPossibleDuplicates(candidate: EventCandidate) {
  return findEventIdentityMatch(this.supabase, candidate);
}

}


