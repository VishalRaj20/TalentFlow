import Dexie from "dexie";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

export const db = new Dexie("talentflow_db");

db.version(1).stores({
  jobs: "id, slug, title, status, tags, order",
  candidates: "id, name, email, stage, jobId, createdAt",
  timelines: "id, candidateId, events",
  assessments: "id, jobId, data, updatedAt",
});

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function initDB() {
  const jobsCount = await db.jobs.count();
  if (jobsCount > 0) {
    console.log("[DB] already seeded");
    return;
  }
  console.log("[DB] seeding data...");
  const tagsPool = ["frontend", "backend", "devops", "design", "hr", "product", "qa"];
  const statuses = ["open", "closed", "archived"];

  const jobs = Array.from({ length: 25 }).map((_, i) => {
    const title = `${pick(["Senior", "Junior", "Lead", "Principal"])} ${pick(["Frontend", "Backend", "Fullstack", "DevOps", "Designer"])} Engineer ${i + 1}`;
    const slug = `${slugify(title)}-${i + 1}`;
    return {
      id: nanoid(),
      title,
      slug,
      status: pick(statuses),
      tags: [pick(tagsPool), pick(tagsPool)].filter(Boolean),
      order: i,
    };
  });

  const candidates = [];
  const stages = ["applied", "phone", "onsite", "offer", "hired", "rejected"];
  for (let i = 0; i < 1000; i++) {
    const first = pick(["Alex", "Sam", "Jordan", "Taylor", "Casey", "Riley", "Morgan", "Jamie", "Robin", "Avery"]);
    const last = pick(["Patel", "Khan", "Gupta", "Singh", "Shah", "Rao", "Iyer", "Das", "Ganguly", "Roy"]);
    const name = `${first} ${last} ${i}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@gmail.com`;
    const job = pick(jobs);
    const stage = pick(stages);
    const id = nanoid();
    candidates.push({
      id,
      name,
      email,
      stage,
      jobId: job.id,
      createdAt: dayjs().subtract(randInt(0, 365), "day").toISOString()
    });
  }

  const assessments = [];
  for (let j = 0; j < 3; j++) {
    const job = pick(jobs);
    const questions = Array.from({ length: 10 }).map((_, qi) => {
      return {
        id: `q-${qi + 1}`,
        type: pick(["single", "multi", "short", "long", "numeric"]),
        label: `Question ${qi + 1} for ${job.title}`,
        required: Math.random() > 0.3,
        maxLength: 200
      };
    });
    assessments.push({
      id: nanoid(),
      jobId: job.id,
      data: { title: `${job.title} Assessment`, sections: [{ id: "s1", title: "General", questions }] },
      updatedAt: new Date().toISOString()
    });
  }

  await db.transaction("rw", db.jobs, db.candidates, db.assessments, async () => {
    await db.jobs.bulkAdd(jobs);
    await db.candidates.bulkAdd(candidates);
    await db.assessments.bulkAdd(assessments);
  });

  console.log("[DB] seeding complete");
}

export default db;
