import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Pencil, MoreHorizontal, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { toast } from "sonner";

import { adminService, User } from "@/lib/api/services/admin.service";


export default function NewUsersPage({ users: initialUsers }: { users: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers || []);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    is_active: true,
    is_staff: false,
    is_superuser: false,
  });

  useEffect(() => {
    setUsers(initialUsers || []);
  }, [initialUsers]);

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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-slate-100">
        <h3 className="text-xl font-semibold text-slate-800">New user</h3>
        <Link href="/dashboard/users" className="text-sm font-medium text-blue-600 hover:text-blue-700">
          View all
        </Link>
      </div>
      <div className="divide-y divide-slate-100">
        {users?.slice(0, 5).map((user) => (
          <div key={user.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
            <div className="flex items-center space-x-4 w-1/3">
              <Link href={`/dashboard/users/${user.id}`}>
                <Avatar className="w-10 h-10 border border-slate-200 hover:opacity-80 transition-opacity">
                  <AvatarImage src={`https://i.pravatar.cc/150?u=${user.id}`} alt={user.username} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <p className="text-sm font-medium text-slate-900">{user.username || "User"}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="w-1/4 flex justify-center">
              <Badge 
                variant="secondary" 
                className={`${user.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'} border-none px-3 font-normal rounded-full`}
              >
                {user.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="w-1/4 flex justify-end text-sm text-slate-500">
              {new Date(user.date_joined).toLocaleDateString()}
            </div>
            <div className="w-12 flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors focus:outline-none">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
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
            </div>
          </div>
        ))}
        {(!users || users.length === 0) && (
          <div className="p-10 text-center text-slate-400">No new users found</div>
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
}
