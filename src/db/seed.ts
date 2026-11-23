import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { loadDatabaseUrl } from "@/db/load-env";
import {
  statusEvents,
  vacancies,
  type NewStatusEvent,
  type NewVacancy,
  type VacancyStatus,
} from "@/db/schema";

// Own client: @/db/index imports "server-only", which throws outside Next.js.
const db = drizzle({ client: neon(loadDatabaseUrl()) });

type Step = { to: VacancyStatus; at: string; note?: string };
type SeedVacancy = NewVacancy & { id: string; history: Step[] };

const seedVacancies: SeedVacancy[] = [
  {
    id: randomUUID(),
    company: "Lumen Analytics",
    title: "Middle Frontend Developer (React)",
    companyUrl: "https://lumen-analytics.example.com",
    url: "https://jobs.dou.ua/companies/lumen-analytics/vacancies/000001/",
    source: "dou",
    rawText:
      "Шукаємо Middle Frontend Developer у продуктову команду BI-платформи. " +
      "Стек: React 19, TypeScript, TanStack Query, Recharts. 3+ роки комерційного досвіду, " +
      "розуміння рендерингу та оптимізації великих таблиць. Англійська — Intermediate.",
    salaryText: "$2500–3200",
    salaryMin: 2500,
    salaryMax: 3200,
    salaryCurrency: "USD",
    workFormat: "remote",
    englishLevel: "Intermediate",
    employmentType: "fop",
    reservation: "no",
    status: "interested",
    notes: "Цікавий продукт з дашбордами. Подати після оновлення CV.",
    history: [{ to: "interested", at: "2026-11-20T09:15:00Z" }],
  },
  {
    id: randomUUID(),
    company: "Kvitka Pay",
    title: "Frontend Engineer (Next.js)",
    companyUrl: "https://kvitkapay.example.com",
    url: "https://djinni.co/jobs/000002-frontend-engineer-next-js/",
    source: "djinni",
    rawText:
      "Fintech-стартап шукає Frontend Engineer. Next.js (App Router), TypeScript, " +
      "Tailwind CSS, тести на Vitest/Playwright. Буде плюсом досвід з платіжними формами та a11y. " +
      "Upper-Intermediate English.",
    salaryText: "від 3000$",
    salaryMin: 3000,
    salaryCurrency: "USD",
    workFormat: "hybrid",
    englishLevel: "Upper-Intermediate",
    employmentType: "fop",
    reservation: "unknown",
    contact: "Олена, @olena_kvitka_hr",
    status: "applied",
    appliedAt: "2026-11-18",
    nextStep: "Чекати відповідь рекрутера",
    history: [
      { to: "interested", at: "2026-11-17T18:40:00Z" },
      {
        to: "applied",
        at: "2026-11-18T10:05:00Z",
        note: "Відгук через Djinni + супровідний лист",
      },
    ],
  },
  {
    id: randomUUID(),
    company: "Northwind Logistics",
    title: "Senior Frontend Developer",
    companyUrl: "https://northwind-logistics.example.com",
    url: "https://www.linkedin.com/jobs/view/0000000003/",
    source: "linkedin",
    rawText:
      "International logistics company is hiring a Senior Frontend Developer. " +
      "React, TypeScript, micro-frontends, design system ownership, mentoring. " +
      "5+ years of experience, fluent English.",
    salaryText: "€4,000 – €5,000 gross",
    salaryMin: 4000,
    salaryMax: 5000,
    salaryCurrency: "EUR",
    workFormat: "remote",
    englishLevel: "Upper-Intermediate / Advanced",
    employmentType: "employee",
    reservation: "yes",
    contact: "Mark Taylor, mark.taylor@northwind-logistics.example.com",
    status: "technical",
    appliedAt: "2026-11-05",
    nextStep: "Технічна співбесіда: system design фронтенду",
    nextStepAt: "2026-11-26",
    notes: "Повторити micro-frontends і Module Federation.",
    history: [
      { to: "interested", at: "2026-11-04T08:00:00Z" },
      { to: "applied", at: "2026-11-05T09:30:00Z" },
      {
        to: "screening",
        at: "2026-11-12T14:00:00Z",
        note: "30 хв дзвінок з HR, обговорили вилку",
      },
      {
        to: "technical",
        at: "2026-11-19T16:20:00Z",
        note: "Запросили на технічне інтерв'ю",
      },
    ],
  },
  {
    id: randomUUID(),
    company: "Hrono Software",
    title: "Middle+ Frontend Developer (React/TypeScript)",
    companyUrl: "https://hrono.example.com",
    source: "referral",
    rawText:
      "Аутсорс-компанія, проєкт для клієнта з healthtech. React, TypeScript, Redux Toolkit, " +
      "GraphQL. Команда 6 фронтендів, Scrum. Офіс у Львові або віддалено.",
    salaryText: "120 000 – 140 000 грн",
    salaryMin: 120000,
    salaryMax: 140000,
    salaryCurrency: "UAH",
    workFormat: "hybrid",
    englishLevel: "Intermediate",
    employmentType: "employee",
    reservation: "yes",
    contact: "Андрій (знайомий, Team Lead)",
    status: "offer",
    appliedAt: "2026-10-20",
    nextStep: "Дати відповідь на офер",
    nextStepAt: "2026-11-27",
    notes: "Офер 135k UAH, бронювання є. Порівняти з Northwind.",
    history: [
      {
        to: "interested",
        at: "2026-10-18T12:00:00Z",
        note: "Рекомендація від Андрія",
      },
      { to: "applied", at: "2026-10-20T08:45:00Z" },
      { to: "screening", at: "2026-10-24T11:00:00Z" },
      { to: "technical", at: "2026-10-31T15:00:00Z" },
      { to: "test_task", at: "2026-11-03T10:00:00Z", note: "Тестове на 4 год" },
      { to: "final", at: "2026-11-12T13:00:00Z", note: "Зустріч з CTO" },
      { to: "offer", at: "2026-11-20T17:30:00Z" },
    ],
  },
  {
    id: randomUUID(),
    company: "Svitlo Retail",
    title: "Frontend Developer (Vue → React migration)",
    companyUrl: "https://svitlo-retail.example.com",
    url: "https://www.work.ua/jobs/0000005/",
    source: "work_ua",
    rawText:
      "Мережа магазинів шукає Frontend Developer для міграції інтернет-магазину з Vue 2 на React. " +
      "Офіс у Києві, 5 днів на тиждень.",
    salaryText: "70 000 грн",
    salaryMin: 70000,
    salaryMax: 70000,
    salaryCurrency: "UAH",
    workFormat: "office",
    employmentType: "employee",
    reservation: "unknown",
    status: "rejected",
    appliedAt: "2026-10-28",
    notes: "Відмова після скринінгу: шукають досвід з Vue 2.",
    history: [
      { to: "interested", at: "2026-10-27T19:00:00Z" },
      { to: "applied", at: "2026-10-28T09:00:00Z" },
      { to: "screening", at: "2026-11-03T12:30:00Z" },
      {
        to: "rejected",
        at: "2026-11-07T10:10:00Z",
        note: "Шукають сильніший Vue-досвід",
      },
    ],
  },
];

