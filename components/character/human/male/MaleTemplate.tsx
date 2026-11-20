
"use client";

import { useEffect, useState } from "react";

import AnatomyRenderer from "@/components/Anatomy/AnatomyRenderer";
import type { SvgDocument } from "@/src/lib/svg/types";

const ANATOMY_ID = "e50cfe88-acef-428f-b725-dcbf2706e021";

interface AnatomyResponse {
  id: string;
  anatomy_id: string;
  version: number;
  document: SvgDocument;
}

export default function MaleTemplate() {
  const [anatomy, setAnatomy] = useState<AnatomyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnatomy() {
      try {
        const response = await fetch(`/api/anatomies/${ANATOMY_ID}`);

        if (!response.ok) {
          throw new Error("No se pudo recuperar la anatomía");
        }

        const data: AnatomyResponse = await response.json();

        setAnatomy(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error desconocido"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAnatomy();
  }, []);

  if (loading) {
    return <p>Cargando anatomía...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!anatomy) {
    return <p>No se encontró la anatomía.</p>;
  }

  return (
    <div>
      <p>Human Male - Versión {anatomy.version}</p>

      <AnatomyRenderer
        document={anatomy.document}
        className="w-full h-auto"
      />
    </div>
  );
}
