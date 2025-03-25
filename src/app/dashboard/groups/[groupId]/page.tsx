"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, PlusCircle, Share2, BarChart } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { GroupExpensesList } from "@/components/GroupExpensesList";
import { BalancesSummary } from "@/components/BalancesSummary";
import { MembersList } from "@/components/MembersList";
import { GroupDashboard } from "@/components/GroupDashboard";
import { GroupAddExpenseDialog } from "@/components/GroupAddExpenseDialog";
import { db } from "@/lib/dbConfig";
import { eq } from "drizzle-orm";
import { GroupBalances, GroupExpenses, GroupMembers, Groups } from "@/schema";
import { useParams } from "next/navigation";
import { InviteMemberDialog } from "@/components/InviteMemberDialog";
import emailjs from "emailjs-com";
import toast from "react-hot-toast";
import { Group } from "@/interface";

export default function GroupDetailPage() {
  const params = useParams();
  const groupId = params.groupId as string;
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const [group, setGroup] = useState<Group | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const getGroupDetail = async (groupId: number) => {
    const group = await db.query.Groups.findFirst({
      where: eq(Groups.id, groupId),
    });

    if (!group) return null;

    const members = await db
      .select()
      .from(GroupMembers)
      .where(eq(GroupMembers.groupId, groupId));
    const expenses = await db
      .select()
      .from(GroupExpenses)
      .where(eq(GroupExpenses.groupId, groupId));
    const balances = await db
      .select()
      .from(GroupBalances)
      .where(eq(GroupBalances.groupId, groupId));

    return { ...group, members, expenses, balances };
  };

  const fetchGroup = useCallback(async () => {
    const groupData = await getGroupDetail(parseInt(groupId));
    if (groupData) {
      setGroup({
        ...groupData,
        members: groupData.members.map((member) => ({
          ...member,
          id: member.id.toString(),
          groupId: member.groupId.toString(),
        })),
        expenses: groupData.expenses.map((expense) => ({
          ...expense,
          id: Number(expense.id),
          groupId: expense.groupId.toString(),
          amount: Number(expense.amount),
          participants: JSON.parse(expense.participants),
          participantIds: JSON.parse(expense.participantIds),
        })),
        balances: groupData.balances.map((balance) => ({
          ...balance,
          id: Number(balance.id),
          groupId: balance.groupId.toString(),
          amount: Number(balance.amount),
        })),
        totalMembers: groupData.members.length,
        totalExpenses: groupData.expenses.length,
        lastActivity: new Date().toISOString(),
      });
    } else {
      setGroup(null);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroup();
  }, [fetchGroup]);

  // const copyInviteLink = () => {
  //   navigator.clipboard.writeText(group.inviteLink)
  //   // In a real app, you would show a toast notification here
  //   alert("Invite link copied to clipboard!")
  // }

  const inviteMember = (email: string) => {
    const templateParams = {
      email: email,
      invite_link: group?.inviteLink,
    };

    emailjs
      .send(
        "service_vjf8rpt",
        "template_i3lxuzg",
        templateParams,
        "PD3AOfH6fI5rpYuad"
      )
      .then(() => {
        toast.success(`Invitation sent to ${email}`);
      })
      .catch((err) => {
        toast.error("Error sending invitation: " + err.text);
      });
    setIsInviteOpen(false);
  };

  return (
    <div className="container mx-auto p-6">
      <Link
        href="/dashboard/groups"
        className="inline-flex items-center text-purple-500 hover:text-purple-400 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{group?.name}</h1>
          <p className="text-gray-400 mt-1">{group?.members.length} members</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => setIsInviteOpen(true)}
          >
            <Share2 className="mr-2 h-4 w-4" />
            Invite
          </Button>
          <Button
            className="bg-purple-600 text-white hover:bg-purple-700"
            onClick={() => setIsAddExpenseOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="bg-[#1a1d29] border-gray-800 text-white mb-6">
          <TabsTrigger
            value="dashboard"
            className="data-[state=active]:bg-purple-600"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="expenses"
            className="data-[state=active]:bg-purple-600"
          >
            Expenses
          </TabsTrigger>
          <TabsTrigger
            value="balances"
            className="data-[state=active]:bg-purple-600"
          >
            Balances
          </TabsTrigger>
          <TabsTrigger
            value="members"
            className="data-[state=active]:bg-purple-600"
          >
            Members
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          {group && <GroupDashboard group={group} />}
        </TabsContent>

        <TabsContent value="expenses">
          {group && (
            <GroupExpensesList
              members={group.members}
              expenses={group.expenses}
              groupId={groupId}
              onRefreshData={() => fetchGroup()}
            />
          )}
        </TabsContent>

        <TabsContent value="balances">
          {group && <BalancesSummary balances={group.balances} />}
        </TabsContent>

        <TabsContent value="members">
          {group && (
            <MembersList
              members={group.members}
              inviteLink={group.inviteLink}
            />
          )}
        </TabsContent>
      </Tabs>

      {group && (
        <GroupAddExpenseDialog
          open={isAddExpenseOpen}
          onOpenChange={setIsAddExpenseOpen}
          members={group.members}
          groupId={groupId}
        />
      )}
      {group && (
        <InviteMemberDialog
          members={group.members}
          inviteLink={group.inviteLink}
          open={isInviteOpen}
          onOpenChange={setIsInviteOpen}
          onInvite={inviteMember}
        />
      )}
    </div>
  );
}
