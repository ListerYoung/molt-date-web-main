import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Loader2, Save, Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminSettings() {
  const { data: configs, isLoading, refetch } = trpc.admin.matching.config.list.useQuery();

  const updateMutation = trpc.admin.matching.config.update.useMutation({
    onSuccess: () => { toast.success("配置已更新"); refetch(); },
    onError: (e: any) => toast.error(e.message),
  });

  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!newKey || !newValue) return;
    updateMutation.mutate({ key: newKey, value: newValue, description: newDesc || undefined });
    setNewKey("");
    setNewValue("");
    setNewDesc("");
  };

  const handleSaveEdit = (key: string) => {
    updateMutation.mutate({ key, value: editValue });
    setEditingKey(null);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">系统设置</h1>
        <p className="text-sm text-muted-foreground mt-1">管理匹配算法配置参数</p>
      </div>

      {/* Config List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">匹配配置</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>配置项</TableHead>
                    <TableHead>值</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {configs && configs.length > 0 ? (
                    configs.map((config: any) => (
                      <TableRow key={config.key}>
                        <TableCell className="font-mono text-xs">{config.key}</TableCell>
                        <TableCell>
                          {editingKey === config.key ? (
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="h-8 w-40"
                              onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(config.key)}
                            />
                          ) : (
                            <span className="text-sm">{String(config.value)}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {config.description || "-"}
                        </TableCell>
                        <TableCell>
                          {editingKey === config.key ? (
                            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => handleSaveEdit(config.key)}>
                              <Save className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-xs h-7"
                              onClick={() => { setEditingKey(config.key); setEditValue(String(config.value)); }}
                            >
                              编辑
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        暂无配置
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Config */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">添加配置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">配置Key</Label>
              <Input value={newKey} onChange={(e) => setNewKey(e.target.value)} className="h-9 mt-1" placeholder="如 min_match_score" />
            </div>
            <div>
              <Label className="text-xs">值</Label>
              <Input value={newValue} onChange={(e) => setNewValue(e.target.value)} className="h-9 mt-1" placeholder="如 60" />
            </div>
            <div>
              <Label className="text-xs">描述</Label>
              <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="h-9 mt-1" placeholder="最低匹配分数" />
            </div>
          </div>
          <Button size="sm" className="mt-3" onClick={handleAdd} disabled={!newKey || !newValue || updateMutation.isPending}>
            <Plus className="h-4 w-4 mr-1" />
            添加
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
