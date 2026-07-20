import { and, asc, eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { examQuestions, exams, questionOptions, questions } from "../../../../../db/schema";

export async function POST(
  request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const body = await request.json() as { answers?: Record<string, unknown> };
    const answers = body.answers ?? {};
    const db = await getDb();

    const [exam] = await db
      .select({ id: exams.id, slug: exams.slug, title: exams.title })
      .from(exams)
      .where(and(eq(exams.slug, slug), eq(exams.status, "published")))
      .limit(1);

    if (!exam) return Response.json({ error: "Simulado não encontrado" }, { status: 404 });

    const rows = await db
      .select({
        position: examQuestions.position,
        questionId: questions.id,
        officialNumber: questions.officialNumber,
        answerStatus: questions.answerStatus,
        correctOptionId: questionOptions.id,
        correctLabel: questionOptions.label,
      })
      .from(examQuestions)
      .innerJoin(questions, eq(examQuestions.questionId, questions.id))
      .leftJoin(
        questionOptions,
        and(
          eq(questionOptions.questionId, questions.id),
          eq(questionOptions.isCorrect, true),
        ),
      )
      .where(eq(examQuestions.examId, exam.id))
      .orderBy(asc(examQuestions.position));

    const results = rows.map((row) => {
      const rawSelected = answers[String(row.questionId)];
      const selectedOptionId = Number.isInteger(rawSelected) ? Number(rawSelected) : null;
      const annulled = row.answerStatus === "annulled";
      return {
        position: row.position,
        questionId: row.questionId,
        officialNumber: row.officialNumber,
        selectedOptionId,
        correctOptionId: annulled ? null : row.correctOptionId,
        correctLabel: annulled ? null : row.correctLabel,
        answerStatus: row.answerStatus,
        isCorrect: annulled ? null : selectedOptionId === row.correctOptionId,
      };
    });

    const scoredResults = results.filter((result) => result.answerStatus !== "annulled");
    const score = scoredResults.filter((result) => result.isCorrect).length;

    return Response.json({
      exam: { slug: exam.slug, title: exam.title },
      score,
      total: results.length,
      totalScored: scoredResults.length,
      annulledCount: results.length - scoredResults.length,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível corrigir a prova.";
    return Response.json({ error: message }, { status: 400 });
  }
}
