import { trpc } from "@/lib/trpc";
import { useRoute, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function UserDetail() {
  const [, params] = useRoute("/admin/users/:id");
  const [, setLocation] = useLocation();
  const userId = Number(params?.id);

  const { data, isLoading, refetch } = trpc.admin.users.getById.useQuery(
    { id: userId },
    { enabled: !!userId }
  );

  const updateMutation = trpc.admin.users.update.useMutation({
    onSuccess: () => { toast.success("用户信息已更新"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const statusMutation = trpc.admin.users.updateStatus.useMutation({
    onSuccess: () => { toast.success("状态已更新"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const verifyMutation = trpc.admin.users.updateVerification.useMutation({
    onSuccess: () => { toast.success("认证状态已更新"); refetch(); },
    onError: (e) => toast.error(e.message),
  });

  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name ?? "",
        gender: data.gender ?? "",
        university: data.university ?? "",
        grade: data.grade ?? "",
        major: data.major ?? "",
        mbti: data.mbti ?? "",
        bio: data.bio ?? "",
        birthDate: data.birthDate ?? "",
        birthPlace: data.birthPlace ?? "",
        wechatId: data.wechatId ?? "",
        role: data.role ?? "user",
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-muted-foreground">用户不存在</div>
    );
  }

  const handleSave = () => {
    updateMutation.mutate({
      id: userId,
      name: form.name || undefined,
      gender: form.gender || undefined,
      university: form.university || undefined,
      grade: form.grade || undefined,
      major: form.major || undefined,
      mbti: form.mbti || undefined,
      bio: form.bio || undefined,
      birthDate: form.birthDate || undefined,
      birthPlace: form.birthPlace || undefined,
      wechatId: form.wechatId || undefined,
      role: form.role || undefined,
    });
  };

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setLocation("/admin/users")}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </Button>
        <h1 className="text-xl font-semibold text-foreground">用户详情</h1>
        <span className="text-sm text-muted-foreground">#{userId}</span>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs">姓名</Label>
              <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">性别</Label>
              <Select value={form.gender ?? ""} onValueChange={(v) => setForm({ ...form, gender: v })}>
                <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="选择性别" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">学校</Label>
              <Input value={form.university ?? ""} onChange={(e) => setForm({ ...form, university: e.target.value })} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">年级</Label>
              <Input value={form.grade ?? ""} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">专业</Label>
              <Input value={form.major ?? ""} onChange={(e) => setForm({ ...form, major: e.target.value })} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">MBTI</Label>
              <Input value={form.mbti ?? ""} onChange={(e) => setForm({ ...form, mbti: e.target.value })} className="h-9 mt-1" placeholder="如 INFJ" />
            </div>
            <div>
              <Label className="text-xs">出生日期</Label>
              <Input value={form.birthDate ?? ""} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} className="h-9 mt-1" placeholder="1999-03-15" />
            </div>
            <div>
              <Label className="text-xs">籍贯</Label>
              <Input value={form.birthPlace ?? ""} onChange={(e) => setForm({ ...form, birthPlace: e.target.value })} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">微信号</Label>
              <Input value={form.wechatId ?? ""} onChange={(e) => setForm({ ...form, wechatId: e.target.value })} className="h-9 mt-1" />
            </div>
            <div>
              <Label className="text-xs">角色</Label>
              <Select value={form.role ?? "user"} onValueChange={(v) => setForm({ ...form, role: v })}>
                <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">普通用户</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">个人简介</Label>
              <Input value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="h-9 mt-1" />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              保存修改
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">认证状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">当前状态：</span>
              <Badge variant={data.verificationStatus === "verified" ? "default" : "outline"}>
                {data.verificationStatus === "verified" ? "已认证" : data.verificationStatus === "pending" ? "待审核" : "未认证"}
              </Badge>
            </div>
            {data.campusEmail && (
              <p className="text-xs text-muted-foreground">校园邮箱：{data.campusEmail}</p>
            )}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="text-xs h-7"
                disabled={data.verificationStatus === "verified"}
                onClick={() => verifyMutation.mutate({ id: userId, verificationStatus: "verified" })}>
                通过认证
              </Button>
              <Button size="sm" variant="outline" className="text-xs h-7 text-destructive"
                disabled={data.verificationStatus === "rejected"}
                onClick={() => verifyMutation.mutate({ id: userId, verificationStatus: "rejected" })}>
                拒绝认证
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">账号状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">当前状态：</span>
              <Badge variant={data.accountStatus === "active" ? "default" : "destructive"}>
                {data.accountStatus === "active" ? "正常" : data.accountStatus === "suspended" ? "暂停" : "封禁"}
              </Badge>
            </div>
            <div className="flex gap-2">
              {data.accountStatus !== "active" && (
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => statusMutation.mutate({ id: userId, accountStatus: "active" })}>
                  恢复正常
                </Button>
              )}
              {data.accountStatus !== "suspended" && (
                <Button size="sm" variant="outline" className="text-xs h-7"
                  onClick={() => statusMutation.mutate({ id: userId, accountStatus: "suspended" })}>
                  暂停账号
                </Button>
              )}
              {data.accountStatus !== "banned" && (
                <Button size="sm" variant="outline" className="text-xs h-7 text-destructive"
                  onClick={() => statusMutation.mutate({ id: userId, accountStatus: "banned" })}>
                  封禁账号
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Data */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">关联数据</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground text-xs">问卷状态</p>
              <p className="font-medium mt-1">{data.questionnaireStatus === "completed" ? "已完成" : data.questionnaireStatus === "not_started" ? "未开始" : data.questionnaireStatus}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground text-xs">画像维度</p>
              <p className="font-medium mt-1">{data.profileScores?.length ?? 0} 个维度已计算</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-muted-foreground text-xs">邮箱</p>
              <p className="font-medium mt-1 truncate">{data.email || "-"}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
