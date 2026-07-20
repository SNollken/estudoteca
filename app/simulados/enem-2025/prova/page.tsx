import { Enem2025Runner } from "./exam-runner";

export const dynamic = "force-dynamic";

const availableExams = new Set([
  "enem-2025-dia-1-ingles",
  "enem-2025-dia-1-espanhol",
  "enem-2025-dia-2",
]);

export default async function Enem2025ExamPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const requested = typeof params.prova === "string" ? params.prova : "enem-2025-dia-2";
  const examSlug = availableExams.has(requested) ? requested : "enem-2025-dia-2";
  return <Enem2025Runner examSlug={examSlug} />;
}
