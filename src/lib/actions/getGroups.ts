
import { eq, desc, sql } from "drizzle-orm";
import { db } from "../dbConfig";
import { GroupExpenses, GroupMembers, Groups } from "@/schema";

export const getGroupsList = async (email: string) => {
  if (!email) return [];

  const groups = await db
    .select({
      id: Groups.id,
      name: Groups.name,
      inviteLink: Groups.inviteLink,
      createdAt: Groups.createdAt,
      createdBy: Groups.createdBy,
      totalMembers: sql<number>`COUNT(DISTINCT ${GroupMembers.id})`.mapWith(Number),
      totalExpenses: sql<number>`COALESCE(SUM(CAST(${GroupExpenses.amount} AS NUMERIC)), 0)`.mapWith(Number),
      lastActivity: sql<string>`MAX(${GroupExpenses.date})`.mapWith(String),
    })
    .from(Groups)
    .leftJoin(GroupMembers, eq(Groups.id, GroupMembers.groupId))
    .leftJoin(GroupExpenses, eq(Groups.id, GroupExpenses.groupId))
    .where(eq(Groups.createdBy, email))
    .groupBy(Groups.id)
    .orderBy(desc(Groups.id));

  return groups;
};
