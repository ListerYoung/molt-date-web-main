import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  completed: { label: "已完成", variant: "default" },
  in_progress: { label: "进行中", variant: "secondary" },
  abandoned: { label: "已放弃", variant: "destructive" },
};

export default function RecordList() {
  const [, setLocation] = useLocation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>();

  const { data, isLoading } = trpc.admin.records.list.useQuery({
    page,
    pageSize: 20,
    status: status === "all" ? undefined : status,
  });

  const { data: stats } = trpc.admin.records.stats.useQuery();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">答题记录</h1>
        <p className="text-sm text-muted-foreground mt-1">查看用户问卷答题情况</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">总会话</p>
              <p className="text-lg font-semibold">{stats.totalSessions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">已完成</p>
              <p className="text-lg font-semibold">{stats.completed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">进行中</p>
              <p className="text-lg font-semibold">{stats.inProgress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">完成率</p>
              <p className="text-lg font-semibold">{stats.completionRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <p className="text-xs text-muted-foreground">放弃率</p>
              <p className="text-lg font-semibold">{stats.abandonRate}%</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-3">
        <Select value={status ?? "all"} onValueChange={(v) => { setStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
            <SelectItem value="in_progress">进行中</SelectItem>
            <SelectItem value="abandoned">已放弃</SelectItem>
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
                  <TableHead>用户ID</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>进度</TableHead>
                  <TableHead>开始时间</TableHead>
                  <TableHead>完成时间</TableHead>
                  <TableHead>最后活动</TableHead>
                  <TableHead className="w-[80px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.sessions && data.sessions.length > 0 ? (
                  data.sessions.map((session) => {
                    const progress = session.totalQuestions > 0
                      ? Math.round((session.answeredCount / session.totalQuestions) * 100)
                      : 0;
                    return (
                      <TableRow key={session.id}>
                        <TableCell className="font-mono text-xs">{session.id}</TableCell>
                        <TableCell className="text-sm">{session.userId}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_MAP[session.status]?.variant ?? "outline"} className="text-xs">
                            {STATUS_MAP[session.status]?.label ?? session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {session.answeredCount}/{session.totalQuestions}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {session.startedAt ? new Date(session.startedAt).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {session.completedAt ? new Date(session.completedAt).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7"
                            onClick={() => setLocation(`/admin/records/${session.id}`)}
                          >
                            详情
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      暂无答题记录
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
              <Button size="sm" variant="outline" className="h-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">第 {page} 页</span>
              <Button size="sm" variant="outline" className="h-8" disabled={!data?.sessions || data.sessions.length < 20} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
