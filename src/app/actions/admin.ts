"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { recountQuestion } from "@/lib/queries";

type TargetType = "question" | "answer" | "reply";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Not allowed");
  return user;
}

async function deleteTarget(targetType: TargetType, targetId: string) {
  if (targetType === "question") {
    const answerIds = (await db.answer.findMany({ where: { questionId: targetId }, select: { id: true } })).map((a) => a.id);
    const replyIds = (await db.reply.findMany({ where: { questionId: targetId }, select: { id: true } })).map((r) => r.id);
    await db.question.deleteMany({ where: { id: targetId } });
    await db.report.deleteMany({
      where: {
        OR: [
          { targetType: "question", targetId },
          { targetType: "answer", targetId: { in: answerIds } },
          { targetType: "reply", targetId: { in: replyIds } },
        ],
      },
    });
    return;
  }
  if (targetType === "answer") {
    const answer = await db.answer.findUnique({ where: { id: targetId }, include: { replies: { select: { id: true } } } });
    if (answer) {
      await db.answer.delete({ where: { id: targetId } });
      await recountQuestion(answer.questionId);
      await db.report.deleteMany({ where: { targetType: "reply", targetId: { in: answer.replies.map((r) => r.id) } } });
    }
  } else {
    const reply = await db.reply.findUnique({ where: { id: targetId } });
    if (reply) {
      await db.reply.delete({ where: { id: targetId } });
      await recountQuestion(reply.questionId);
    }
  }
  await db.report.deleteMany({ where: { targetType, targetId } });
}

async function authorOf(targetType: TargetType, targetId: string) {
  const where = { where: { id: targetId }, select: { authorId: true } };
  const row =
    targetType === "question"
      ? await db.question.findUnique(where)
      : targetType === "answer"
        ? await db.answer.findUnique(where)
        : await db.reply.findUnique(where);
  return row?.authorId ?? null;
}

export async function dismissReports(targetType: TargetType, targetId: string) {
  await requireAdmin();
  await db.report.deleteMany({ where: { targetType, targetId } });
  revalidatePath("/admin");
}

export async function deleteContent(targetType: TargetType, targetId: string) {
  await requireAdmin();
  await deleteTarget(targetType, targetId);
  revalidatePath("/", "layout");
}

/** Bans the author of a piece of content and removes that content. */
export async function banAuthor(targetType: TargetType, targetId: string) {
  const admin = await requireAdmin();
  const authorId = await authorOf(targetType, targetId);
  if (!authorId || authorId === admin.id) return;
  await db.user.update({ where: { id: authorId }, data: { banned: true } });
  await db.session.deleteMany({ where: { userId: authorId } });
  await deleteTarget(targetType, targetId);
  revalidatePath("/", "layout");
}
