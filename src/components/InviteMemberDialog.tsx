"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from "lucide-react"
import { GroupMember } from "@/interface"

interface InviteMemberDialogProps {
  open: boolean
  inviteLink: string;
  members: GroupMember[];
  onOpenChange: (open: boolean) => void
  onInvite: (email: string) => void
}

export function InviteMemberDialog({ open, members, inviteLink, onOpenChange, onInvite }: InviteMemberDialogProps) {

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink)
    alert("Invite link copied to clipboard!")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-slate-900 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription className="text-slate-400">
            Send invitations to your group members.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="email">Members</TabsTrigger>
            <TabsTrigger value="link">Invite Link</TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4">
            <div className="grid gap-4">
              <Label>Group Members</Label>
              {members?.map((member) => (
                <div key={member.id} className="flex items-center justify-between bg-slate-800 px-3 py-2 rounded-md border border-slate-700">
                  <span>{member.email}</span>
                  <Button
                    size="sm"
                    className="bg-purple-600 text-white hover:bg-purple-700"
                    onClick={() => onInvite(member.email)}
                  >
                    Send Invitation
                  </Button>
                </div>
              ))}
              {members?.filter(member => member.isAdmin !== "true").length === 0 && (
                <p className="text-slate-400 text-sm">No members found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="link" className="mt-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Share this link</Label>
                <div className="flex gap-2">
                  <Input value={inviteLink} readOnly className="bg-slate-800 border-slate-700" />
                  <Button variant="outline" size="icon" onClick={copyInviteLink} className="border-slate-700">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-slate-400">Anyone with this link can join this group.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
