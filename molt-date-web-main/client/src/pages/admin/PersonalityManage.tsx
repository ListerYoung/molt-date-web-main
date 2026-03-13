import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const DOMAIN_LABELS: Record<string, string> = {
  values: "价值观",
  lifestyle: "生活方式",
  social: "社会观点",
  intimate: "亲密关系",
  personality: "性格特质",
};

export default function PersonalityManage() {
  const [userPage, setUserPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);

  // Dimensions list
  const { data: dimensions, isLoading: loadingDimensions, refetch: refetchDimensions } =
    trpc.admin.personality.dimensions.list.useQuery();

  // User scores list
  const { data: userScores, isLoading: loadingScores, refetch: refetchScores } =
    trpc.admin.personality.scores.list.useQuery({
      page: userPage,
      pageSize: 20,
    });

  // Recompute single user
  const recomputeMutation = trpc.admin.personality.scores.recompute.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("画像已重新计算");
        refetchScores();
      } else {
        toast.error(result.error ?? "计算失败");
      }
    },
    onError: (e: any) => toast.error(e.message),
  });

  // Recompute all
  const recomputeAllMutation = trpc.admin.personality.scores.recomputeAll.useMutation({
    onSuccess: (result) => {
      toast.success(`批量计算完成：成功 ${result.successCount}，失败 ${result.failCount}`);
      refetchScores();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">画像分析</h1>
          <p className="text-sm text-muted-foreground mt-1">管理画像维度定义与用户评分</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={recomputeAllMutation.isPending}
            onClick={() => recomputeAllMutation.mutate()}
          >
            {recomputeAllMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <RefreshCw className="h-4 w-4 mr-1" />}
            全量重算
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                新增维度
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>新增画像维度</DialogTitle>
              </DialogHeader>
              <AddDimensionForm onSuccess={() => { setShowAddDialog(false); refetchDimensions(); }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Dimensions Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">维度定义（{dimensions?.length ?? 0} 个）</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingDimensions ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">ID</TableHead>
                    <TableHead>维度名称</TableHead>
                    <TableHead>领域</TableHead>
                    <TableHead>匹配策略</TableHead>
                    <TableHead className="w-[80px]">权重</TableHead>
                    <TableHead className="w-[60px]">状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dimensions && dimensions.length > 0 ? (
                    dimensions.map((dim: any) => (
                      <TableRow key={dim.id}>
                        <TableCell className="font-mono text-xs">{dim.id}</TableCell>
                        <TableCell className="font-medium text-sm">{dim.nameZh || dim.nameEn}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {dim.domainNameZh || (DOMAIN_LABELS[dim.domainKey ?? ""] ?? dim.domainKey)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {dim.matchStrategy ?? "-"}
                        </TableCell>
                        <TableCell className="text-xs text-center">{dim.matchWeight ?? 1}</TableCell>
                        <TableCell>
                          <Badge variant={dim.isActive ? "default" : "secondary"} className="text-xs">
                            {dim.isActive ? "启用" : "停用"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        暂无维度定义
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Scores Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">用户画像评分</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingScores ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px]">用户ID</TableHead>
                      <TableHead>用户名</TableHead>
                      <TableHead>学校</TableHead>
                      <TableHead>维度数</TableHead>
                      <TableHead>画像类型</TableHead>
                      <TableHead>计算时间</TableHead>
                      <TableHead className="w-[100px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userScores && userScores.length > 0 ? (
                      userScores.map((u: any) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-mono text-xs">{u.id}</TableCell>
                          <TableCell className="text-sm">{u.name || "-"}</TableCell>
                          <TableCell className="text-sm">{u.university || "-"}</TableCell>
                          <TableCell className="text-sm">{u.scores?.length ?? 0}</TableCell>
                          <TableCell>
                            {u.profileType ? (
                              <Badge variant="outline" className="text-xs">{u.profileType}</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">未生成</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {u.computedAt ? new Date(u.computedAt).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                              disabled={recomputeMutation.isPending}
                              onClick={() => recomputeMutation.mutate({ userId: u.id })}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              重算
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          暂无用户评分数据
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end mt-3 gap-2">
                <Button size="sm" variant="outline" className="h-8" disabled={userPage <= 1} onClick={() => setUserPage((p) => p - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">第 {userPage} 页</span>
                <Button size="sm" variant="outline" className="h-8" disabled={!userScores || userScores.length < 20} onClick={() => setUserPage((p) => p + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AddDimensionForm({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState({
    domainKey: "values",
    domainNameZh: "价值观",
    domainNameEn: "Values",
    dimensionKey: "",
    nameZh: "",
    nameEn: "",
    descriptionZh: "",
    matchStrategy: "similar" as const,
    matchWeight: 1,
    sortOrder: 0,
  });

  const updateMutation = trpc.admin.personality.dimensions.update.useMutation({
    onSuccess: () => {
      toast.success("维度创建成功");
      onSuccess();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleDomainChange = (v: string) => {
    const labels: Record<string, { zh: string; en: string }> = {
      values: { zh: "价值观", en: "Values" },
      lifestyle: { zh: "生活方式", en: "Lifestyle" },
      social: { zh: "社会观点", en: "Social" },
      intimate: { zh: "亲密关系", en: "Intimate" },
      personality: { zh: "性格特质", en: "Personality" },
    };
    setForm({ ...form, domainKey: v, domainNameZh: labels[v]?.zh ?? v, domainNameEn: labels[v]?.en ?? v });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">维度Key</Label>
          <Input value={form.dimensionKey} onChange={(e) => setForm({ ...form, dimensionKey: e.target.value })} className="h-9 mt-1" placeholder="openness" />
        </div>
        <div>
          <Label className="text-xs">中文名称</Label>
          <Input value={form.nameZh} onChange={(e) => setForm({ ...form, nameZh: e.target.value })} className="h-9 mt-1" placeholder="开放性" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">英文名称</Label>
          <Input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="h-9 mt-1" placeholder="Openness" />
        </div>
        <div>
          <Label className="text-xs">领域</Label>
          <Select value={form.domainKey} onValueChange={handleDomainChange}>
            <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(DOMAIN_LABELS).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label className="text-xs">中文描述</Label>
        <Input value={form.descriptionZh} onChange={(e) => setForm({ ...form, descriptionZh: e.target.value })} className="h-9 mt-1" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label className="text-xs">匹配策略</Label>
          <Select value={form.matchStrategy} onValueChange={(v: any) => setForm({ ...form, matchStrategy: v })}>
            <SelectTrigger className="h-9 mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="similar">相似匹配</SelectItem>
              <SelectItem value="complementary">互补匹配</SelectItem>
              <SelectItem value="threshold">阈值匹配</SelectItem>
              <SelectItem value="expectation">期望匹配</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">权重</Label>
          <Input type="number" value={form.matchWeight} onChange={(e) => setForm({ ...form, matchWeight: Number(e.target.value) })} className="h-9 mt-1" />
        </div>
        <div>
          <Label className="text-xs">排序</Label>
          <Input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })} className="h-9 mt-1" />
        </div>
      </div>
      <Button
        className="w-full"
        size="sm"
        disabled={!form.dimensionKey || !form.nameZh || updateMutation.isPending}
        onClick={() => updateMutation.mutate(form)}
      >
        {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
        创建维度
      </Button>
    </div>
  );
}
