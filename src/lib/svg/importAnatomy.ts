
import { readFile } from "node:fs/promises";

import { readSvg } from "./reader";
import { insertAnatomy } from "./insertAnatomy";

interface ImportAnatomyParams {
  filePath: string;
  name: string;
  category: string;
}

export async function importAnatomy({
  filePath,
  name,
  category,
}: ImportAnatomyParams) {
  // Leer archivo SVG
  const source = await readFile(filePath, "utf-8");

  // Convertir SVG a documento JSON
  const document = readSvg(source);

  console.log(
    "DOCUMENTO PARSEADO:",
    JSON.stringify(document.children, null, 2)
);

  // Insertar anatomía en PostgreSQL
  const result = await insertAnatomy({
    name,
    category,
    document,
  });

  return result;
}
