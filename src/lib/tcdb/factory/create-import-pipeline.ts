import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

import { EventRepository } from "../repositories/event-repository";

import { DuplicateCheckerService } from "../services/duplicate-checker";
import { GeocoderService } from "../services/geocoder";
import { ImporterService } from "../services/importer";
import { BatchImporterService } from "../services/batch-importer";

import { ImportPipeline } from "../pipeline/import-pipeline";

export function createImportPipeline() {

  //--------------------------------------------------
  // Environment Validation
  //--------------------------------------------------

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL is missing."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing."
    );
  }

  //--------------------------------------------------
  // Supabase Client
  //--------------------------------------------------

  const supabase =
    createClient<Database>(
      supabaseUrl,
      serviceRoleKey
    );

  //--------------------------------------------------
  // Repository
  //--------------------------------------------------

  const repository =
    new EventRepository(
      supabase
    );

  //--------------------------------------------------
  // Services
  //--------------------------------------------------

  const duplicateChecker =
    new DuplicateCheckerService(
      repository
    );

  const geocoder =
    new GeocoderService();

  const importer =
    new ImporterService(
      repository,
      duplicateChecker,
      geocoder
    );

  const batchImporter =
    new BatchImporterService(
      importer,
      {
        concurrency: 5,
      }
    );

  //--------------------------------------------------
  // Pipeline
  //--------------------------------------------------

  return new ImportPipeline(
    batchImporter
  );

}
