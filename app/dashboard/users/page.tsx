"use client";

import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Pencil, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminService, User } from "@/lib/api/services/admin.service";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
  });

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      is_active: user.is_active ?? true,
      is_staff: user.is_staff ?? false,
      is_superuser: user.is_superuser ?? false,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      const updatedUser = await adminService.updateUser(selectedUser.id, formData);
      setUsers(users.map((u) => (u.id === selectedUser.id ? updatedUser : u)));
      toast.success("User updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    setIsSubmitting(true);
    try {
      await adminService.deleteUser(selectedUser.id);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      toast.success("User deleted successfully");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete user");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data.users || []);
        setTotalUsers(data.total_user || 0);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-[1200px] mx-auto pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-800">Users</h1>
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-10 bg-white border-slate-200 rounded-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-20 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-none">
                  <TableHead className="w-12 px-6">
                    <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700">User</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">Status</TableHead>
                  <TableHead className="font-semibold text-slate-700">Join date</TableHead>
                  <TableHead className="font-semibold text-slate-700">Last log in</TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right pr-6">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors border-slate-100 group">
                    <TableCell className="px-6">
                      <Checkbox className="border-slate-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/users/${user.id}`} className="flex items-center space-x-3 cursor-pointer">
                        <Avatar className="h-10 w-10 border border-slate-100">
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} />
                          <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                            {user.username || "Anonymous"}
                          </div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="secondary" 
                        className={`${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-none font-normal px-3 py-0.5 rounded-full`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-600 font-normal">
                      {new Date(user.date_joined).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-slate-600 font-normal">
                      {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem 
                            className="flex items-center cursor-pointer"
                            onClick={() => handleEditClick(user)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Update
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => handleDeleteClick(user)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
              <div className="text-sm text-slate-500">
                Showing <span className="font-medium text-slate-900">1 to {filteredUsers.length}</span> of <span className="font-medium text-slate-900">{totalUsers}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-4 rounded-lg">
                  Previous
                </Button>
                <Button variant="outline" size="sm" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 px-4 rounded-lg">
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>
              Make changes to the user's profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="first_name" className="text-right">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="flex flex-col space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_active" 
                  checked={formData.is_active} 
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: !!checked })}
                />
                <Label htmlFor="is_active" className="cursor-pointer">Active User</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_staff" 
                  checked={formData.is_staff} 
                  onCheckedChange={(checked) => setFormData({ ...formData, is_staff: !!checked })}
                />
                <Label htmlFor="is_staff" className="cursor-pointer">Staff Access</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_superuser" 
                  checked={formData.is_superuser} 
                  onCheckedChange={(checked) => setFormData({ ...formData, is_superuser: !!checked })}
                />
                <Label htmlFor="is_superuser" className="cursor-pointer">Superuser Access</Label>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user <strong>{selectedUser?.username}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;


