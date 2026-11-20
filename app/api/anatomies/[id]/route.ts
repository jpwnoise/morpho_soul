
import { NextResponse } from "next/server";
import { getAnatomy } from "@/src/lib/svg/getAnatomy";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const anatomy = await getAnatomy(id);

    return NextResponse.json(anatomy);

  } catch (error) {
    console.error("Error al consultar anatomía:", error);

    return NextResponse.json(
      { message: "No se pudo obtener la anatomía" },
      { status: 404 }
    );
  }
}
