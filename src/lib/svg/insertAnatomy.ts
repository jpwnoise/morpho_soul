
import pool from "@/src/lib/bd/connection";
import type { SvgDocument } from "./types";

interface InsertAnatomyParams {
  name: string;
  category: string;
  document: SvgDocument;
}

export async function insertAnatomy({
  name,
  category,
  document,
}: InsertAnatomyParams) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Crear anatomía
    const anatomyResult = await client.query(
      `INSERT INTO anatomies (name, category)
       VALUES ($1, $2)
       RETURNING id`,
      [name, category]
    );

    const anatomyId = anatomyResult.rows[0].id;

    // Crear primera versión
    await client.query(
      `INSERT INTO anatomy_versions
       (anatomy_id, version, document)
       VALUES ($1, $2, $3::jsonb)`,
      [anatomyId, 1, JSON.stringify(document)]
    );

    await client.query("COMMIT");

    return {
      anatomyId,
      version: 1,
    };

  } catch (error) {
    await client.query("ROLLBACK");
    throw error;

  } finally {
    client.release();
  }
}