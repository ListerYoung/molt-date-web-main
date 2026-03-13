import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Play, Send, X, ChevronLeft, ChevronRight, Eye, RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";

const STATUS_MAP: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "待推送", variant: "outline" },
  pushed: { label: "已推送", variant: "default" },
  a_viewed: { label: "A已查看", variant: "secondary" },
  b_viewed: { label: "B已查看", variant: "secondary" },
  both_viewed: { label: "双方已看", variant: "default" },
  contacted: { label: "已联系", variant: "default" },
  expired: { label: "已过期", variant: "destructive" },
};

export default function MatchingManage() {
  const [page, setPage] = useState(1);
  const [weekFilter, setWeekFilter] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [detailId, setDetailId] = useState<number | null>(null);

  // Stats
  const { data: stats } = trpc.admin.matching.stats.useQuery({
    week: weekFilter === "all" ? undefined : weekFilter,
  });

  // Pool stats
  const { data: poolStats } = trpc.admin.matching.poolStats.useQuery();

  // Match list
  const { data: matchData, isLoading, refetch } = trpc.admin.matching.list.useQuery({
    page,
    pageSize: 20,
    week: weekFilter === "all" ? undefined : weekFilter,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  // Run match
  const runMatchMutation = trpc.admin.matching.runMatch.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success(`匹配完成：${result.matchedPairs} 对（${result.matchWeek}）`);
        refetch();
      } else {
        toast.error(result.error ?? "匹配失败");
      }
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Push all
  const pushAllMutation = trpc.admin.matching.pushAll.useMutation({
    onSuccess: (result) => {
      toast.success(`已推送 ${result.count} 对匹配`);
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Cancel match
  const cancelMutation = trpc.admin.matching.cancel.useMutation({
    onSuccess: () => {
      toast.success("匹配已取消");
      refetch();
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Get current week
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  const currentWeek = `${now.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">推送管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理每周匹配与推送</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={runMatchMutation.isPending}
            onClick={() => runMatchMutation.mutate()}
          >
            {runMatchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Zap className="h-4 w-4 mr-1" />}
            执行本周匹配
          </Button>
          <Button
            size="sm"
            disabled={pushAllMutation.isPending || !weekFilter}
            onClick={() => weekFilter && pushAllMutation.mutate({ week: weekFilter === "all" ? currentWeek : weekFilter })}
          >
            {pushAllMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
            推送全部
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">匹配池</p>
            <p className="text-lg font-semibold">{poolStats?.eligible ?? 0} 人</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">总匹配</p>
            <p className="text-lg font-semibold">{stats?.total ?? 0} 对</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">已推送</p>
            <p className="text-lg font-semibold">{stats?.pushed ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">平均分</p>
            <p className="text-lg font-semibold">{stats?.avgScore ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">查看率</p>
            <p className="text-lg font-semibold">{stats?.viewRate ?? 0}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Input
          placeholder="周次 (如 2026-W10)"
          value={weekFilter ?? ""}
          onChange={(e) => { setWeekFilter(e.target.value || undefined); setPage(1); }}
          className="w-[180px] h-9"
        />
        <Select value={statusFilter ?? "all"} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
          <SelectTrigger className="w-[140px] h-9">
            <SelectValue placeholder="状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            {Object.entries(STATUS_MAP).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
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
                  <TableHead>用户A</TableHead>
                  <TableHead>用户B</TableHead>
                  <TableHead className="w-[80px]">兼容分</TableHead>
                  <TableHead>周次</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>推送时间</TableHead>
                  <TableHead className="w-[120px]">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matchData?.matches && matchData.matches.length > 0 ? (
                  matchData.matches.map((match: any) => (
                    <TableRow key={match.id}>
                      <TableCell className="font-mono text-xs">{match.id}</TableCell>
                      <TableCell className="text-sm">{match.userAId}</TableCell>
                      <TableCell className="text-sm">{match.userBId}</TableCell>
                      <TableCell className="font-mono text-sm font-medium">
                        {match.compatibilityScore?.toFixed(1) ?? "-"}
                      </TableCell>
                      <TableCell className="text-xs">{match.matchWeek}</TableCell>
                      <TableCell>
                        <Badge
                          variant={STATUS_MAP[match.status]?.variant ?? "outline"}
                          className="text-xs"
                        >
                          {STATUS_MAP[match.status]?.label ?? match.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {match.pushedAt ? new Date(match.pushedAt).toLocaleString() : "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7"
                            onClick={() => setDetailId(match.id)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {match.status === "pending" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7 text-destructive"
                              onClick={() => cancelMutation.mutate({ id: match.id })}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      暂无匹配记录
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              共 {matchData?.total ?? 0} 条
            </p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="h-8" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">第 {page} 页</span>
              <Button size="sm" variant="outline" className="h-8" disabled={!matchData?.matches || matchData.matches.length < 20} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Detail Dialog */}
      <MatchDetailDialog id={detailId} onClose={() => setDetailId(null)} />
    </div>
  );
}

function MatchDetailDialog({ id, onClose }: { id: number | null; onClose: () => void }) {
  const { data: rawData, isLoading } = trpc.admin.matching.getById.useQuery(
    { id: id! },
    { enabled: !!id }
  );
  // Cast to any to avoid unknown type issues from spread match record
  const data = rawData as any;

  const regenerateMutation = trpc.admin.matching.regenerateSummary.useMutation({
    onSuccess: (result) => {
      if (result.success) toast.success("摘要已重新生成");
      else toast.error(result.error ?? "生成失败");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <Dialog open={!!id} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>匹配详情 #{id}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            {/* Users */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">用户 A</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-medium">{String(data.userA?.name ?? "-")}</p>
                  <p className="text-xs text-muted-foreground">{String(data.userA?.university ?? "-")} · {String(data.userA?.major ?? "-")}</p>
                  <p className="text-xs text-muted-foreground">{data.userA?.gender === "male" ? "男" : data.userA?.gender === "female" ? "女" : "-"}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs text-muted-foreground">用户 B</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="font-medium">{String(data.userB?.name ?? "-")}</p>
                  <p className="text-xs text-muted-foreground">{String(data.userB?.university ?? "-")} · {String(data.userB?.major ?? "-")}</p>
                  <p className="text-xs text-muted-foreground">{data.userB?.gender === "male" ? "男" : data.userB?.gender === "female" ? "女" : "-"}</p>
                </CardContent>
              </Card>
            </div>

            {/* Score */}
            <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">兼容性分数</p>
                <p className="text-2xl font-bold">{typeof data.compatibilityScore === 'number' ? data.compatibilityScore.toFixed(1) : '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">匹配类型</p>
                <p className="text-sm">{String(data.matchType ?? '-')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">周次</p>
                <p className="text-sm">{String(data.matchWeek ?? '-')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">状态</p>
                <Badge variant={STATUS_MAP[String(data.status)]?.variant ?? "outline"} className="text-xs">
                  {STATUS_MAP[String(data.status)]?.label ?? String(data.status)}
                </Badge>
              </div>
            </div>

            {/* AI Summary */}
            {data.aiSummary && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground font-medium">AI 匹配摘要</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-7"
                    disabled={regenerateMutation.isPending}
                    onClick={() => id && regenerateMutation.mutate({ id })}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    重新生成
                  </Button>
                </div>
                <p className="text-sm">{String(data.aiSummary)}</p>
              </div>
            )}

            {/* Common Traits */}
            {data.commonTraits && (data.commonTraits as string[]).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">共同特征</p>
                <div className="flex gap-2 flex-wrap">
                  {(data.commonTraits as string[]).map((trait: string, i: number) => (
                    <Badge key={i} variant="outline" className="text-xs">{trait}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Dimension Scores */}
            {data.dimensionScores && Object.keys(data.dimensionScores as object).length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">维度分数</p>
                <div className="space-y-1.5">
                  {Object.entries(data.dimensionScores as Record<string, number>).map(([key, score]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground w-24 truncate">{key}</span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
                      </div>
                      <span className="text-xs font-mono w-12 text-right">{score.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">未找到匹配记录</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
