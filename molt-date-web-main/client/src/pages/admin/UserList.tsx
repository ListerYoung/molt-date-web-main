import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "正常", variant: "default" },
  suspended: { label: "暂停", variant: "secondary" },
  banned: { label: "封禁", variant: "destructive" },
};

const VERIFY_LABELS: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  verified: { label: "已认证", variant: "default" },
  pending: { label: "待审核", variant: "secondary" },
  unverified: { label: "未认证", variant: "outline" },
  rejected: { label: "已拒绝", variant: "destructive" },
};

export default function UserList() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [university, setUniversity] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = trpc.admin.users.list.useQuery({
    page,
    pageSize: 20,
    search: search || undefined,
    university: university === "all" ? undefined : university,
    gender: gender === "all" ? undefined : gender,
    status: status === "all" ? undefined : status,
  });

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">用户管理</h1>
        <p className="text-sm text-muted-foreground mt-1">管理平台注册用户</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex gap-2 flex-1 min-w-[200px]">
          <Input
            placeholder="搜索姓名、邮箱..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="h-9"
          />
          <Button size="sm" variant="secondary" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select value={university ?? "all"} onValueChange={(v) => { setUniversity(v); setPage(1); }}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="学校" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部学校</SelectItem>
            <SelectItem value="浙江大学">浙江大学</SelectItem>
            <SelectItem value="清华大学">清华大学</SelectItem>
            <SelectItem value="北京大学">北京大学</SelectItem>
            <SelectItem value="复旦大学">复旦大学</SelectItem>
          </SelectContent>
        </Select>
        <Select value={gender ?? "all"} onValueChange={(v) => { setGender(v); setPage(1); }}>
          <SelectTrigger className="w-[100px] h-9">
            <SelectValue placeholder="性别" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部</SelectItem>
            <SelectItem value="male">男</SelectItem>
            <SelectItem value="female">女</SelectItem>
            <SelectItem value="other">其他</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status ?? "all"} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[120px] h-9">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">正常</SelectItem>
            <SelectItem value="suspended">暂停</SelectItem>
            <SelectItem value="banned">封禁</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">ID</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>性别</TableHead>
                  <TableHead>学校</TableHead>
                  <TableHead>MBTI</TableHead>
                  <TableHead>认证</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>注册时间</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.users && data.users.length > 0 ? (
                  data.users.map((user) => (
                    <TableRow key={user.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation(`/admin/users/${user.id}`)}>
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name || "-"}</TableCell>
                      <TableCell className="text-sm">
                        {user.gender === "male" ? "男" : user.gender === "female" ? "女" : user.gender === "other" ? "其他" : "-"}
                      </TableCell>
                      <TableCell className="text-sm">{user.university || "-"}</TableCell>
                      <TableCell>
                        {user.mbti ? (
                          <Badge variant="outline" className="text-xs font-mono">{user.mbti}</Badge>
                        ) : "-"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={VERIFY_LABELS[user.verificationStatus ?? "unverified"]?.variant ?? "outline"} className="text-xs">
                          {VERIFY_LABELS[user.verificationStatus ?? "unverified"]?.label ?? "未知"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={STATUS_LABELS[user.accountStatus ?? "active"]?.variant ?? "default"} className="text-xs">
                          {STATUS_LABELS[user.accountStatus ?? "active"]?.label ?? "未知"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs h-7"
                          onClick={(e) => { e.stopPropagation(); setLocation(`/admin/users/${user.id}`); }}
                        >
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                      暂无用户数据
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              共 {data?.total ?? 0} 条记录
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">第 {page} 页</span>
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                disabled={!data?.users || data.users.length < 20}
                onClick={() => setPage(p => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