function buildEvents(v: SeedVacancy): NewStatusEvent[] {
  return v.history.map((step, i) => ({
    vacancyId: v.id,
    fromStatus: i === 0 ? null : (v.history[i - 1]?.to ?? null),
    toStatus: step.to,
    note: step.note ?? null,
    createdAt: new Date(step.at),
  }));
}

async function main() {
  const [existing] = await db.select({ n: count() }).from(vacancies);
  if (existing && existing.n > 0) {
    console.error(
      `Seed skipped: vacancies already has ${existing.n} row(s). Seed runs only on an empty database.`,
    );
    process.exitCode = 1;
    return;
  }

  const vacancyRows: NewVacancy[] = seedVacancies.map(
    ({ history, ...row }) => ({
      ...row,
      createdAt: new Date(history[0]?.at ?? Date.now()),
      updatedAt: new Date(history.at(-1)?.at ?? Date.now()),
    }),
  );
  const eventRows = seedVacancies.flatMap(buildEvents);

  // neon-http has no interactive transactions; batch runs atomically.
  await db.batch([
    db.insert(vacancies).values(vacancyRows),
    db.insert(statusEvents).values(eventRows),
  ]);

  console.log(
    `Seeded ${vacancyRows.length} vacancies and ${eventRows.length} status events.`,
  );
}

main().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
