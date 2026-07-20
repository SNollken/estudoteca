import { and, asc, eq, gte, lt } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { examQuestions, exams, questionOptions, questions } from "../../../../../db/schema";

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const url = new URL(request.url);
  const start = Math.max(1, Number(url.searchParams.get("start") ?? "1") || 1);
  const requestedLimit = Number(url.searchParams.get("limit") ?? "90") || 90;
  const limit = Math.min(90, Math.max(1, requestedLimit));

  try {
    const db = await getDb();
    const [exam] = await db
      .select({
        id: exams.id,
        slug: exams.slug,
        title: exams.title,
        description: exams.description,
        durationMinutes: exams.durationMinutes,
        questionCount: exams.questionCount,
      })
      .from(exams)
      .where(and(eq(exams.slug, slug), eq(exams.status, "published")))
      .limit(1);

    if (!exam) return Response.json({ error: "Simulado não encontrado" }, { status: 404 });

    const rows = await db
      .select({
        position: examQuestions.position,
        questionId: questions.id,
        officialNumber: questions.officialNumber,
        language: questions.language,
        area: questions.area,
        topic: questions.topic,
        contentJson: questions.contentJson,
        answerStatus: questions.answerStatus,
        sourceLabel: questions.sourceLabel,
        sourceUrl: questions.sourceUrl,
        optionId: questionOptions.id,
        optionLabel: questionOptions.label,
        optionContent: questionOptions.content,
      })
      .from(examQuestions)
      .innerJoin(questions, eq(examQuestions.questionId, questions.id))
      .innerJoin(questionOptions, eq(questionOptions.questionId, questions.id))
      .where(
        and(
          eq(examQuestions.examId, exam.id),
          gte(examQuestions.position, start),
          lt(examQuestions.position, start + limit),
          eq(questions.status, "published"),
        ),
      )
      .orderBy(asc(examQuestions.position), asc(questionOptions.label));

    const questionMap = new Map<number, {
      id: number;
      position: number;
      officialNumber: number | null;
      language: string | null;
      area: string;
      topic: string;
      content: Array<{ type: "text" | "image"; content: string }>;
      answerStatus: string;
      sourceLabel: string | null;
      sourceUrl: string | null;
      options: Array<{ id: number; label: string; content: Array<{ type: "text" | "image"; content: string }> }>;
    }>();

    function parseContent(value: string) {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed as Array<{ type: "text" | "image"; content: string }>;
      } catch {
        // Older editorial records can still contain plain text.
      }
      return value ? [{ type: "text" as const, content: value }] : [];
    }

    for (const row of rows) {
      if (!questionMap.has(row.questionId)) {
        questionMap.set(row.questionId, {
          id: row.questionId,
          position: row.position,
          officialNumber: row.officialNumber,
          language: row.language,
          area: row.area,
          topic: row.topic,
          content: parseContent(row.contentJson),
          answerStatus: row.answerStatus,
          sourceLabel: row.sourceLabel,
          sourceUrl: row.sourceUrl,
          options: [],
        });
      }
      questionMap.get(row.questionId)?.options.push({
        id: row.optionId,
        label: row.optionLabel,
        content: parseContent(row.optionContent),
      });
    }

    return Response.json({
      exam: {
        slug: exam.slug,
        title: exam.title,
        description: exam.description,
        durationMinutes: exam.durationMinutes,
        questionCount: exam.questionCount,
      },
      start,
      limit,
      questions: Array.from(questionMap.values()),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha ao carregar questões";
    return Response.json({ error: message }, { status: 500 });
  }
}
