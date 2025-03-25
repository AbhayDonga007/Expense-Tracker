"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle, Users, X } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import moment from "moment";
import { db } from "@/lib/dbConfig";
import { GroupMembers, Groups } from "@/schema";
import { Card, CardContent } from "./ui/card";

interface CreateGroupProps {
  className?: string;
  onRefreshData: () => void;
  currentUser: { id: string; name: string; email: string }; 
}

const CreateGroup = ({
  onRefreshData,
  currentUser,
}: CreateGroupProps) => {
  const [open, setOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [members, setMembers] = useState<
    { id: string; name: string; email: string; isAdmin: boolean }[]
  >([]);

  useEffect(() => {
    if (open) {
      setMembers([
        {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
          isAdmin: true,
        },
      ]);
    }
  }, [open, currentUser]);

  const addMember = () => {
    if (
      memberName.trim() &&
      memberEmail.trim() &&
      !members.some(
        (m) =>
          m.name.toLowerCase() === memberName.trim().toLowerCase() ||
          m.email.toLowerCase() === memberEmail.trim().toLowerCase()
      )
    ) {
      setMembers([
        ...members,
        {
          id: uuidv4(),
          name: memberName.trim(),
          email: memberEmail.trim(),
          isAdmin: false,
        },
      ]);
      setMemberName("");
      setMemberEmail("");
    }
  };

  const removeMember = (id: string) => {
    if (id !== currentUser.id) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleSubmit = async () => {
    if (!groupName.trim() || members.length === 0) {
      toast.error("Please enter a group name and add members.");
      return;
    }

    try {
      const createdAt = moment().format("YYYY-MM-DD");

      // Insert group into DB
      const result = await db
        .insert(Groups)
        .values({
          name: groupName.trim(),
          createdAt,
          createdBy: currentUser.email,
          inviteLink: `https://financefusion.app/invite/${uuidv4()}`,
        })
        .returning({ insertedId: Groups.id });

      if (result.length === 0) {
        toast.error("Failed to create group.");
        return;
      }

      const groupId = result[0].insertedId;

      await db.insert(GroupMembers).values(
        members.map((member) => ({
          groupId,
          name: member.name,
          email: member.email,
          isAdmin: member.isAdmin ? "true" : "false",
        }))
      );

      toast.success("Group created and saved successfully!");
      onRefreshData();
      setGroupName("");
      setMembers([]);
      setOpen(false);
    } catch (err) {
      console.error("Error saving group:", err);
      toast.error("Something went wrong while saving to the database.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="bg-[#1a1d29] border-gray-800 text-white mb-3">
          <CardContent className="flex flex-col items-center justify-center p-10">
            <Users className="h-16 w-16 text-purple-500 mb-4" />
            <p className="text-gray-400 text-center mb-6">
              Create a group to start tracking shared expenses with others
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Group
            </Button>
          </CardContent>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-950">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="groupName">Group Name</Label>
          <Input
            id="groupName"
            placeholder="e.g. Trip to Paris, Roommates"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="dark:bg-gray-900"
            required
          />
        </div>
        <div className="mt-4">
          <Label>Add Member (name & email)</Label>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder="e.g. Abhay Donga"
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="dark:bg-gray-900"
            />
            <Input
              placeholder="e.g. abhay@gmail.com"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              className="dark:bg-gray-900"
            />
          </div>
          <Button className="w-full mt-2" onClick={addMember}>
            Add Member
          </Button>
        </div>
        {members.length > 0 && (
          <div className="mt-4">
            <Label>Members Added:</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-full"
                >
                  <div className="text-sm font-medium">
                    {member.name}{" "}
                    <span className="text-xs text-gray-600">
                      ({member.email})
                    </span>
                    {member.isAdmin && (
                      <span className="text-xs text-green-500 ml-1">
                        (Admin)
                      </span>
                    )}
                  </div>
                  {member.id !== currentUser.id && (
                    <X
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => removeMember(member.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!groupName || members.length < 1}
          onClick={handleSubmit}
        >
          Create Group
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
