"use client";

import { LoaderCircle, Mail, Plus, RefreshCw, Trash2, UserCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/app/auth-context";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { PageTitle } from "@/app/components/ui/pageTitle";

interface AdminUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  orgId: string;
  invitedByName: string;
  status: "pending" | "accepted";
  token: string;
  createdAt: string;
  expiresAt: string;
}

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = useCallback(async () => {
    if (!user?.orgId) return;
    setLoading(true);
    try {
      // Fetch admins
      const membersRes = await fetch(
        `/api/content?collection=members&orgId=${user.orgId}`,
      );
      const members = await membersRes.json();
      setAdmins(
        (Array.isArray(members) ? members : []).filter(
          (m: AdminUser) => m.role === "admin",
        ),
      );

      // Fetch invitations
      const inviteRes = await fetch(
        `/api/invitations?orgId=${user.orgId}&uid=${user.uid}`,
      );
      const invites = await inviteRes.json();
      setInvitations(Array.isArray(invites) ? invites : []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [user?.orgId, user?.uid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !user) return;

    setError("");
    setSuccess("");
    setInviting(true);

    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          orgId: user.orgId,
          invitedByUid: user.uid,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send invitation");
        return;
      }

      setSuccess(`Invitation sent to ${inviteEmail.trim()}`);
      setInviteEmail("");
      fetchData();
    } catch {
      setError("Failed to send invitation");
    } finally {
      setInviting(false);
    }
  };

  const handleCancelInvitation = async (invitation: Invitation) => {
    try {
      const res = await fetch(
        `/api/invitations?token=${invitation.token}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        fetchData();
      }
    } catch {
      // silent
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle size={48} className="animate-spin text-green-600" />
          <p className="text-sm text-gray-500">Loading admin users...</p>
        </div>
      </div>
    );
  }

  const pendingInvitations = invitations.filter((i) => i.status === "pending");

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageTitle
          title="Admin Users"
          description="Manage administrators and send invitations"
        />
        <Button onClick={fetchData} variant="outline" size="sm">
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {/* Invite Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Invite New Admin</CardTitle>
          <CardDescription>
            Send an invitation email to grant admin access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
            <Button type="submit" disabled={inviting || !inviteEmail.trim()}>
              {inviting ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Plus size={14} />
                  Invite
                </>
              )}
            </Button>
          </form>

          {error && (
            <p className="mt-3 rounded-xs border border-red-200 bg-red-100 px-3 py-2 text-sm font-medium text-red-600">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-3 rounded-xs border border-green-200 bg-green-100 px-3 py-2 text-sm font-medium text-green-700">
              {success}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Admins */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Admins ({admins.length})</CardTitle>
          <CardDescription>
            Users with admin-level access to this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          {admins.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">No admin users found.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <UserCheck size={16} className="text-green-600" />
                          {admin.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {admin.joinedAt
                          ? new Date(admin.joinedAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="success">Admin</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>
            Pending Invitations ({pendingInvitations.length})
          </CardTitle>
          <CardDescription>
            Invitations that have been sent but not yet accepted
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingInvitations.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">
              No pending invitations. Invite an admin above.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Invited By
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Sent
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingInvitations.map((invite) => (
                    <tr
                      key={invite.id}
                      className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <Mail size={14} className="text-yellow-600" />
                          {invite.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {invite.invitedByName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {invite.createdAt
                          ? new Date(invite.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="warning">Pending</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvitation(invite)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={14} />
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
