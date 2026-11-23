import { relations } from "drizzle-orm";
import {
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Enum values are stored in English; Ukrainian labels live in UI code.

export const vacancyStatusValues = [
  "interested",
  "applied",
  "contacted_recruiter",
  "screening",
  "technical",
  "test_task",
  "final",
  "offer",
  "rejected",
  "no_response",
  "closed",
  "withdrawn",
] as const;

export const vacancySourceValues = [
  "linkedin",
  "dou",
  "djinni",
  "work_ua",
  "referral",
  "other",
] as const;

export const employmentTypeValues = ["employee", "fop", "unknown"] as const;
export const reservationValues = ["yes", "no", "unknown"] as const;
export const salaryCurrencyValues = ["USD", "EUR", "UAH"] as const;
export const workFormatValues = ["remote", "hybrid", "office"] as const;

export const vacancyStatus = pgEnum("vacancy_status", vacancyStatusValues);
export const vacancySource = pgEnum("vacancy_source", vacancySourceValues);
export const employmentType = pgEnum("employment_type", employmentTypeValues);
export const reservation = pgEnum("reservation", reservationValues);
export const salaryCurrency = pgEnum("salary_currency", salaryCurrencyValues);
export const workFormat = pgEnum("work_format", workFormatValues);

export type VacancyStatus = (typeof vacancyStatusValues)[number];
export type VacancySource = (typeof vacancySourceValues)[number];
export type EmploymentType = (typeof employmentTypeValues)[number];
export type Reservation = (typeof reservationValues)[number];
export type SalaryCurrency = (typeof salaryCurrencyValues)[number];
export type WorkFormat = (typeof workFormatValues)[number];

export const vacancies = pgTable(
  "vacancies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    company: text("company").notNull(),
    title: text("title").notNull(),
    companyUrl: text("company_url"),
    url: text("url"),
    source: vacancySource("source").notNull().default("other"),
    rawText: text("raw_text"),
    salaryText: text("salary_text"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryCurrency: salaryCurrency("salary_currency"),
    workFormat: workFormat("work_format"),
    englishLevel: text("english_level"),
    employmentType: employmentType("employment_type")
      .notNull()
      .default("unknown"),
    reservation: reservation("reservation").notNull().default("unknown"),
    contact: text("contact"),
    status: vacancyStatus("status").notNull().default("interested"),
    nextStep: text("next_step"),
    nextStepAt: date("next_step_at", { mode: "string" }),
    notes: text("notes"),
    appliedAt: date("applied_at", { mode: "string" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("vacancies_status_idx").on(t.status),
    index("vacancies_next_step_at_idx").on(t.nextStepAt),
  ],
);

export const statusEvents = pgTable(
  "status_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    vacancyId: uuid("vacancy_id")
      .notNull()
      .references(() => vacancies.id, { onDelete: "cascade" }),
    fromStatus: vacancyStatus("from_status"),
    toStatus: vacancyStatus("to_status").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("status_events_vacancy_id_idx").on(t.vacancyId)],
);

export const vacanciesRelations = relations(vacancies, ({ many }) => ({
  statusEvents: many(statusEvents),
}));

export const statusEventsRelations = relations(statusEvents, ({ one }) => ({
  vacancy: one(vacancies, {
    fields: [statusEvents.vacancyId],
    references: [vacancies.id],
  }),
}));

export type Vacancy = typeof vacancies.$inferSelect;
export type NewVacancy = typeof vacancies.$inferInsert;
export type StatusEvent = typeof statusEvents.$inferSelect;
export type NewStatusEvent = typeof statusEvents.$inferInsert;
