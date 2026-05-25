import { NextRequest, NextResponse } from "next/server";
import { queryRAG } from "@/lib/rag";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.message !== "string") {
      return NextResponse.json(
        { success: false, error: "Corpo inválido. Envie { message: string }" },
        { status: 400 }
      );
    }

    const message = body.message.trim();

    if (!message) {
      return NextResponse.json(
        { success: false, error: "Mensagem vazia" },
        { status: 400 }
      );
    }

    const result = await queryRAG(message);

    return NextResponse.json(
      {
        success: true,
        response: result.answer,
        sources: result.sources,
      },
      { status: 200 }
    );
  } catch (error: any) {
    const message =
      error?.message ||
      "Erro ao processar sua pergunta";

    console.error("Erro na API /api/chat:", error);

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
