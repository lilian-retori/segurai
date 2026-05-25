import { GoogleGenerativeAI } from "@google/generative-ai";
import docsData from "@/data/documents.json";

type DocItem = { content: string };
type RagResult = {
  answer: string;
  sources: string[];
};

const MODEL_NAME = "gemini-1.5-flash";
const MAX_DOCS = 8;
const MAX_CHARS_PER_DOC = 3500;
const MAX_TOTAL_CONTEXT_CHARS = 14000;

function getApiKey(): string {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY não definida no ambiente");
  }
  return apiKey;
}

function getDocuments(): string[] {
  if (!Array.isArray(docsData)) return [];

  return (docsData as DocItem[])
    .map((d) => (typeof d?.content === "string" ? d.content.trim() : ""))
    .filter(Boolean);
}

function limitText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars);
}

function buildContext(documents: string[]): string {
  const selected = documents.slice(0, MAX_DOCS);
  const parts: string[] = [];
  let total = 0;

  for (const doc of selected) {
    const chunk = limitText(doc, MAX_CHARS_PER_DOC);
    const formatted = `--- DOCUMENTO ---\n${chunk}`;
    if (total + formatted.length > MAX_TOTAL_CONTEXT_CHARS) break;
    parts.push(formatted);
    total += formatted.length;
  }

  return parts.join("\n\n");
}

function buildPrompt(context: string, question: string): string {
  return `Você é um assistente de seguros chamado SegurAI.

Regras:
- Responda sempre em português brasileiro.
- Seja claro, objetivo e profissional.
- Use somente as informações presentes nos documentos abaixo.
- Se a resposta não estiver nos documentos, diga exatamente: "Esta informação não está disponível em meus registros".
- Não invente informações.
- Não cite nomes de documentos na resposta.
- Não mencione que viu fontes internas.
- Se a pergunta pedir algo fora da base, recuse de forma educada.

DOCUMENTOS:
${context}

PERGUNTA:
${question}

RESPOSTA:`;
}

export async function initializeRAG(): Promise<void> {
  const docs = getDocuments();
  console.log(`RAG inicializado com ${docs.length} documentos`);
}

export async function queryRAG(question: string): Promise<RagResult> {
  const apiKey = getApiKey();
  const documents = getDocuments();

  if (documents.length === 0) {
    throw new Error("Nenhum documento encontrado na base de dados");
  }

  const cleanedQuestion = question.trim();
  if (!cleanedQuestion) {
    throw new Error("Pergunta vazia");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  const context = buildContext(documents);
  const prompt = buildPrompt(context, cleanedQuestion);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text()?.trim() || "";

    if (!text) {
      throw new Error("O modelo retornou resposta vazia");
    }

    return {
      answer: text,
      sources: ["Base de Documentos SegurAI"],
    };
  } catch (error: any) {
    const msg =
      error?.message ||
      error?.toString?.() ||
      "Erro desconhecido ao chamar o Gemini";

    console.error("Erro real do Gemini:", msg);
    throw new Error(`Erro ao processar sua pergunta: ${msg}`);
  }
}
