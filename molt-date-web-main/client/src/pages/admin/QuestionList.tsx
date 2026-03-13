import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2, Plus, Wand2, Check, X } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { key: "all", label: "全部" },
  { key: "values", label: "价值观" },
  { key: "lifestyle", label: "生活方式" },
  { key: "social", label: "社会观点" },
  { key: "intimate", label: "亲密关系" },
];

const CATEGORY_COLORS: Record<string, string> = {
  values: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  lifestyle: "bg-green-500/10 text-green-400 border-green-500/20",
  social: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  intimate: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function QuestionList() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState("all");

  const { data: questions, isLoading, refetch } = trpc.admin.questions.list.useQuery({
    category: category === "all" ? undefined : category,
  });

  const vectorizeMutation = trpc.admin.questions.vectorize.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        toast.success("AI 向量化完成");
        refetch();
      } else {
        toast.error(result.error ?? "向量化失败");
      }
    },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">问卷管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理 66 道深度兼容性问卷</p>
        </div>
        <Button size="sm" onClick={() => setLocation("/admin/questions/new")}>
          <Plus className="h-4 w-4 mr-1" />
          新增题目
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={category} onValueChange={setCategory}>
        <TabsList>
          {CATEGORIES.map((cat) => (
            <TabsTrigger key={cat.key} value={cat.key} className="text-xs">
              {cat.label}
              {questions && cat.key !== "all" && (
                <span className="ml-1 text-muted-foreground">
                  ({questions.filter(q => q.category === cat.key).length})
                </span>
              )}
              {cat.key === "all" && questions && (
                <span className="ml-1 text-muted-foreground">({questions.length})</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">题号</TableHead>
                <TableHead className="w-[100px]">分类</TableHead>
                <TableHead>题目</TableHead>
                <TableHead className="w-[70px]">选项数</TableHead>
                <TableHead className="w-[70px]">权重</TableHead>
                <TableHead className="w-[70px]">向量化</TableHead>
                <TableHead className="w-[60px]">状态</TableHead>
                <TableHead className="w-[120px]">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions && questions.length > 0 ? (
                questions.map((q) => {
                  const options = (q.options as Array<any>) ?? [];
                  const hasWeights = !!q.dimensionWeights && Object.keys(q.dimensionWeights as object).length > 0;
                  return (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-xs">{q.questionNumber}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${CATEGORY_COLORS[q.category ?? ""] ?? ""}`}>
                          {q.categoryZh || q.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm max-w-[300px] truncate">
                        {q.textZh}
                      </TableCell>
                      <TableCell className="text-xs text-center">{options.length}</TableCell>
                      <TableCell className="text-center">
                        {hasWeights ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {q.aiVectorized ? (
                          <Check className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={q.isActive ? "default" : "secondary"} className="text-xs">
                          {q.isActive ? "启用" : "停用"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs h-7"
                            onClick={() => setLocation(`/admin/questions/${q.id}/edit`)}
                          >
                            编辑
                          </Button>
                          {!q.aiVectorized && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                              disabled={vectorizeMutation.isPending}
                              onClick={() => vectorizeMutation.mutate({ id: q.id })}
                            >
                              <Wand2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                    暂无题目数据
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
