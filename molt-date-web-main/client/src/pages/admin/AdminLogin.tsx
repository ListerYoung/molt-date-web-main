import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock, Shield } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();

  const loginMutation = trpc.admin.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("登录成功");
        setLocation("/admin");
      } else {
        toast.error(data.message || "登录失败");
      }
    },
    onError: (err) => {
      toast.error(err.message || "登录失败");
    },
  });

  const handleLogin = () => {
    if (!password.trim()) {
      toast.error("请输入管理密码");
      return;
    }
    loginMutation.mutate({ password: password.trim() });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950">
      <Card className="w-full max-w-sm mx-4 bg-zinc-900 border-zinc-800">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-lg bg-zinc-800 flex items-center justify-center">
              <Shield className="h-6 w-6 text-zinc-400" />
            </div>
          </div>
          <CardTitle className="text-lg font-medium text-zinc-100">
            Molt.Date 管理后台
          </CardTitle>
          <p className="text-sm text-zinc-500 mt-1">
            请输入管理密码以继续
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-400 text-sm">
              管理密码
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
              <Input
                id="password"
                type="password"
                placeholder="输入管理密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-500"
                disabled={loginMutation.isPending}
                autoFocus
              />
            </div>
          </div>
          <Button
            onClick={handleLogin}
            disabled={!password || loginMutation.isPending}
            className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                验证中...
              </>
            ) : (
              "登录"
            )}
          </Button>
          <div className="text-center">
            <button
              onClick={() => (window.location.href = "/")}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              返回首页
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
