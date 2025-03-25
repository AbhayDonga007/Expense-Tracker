import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Mail, UserPlus } from "lucide-react";
import { GroupMember } from "@/interface";

interface MembersListProps {
  members: GroupMember[];
  inviteLink: string;
}

export function MembersList({ members,inviteLink }: MembersListProps) {
  return (
    <div className="space-y-6">
      <Card className="bg-[#1a1d29] border-gray-800 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Group Members</CardTitle>
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Invite New Member
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#21253a] rounded-lg gap-3"
              >
                <div>
                  <div className="flex items-center">
                    <div className="font-medium">{member.name}</div>
                    {member.isAdmin === "true" && (
                      <Badge className="ml-2 bg-purple-600 hover:bg-purple-700">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mt-1">
                    <Mail className="mr-2 h-3 w-3" />
                    {member.email}
                  </div>
                </div>
                {!member.isAdmin && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1d29] border-gray-800 text-white">
        <CardHeader>
          <CardTitle>Invite Link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 bg-[#0f1117] rounded-md text-gray-300 truncate">
              {inviteLink}
            </div>
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-3">
            Share this link with friends to invite them to this group. The link
            expires in 7 days.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
