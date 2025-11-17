"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/layout/AdminNavbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, UserPlus, Edit, Trash2, Shield, GraduationCap, User } from "lucide-react";

interface UserData {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  studentId?: string;
  gradeLevel?: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    gradeLevel: "7",
  });

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUsers();
  }, [router]);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, filterRole, users]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (filterRole !== "ALL") {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Shield className="h-4 w-4" />;
      case "STUDENT":
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      ADMIN: "destructive",
      STUDENT: "secondary",
    };
    return variants[role] || "outline";
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADMIN: "ผู้ดูแลระบบ",
      STUDENT: "นักเรียน",
    };
    return labels[role] || role;
  };

  const handleCreateUser = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          gradeLevel: formData.role === "STUDENT" ? parseInt(formData.gradeLevel) : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("สร้างผู้ใช้สำเร็จ!");
        setShowCreateDialog(false);
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "STUDENT",
          gradeLevel: "7",
        });
        fetchUsers();
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการสร้างผู้ใช้");
      }
    } catch (error) {
      console.error("Create user error:", error);
      alert("เกิดข้อผิดพลาดในการสร้างผู้ใช้");
    }
  };

  const handleEditUser = async () => {
    if (!editingUser) return;

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          gradeLevel: formData.role === "STUDENT" ? parseInt(formData.gradeLevel) : undefined,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("แก้ไขผู้ใช้สำเร็จ!");
        setShowEditDialog(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(data.error || "เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
      }
    } catch (error) {
      console.error("Edit user error:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขผู้ใช้");
    }
  };

  const openEditDialog = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      gradeLevel: user.gradeLevel?.toString() || "7",
    });
    setShowEditDialog(true);
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบผู้ใช้ "${userName}"?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`)) {
      return;
    }

    try {
      const token = localStorage.getItem("auth-token");
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        alert("ลบผู้ใช้สำเร็จ!");
        fetchUsers(); // Refresh the list
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.error}`);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AdminNavbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-muted-foreground">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">จัดการผู้ใช้</h1>
            <p className="text-muted-foreground text-lg">จัดการบัญชีผู้ใช้ในระบบ</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            เพิ่มผู้ใช้ใหม่
          </Button>
        </div>
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ทั้งหมด</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">นักเรียน</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === "STUDENT").length}
                  </p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ผู้ดูแล</p>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === "ADMIN").length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาชื่อหรืออีเมล..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterRole === "ALL" ? "default" : "outline"}
                  onClick={() => setFilterRole("ALL")}
                  size="sm"
                >
                  ทั้งหมด
                </Button>
                <Button
                  variant={filterRole === "STUDENT" ? "default" : "outline"}
                  onClick={() => setFilterRole("STUDENT")}
                  size="sm"
                >
                  นักเรียน
                </Button>
                <Button
                  variant={filterRole === "ADMIN" ? "default" : "outline"}
                  onClick={() => setFilterRole("ADMIN")}
                  size="sm"
                >
                  ผู้ดูแล
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>รายชื่อผู้ใช้งาน ({filteredUsers.length})</CardTitle>
            <CardDescription>จัดการและดูรายละเอียดผู้ใช้</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">ไม่พบผู้ใช้งาน</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {getRoleIcon(user.role)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={getRoleBadge(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                          {user.gradeLevel && (
                            <Badge variant="outline">ม.{user.gradeLevel - 6}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          สมัครเมื่อ: {new Date(user.createdAt).toLocaleDateString('th-TH')}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => openEditDialog(user)}
                        title="แก้ไข"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        title="ลบ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
            <DialogDescription>
              สร้างบัญชีผู้ใช้ใหม่ในระบบ
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">รหัสผ่าน</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">บทบาท</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">นักเรียน</SelectItem>
                  <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === "STUDENT" && (
              <div className="grid gap-2">
                <Label htmlFor="gradeLevel">ระดับชั้น</Label>
                <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">ม.๑ (7th Grade)</SelectItem>
                    <SelectItem value="8">ม.๒ (8th Grade)</SelectItem>
                    <SelectItem value="9">ม.๓ (9th Grade)</SelectItem>
                    <SelectItem value="10">ม.๔ (10th Grade)</SelectItem>
                    <SelectItem value="11">ม.๕ (11th Grade)</SelectItem>
                    <SelectItem value="12">ม.๖ (12th Grade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleCreateUser}>
              สร้างผู้ใช้
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
            <DialogDescription>
              แก้ไขข้อมูลของ {editingUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">ชื่อ-นามสกุล</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="กรอกชื่อ-นามสกุล"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-email">อีเมล</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="example@email.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-role">บทบาท</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="STUDENT">นักเรียน</SelectItem>
                  <SelectItem value="ADMIN">ผู้ดูแลระบบ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.role === "STUDENT" && (
              <div className="grid gap-2">
                <Label htmlFor="edit-gradeLevel">ระดับชั้น</Label>
                <Select value={formData.gradeLevel} onValueChange={(value) => setFormData({ ...formData, gradeLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">ม.๑ (7th Grade)</SelectItem>
                    <SelectItem value="8">ม.๒ (8th Grade)</SelectItem>
                    <SelectItem value="9">ม.๓ (9th Grade)</SelectItem>
                    <SelectItem value="10">ม.๔ (10th Grade)</SelectItem>
                    <SelectItem value="11">ม.๕ (11th Grade)</SelectItem>
                    <SelectItem value="12">ม.๖ (12th Grade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              ยกเลิก
            </Button>
            <Button onClick={handleEditUser}>
              บันทึกการแก้ไข
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
