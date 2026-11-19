
import { importAnatomy } from "../src/lib/svg/importAnatomy";

async function main() {
  const result = await importAnatomy({
    filePath: "components/character/human/male/Human-male-T-pose.svg",
    name: "Human Male",
    category: "human",
  });

  console.log("Anatomía importada correctamente:");
  console.log(result);
}

main().catch((error) => {
  console.error("Error al importar anatomía:", error);
  process.exitCode = 1;
});
