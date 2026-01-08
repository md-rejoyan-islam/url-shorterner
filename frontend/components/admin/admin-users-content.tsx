"use client";

import {
  ConfirmDialog,
  DataCard,
  EmptyState,
  PageHeader,
  SimpleTable,
  StatsCard,
  StatusBadge,
} from "@/components/shared";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate, formatNumber } from "@/lib/format";
import {
  useAdminDeleteUserMutation,
  useAdminGetUsersQuery,
  useAdminUpdateUserMutation,
} from "@/store/api/user-api";
import { getErrorMessage } from "@/types/api";
import { IUser } from "@/types/user";
import {
  Ban,
  Download,
  ExternalLink,
  Filter,
  Link2,
  MoreVertical,
  Search,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function AdminUsersContent() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  const { data, isLoading, isFetching } = useAdminGetUsersQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });
  const [deleteUser, { isLoading: isDeleting }] = useAdminDeleteUserMutation();
  const [updateUser] = useAdminUpdateUserMutation();

  const users = data?.data?.users || [];
  const total = data?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId).unwrap();
      toast.success("User Deleted", {
        description: "The user and all their data have been removed.",
      });
      setDeleteUserId(null);
    } catch (error: unknown) {
      toast.error("Delete Failed", {
        description: getErrorMessage(error, "Unable to delete user"),
      });
    }
  };

  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await updateUser({ id: userId, data: { isActive: !isActive } }).unwrap();
      toast.success(isActive ? "User Deactivated" : "User Activated", {
        description: `The user has been ${
          isActive ? "deactivated" : "activated"
        } successfully.`,
      });
    } catch (error: unknown) {
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Unable to update user status"),
      });
    }
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUser({ id: userId, data: { role: newRole } }).unwrap();
      toast.success("Role Updated", {
        description: `User role changed to ${newRole}.`,
      });
    } catch (error: unknown) {
      toast.error("Update Failed", {
        description: getErrorMessage(error, "Unable to update user role"),
      });
    }
  };

  // Calculate stats
  const activeUsers = users.filter((u: IUser) => u.isActive).length;
  const adminUsers = users.filter((u: IUser) => u.role === "admin").length;

  // Table columns
  const columns = [
    <span key="num" className="w-12">
      #
    </span>,
    "User",
    "Role",
    <span key="status" className="hidden md:table-cell">
      Status
    </span>,
    <span key="links" className="hidden lg:table-cell">
      Links
    </span>,
    <span key="joined" className="hidden lg:table-cell">
      Joined
    </span>,
    <span key="actions" className="w-12"></span>,
  ];

  // Table rows
  const rows = users.map((user: IUser, index: number) => [
    // Index
    <span key="index" className="font-medium text-muted-foreground">
      {(page - 1) * limit + index + 1}
    </span>,
    // User
    <div key="user" className="flex items-center gap-3">
      <Avatar className="h-9 w-9 border-2 border-brand/10">
        <AvatarImage src={user.avatar || undefined} />
        <AvatarFallback className="bg-brand text-white text-sm">
          {user.firstName?.charAt(0)}
          {user.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div>
        <Link
          href={`/admin/users/${user.id}`}
          className="font-medium text-brand hover:underline transition-colors"
        >
          {user.firstName} {user.lastName}
        </Link>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </div>,
    // Role
    <StatusBadge
      key="role"
      status={user.role === "admin" ? "admin" : "user"}
    />,
    // Status
    <span key="status" className="hidden md:block">
      <StatusBadge status={user.isActive ? "active" : "inactive"} />
    </span>,
    // Links
    <span key="links" className="hidden lg:block font-medium text-brand">
      {user.urlCount || 0}
    </span>,
    // Joined
    <span key="joined" className="hidden lg:block text-muted-foreground">
      {formatDate(user.createdAt)}
    </span>,
    // Actions
    <DropdownMenu key="actions">
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/admin/users/${user.id}`}>
            <ExternalLink className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleToggleRole(user.id, user.role)}>
          <Shield className="mr-2 h-4 w-4" />
          {user.role === "admin" ? "Remove Admin" : "Make Admin"}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleToggleStatus(user.id, user.isActive)}
        >
          {user.isActive ? (
            <>
              <Ban className="mr-2 h-4 w-4" />
              Deactivate
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Activate
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => setDeleteUserId(user.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>,
  ]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        variant="gradient"
        title="Users Management"
        badge={{ icon: Users, text: "Admin Panel" }}
        description="Manage all registered users on the platform"
        actions={
          <Button
            size="lg"
            className="bg-white text-brand hover:bg-white/90 shadow-lg"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={formatNumber(total)}
          icon={Users}
          color="brand"
          isLoading={isLoading}
        />
        <StatsCard
          title="Active Users"
          value={formatNumber(activeUsers)}
          icon={UserCheck}
          color="emerald"
          isLoading={isLoading}
        />
        <StatsCard
          title="Admin Users"
          value={formatNumber(adminUsers)}
          icon={Shield}
          color="violet"
          isLoading={isLoading}
        />
        <StatsCard
          title="Total Links"
          value={formatNumber(
            users.reduce((acc: number, u: IUser) => acc + (u.urlCount || 0), 0)
          )}
          icon={Link2}
          color="blue"
          isLoading={isLoading}
        />
      </div>

      {/* Users Table */}
      <DataCard
        title="All Users"
        description="View and manage all registered users"
        icon={Users}
        color="brand"
        isLoading={false}
        isEmpty={!isLoading && users.length === 0}
        emptyState={{
          icon: Users,
          message: search
            ? "No users found matching your search"
            : "No users registered yet",
        }}
      >
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between p-4 border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 border-brand/20 focus-visible:ring-brand/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-brand/20 hover:border-brand/40"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-brand/20 hover:border-brand/40"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {!isLoading && users.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={Users}
              title={search ? "No users found" : "No users yet"}
              description={
                search
                  ? "Try adjusting your search"
                  : "Users will appear here once they register"
              }
            />
          </div>
        ) : (
          <SimpleTable
            columns={columns}
            rows={rows}
            isLoading={isLoading}
            notFoundMessage="No users found"
            pagination={{
              page,
              totalPages,
              total,
              limit,
              onPageChange: setPage,
              onLimitChange: setLimit,
              isFetching,
            }}
          />
        )}
      </DataCard>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteUserId}
        onOpenChange={(open) => !open && setDeleteUserId(null)}
        title="Delete User"
        description="Are you sure you want to delete this user? This will also delete all their links and data. This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
