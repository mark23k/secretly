import "server-only";
import { db } from "./db";
import { LIMITS } from "./constants";

/** True if the user has posted fewer than ~10 questions/answers/replies in the last hour. */
export async function underPostLimit(userId: string) {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const where = { authorId: userId, createdAt: { gte: since } };
  const [q, a, r] = await Promise.all([
    db.question.count({ where }),
    db.answer.count({ where }),
    db.reply.count({ where }),
  ]);
  return q + a + r < LIMITS.postsPerHour;
}
