"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart } from "lucide-react";
import Link from "next/link";
import CreateGroup from "./CreateGroup";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { getGroupsList } from "@/lib/actions/getGroups";
import { Group, GroupBalance, GroupExpense, GroupMember } from "@/interface";
interface GroupApiResponse {
  id: number;
  name: string;
  inviteLink: string;
  createdAt: string;
  createdBy: string;
  totalMembers: number;
  totalExpenses: number;
  lastActivity: string;
  members?: GroupMember[];
  expenses?: GroupExpense[];
  balances?: GroupBalance[];
}
 
export default function Groups() {
  const { user } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);

  const fetchGroups = useCallback(async () => {
    if (user?.primaryEmailAddress?.emailAddress) {
      const data: GroupApiResponse[] = await getGroupsList(
        user.primaryEmailAddress.emailAddress
      );
      const groups: Group[] = data.map((group) => ({
        ...group,
        members: group.members ?? [],
        expenses: group.expenses ?? [],
        balances: group.balances ?? [],
      }));
      setGroups(groups);
    }
  }, [user]);
  

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">My Groups</h1>
          <p className="text-gray-400 mt-1">
            Manage shared expenses with friends and family
          </p>
        </div>
      </div>
      <CreateGroup
        onRefreshData={fetchGroups}
        currentUser={{
          id: user?.id ?? "",
          name: user?.fullName ?? "",
          email: user?.primaryEmailAddress?.emailAddress ?? "",
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Link href={`/dashboard/groups/${group.id}`} key={group.id}>
            <Card className="bg-[#1a1d29] border-gray-800 text-white hover:bg-[#21253a] transition-colors cursor-pointer h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl text-white">
                    {group.name}
                  </CardTitle>
                  <BarChart className="h-5 w-5 text-purple-500" />
                </div>
                <CardDescription className="text-gray-400">
                  {group.totalMembers} members
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Activity:</span>
                    <span className="text-white font-medium">
                      {group.lastActivity ?? "No activity yet"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {/* )} */}
    </div>
  );
}
