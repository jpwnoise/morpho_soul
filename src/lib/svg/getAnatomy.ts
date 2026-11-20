
import pool from "@/src/lib/bd/connection";
import type { SvgDocument } from "./types";

interface AnatomyVersion {
  id: string;
  anatomy_id: string;
  version: number;
  document: SvgDocument;
}

export async function getAnatomy(anatomyId: string) {
  const result = await pool.query<AnatomyVersion>(
    `SELECT
       id,
       anatomy_id,
       version,
       document
     FROM anatomy_versions
     WHERE anatomy_id = $1
     ORDER BY version DESC
     LIMIT 1`,
    [anatomyId]
  );

  if (result.rows.length === 0) {
    throw new Error("No se encontró la anatomía");
  }

  return result.rows[0];
}
