import { sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  plusDaysAccumulated: integer("plus_days_accumulated").notNull().default(0),
  storageLimitBytes: integer("storage_limit_bytes").notNull().default(52_428_800),
  storageUsedBytes: integer("storage_used_bytes").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const subjects = sqliteTable(
  "subjects",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    area: text("area").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("subjects_area_sort_idx").on(table.area, table.sortOrder)],
);

export const topics = sqliteTable(
  "topics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    subjectId: integer("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    parentId: integer("parent_id"),
    path: text("path").notNull(),
    depth: integer("depth").notNull().default(0),
    premiumFilter: integer("premium_filter", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [
    index("topics_subject_parent_idx").on(table.subjectId, table.parentId),
    index("topics_path_idx").on(table.path),
  ],
);

export const questions = sqliteTable(
  "questions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    externalId: text("external_id"),
    year: integer("year"),
    examDay: integer("exam_day"),
    booklet: text("booklet"),
    officialNumber: integer("official_number"),
    language: text("language"),
    area: text("area").notNull(),
    topic: text("topic").notNull(),
    statement: text("statement").notNull(),
    contentJson: text("content_json").notNull().default("[]"),
    supportText: text("support_text"),
    sourceLabel: text("source_label"),
    sourceUrl: text("source_url"),
    imageKey: text("image_key"),
    assetBundleKey: text("asset_bundle_key"),
    difficulty: text("difficulty").notNull().default("medium"),
    answerStatus: text("answer_status").notNull().default("valid"),
    status: text("status").notNull().default("draft"),
    reviewStatus: text("review_status").notNull().default("pending"),
    taxonomyVersion: integer("taxonomy_version").notNull().default(1),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("questions_external_id_idx").on(table.externalId),
    index("questions_area_topic_idx").on(table.area, table.topic),
    index("questions_year_status_idx").on(table.year, table.status),
    uniqueIndex("questions_official_position_idx").on(
      table.year,
      table.examDay,
      table.booklet,
      table.officialNumber,
      table.language,
    ),
  ],
);

export const questionTopics = sqliteTable(
  "question_topics",
  {
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    topicId: integer("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    isPrimary: integer("is_primary", { mode: "boolean" }).notNull().default(false),
    confidence: integer("confidence").notNull().default(100),
    assignedBy: text("assigned_by").notNull().default("editorial"),
    reviewedAt: text("reviewed_at"),
  },
  (table) => [
    primaryKey({ columns: [table.questionId, table.topicId] }),
    index("question_topics_topic_question_idx").on(table.topicId, table.questionId),
  ],
);

export const questionOptions = sqliteTable(
  "question_options",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    content: text("content").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull().default(false),
  },
  (table) => [
    uniqueIndex("question_options_question_label_idx").on(table.questionId, table.label),
  ],
);

export const exams = sqliteTable(
  "exams",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    year: integer("year"),
    durationMinutes: integer("duration_minutes").notNull(),
    questionCount: integer("question_count").notNull(),
    status: text("status").notNull().default("draft"),
    publishedAt: text("published_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("exams_status_year_idx").on(table.status, table.year)],
);

export const examQuestions = sqliteTable(
  "exam_questions",
  {
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.examId, table.questionId] }),
    uniqueIndex("exam_questions_position_idx").on(table.examId, table.position),
  ],
);

export const attempts = sqliteTable(
  "attempts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    examId: integer("exam_id")
      .notNull()
      .references(() => exams.id),
    status: text("status").notNull().default("in_progress"),
    correctCount: integer("correct_count"),
    scorePercent: integer("score_percent"),
    startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    submittedAt: text("submitted_at"),
  },
  (table) => [
    index("attempts_user_started_idx").on(table.userId, table.startedAt),
    index("attempts_exam_status_idx").on(table.examId, table.status),
  ],
);

export const attemptAnswers = sqliteTable(
  "attempt_answers",
  {
    attemptId: text("attempt_id")
      .notNull()
      .references(() => attempts.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
    optionId: integer("option_id").references(() => questionOptions.id),
    isFlagged: integer("is_flagged", { mode: "boolean" }).notNull().default(false),
    answeredAt: text("answered_at"),
  },
  (table) => [primaryKey({ columns: [table.attemptId, table.questionId] })],
);

export const certificates = sqliteTable(
  "certificates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    institution: text("institution").notNull(),
    category: text("category"),
    workloadHours: integer("workload_hours"),
    issuedAt: text("issued_at"),
    validationUrl: text("validation_url"),
    summary: text("summary"),
    skillsJson: text("skills_json").notNull().default("[]"),
    fileKey: text("file_key"),
    fileName: text("file_name"),
    fileType: text("file_type"),
    fileSizeBytes: integer("file_size_bytes").notNull().default(0),
    status: text("status").notNull().default("active"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("certificates_user_created_idx").on(table.userId, table.createdAt),
    index("certificates_user_category_idx").on(table.userId, table.category),
  ],
);

export const subscriptions = sqliteTable(
  "subscriptions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    provider: text("provider").notNull().default("mercado_pago"),
    providerPaymentId: text("provider_payment_id"),
    periodDays: integer("period_days").notNull(),
    priceCents: integer("price_cents").notNull(),
    status: text("status").notNull().default("pending"),
    startsAt: text("starts_at"),
    endsAt: text("ends_at"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("subscriptions_provider_payment_idx").on(table.providerPaymentId),
    index("subscriptions_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export const contactMessages = sqliteTable(
  "contact_messages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    category: text("category").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    pageUrl: text("page_url"),
    status: text("status").notNull().default("new"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("contact_messages_status_created_idx").on(table.status, table.createdAt),
    index("contact_messages_email_created_idx").on(table.email, table.createdAt),
  ],
);
