import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, Brain, Link2, Loader2 } from "lucide-react";

export default function AdminDashboard() {
  const { data: userStats, isLoading: loadingUsers } = trpc.admin.users.stats.useQuery();
  const { data: recordStats, isLoading: loadingRecords } = trpc.admin.records.stats.useQuery();
  const { data: matchStats, isLoading: loadingMatches } = trpc.admin.matching.stats.useQuery();
  const { data: poolStats, isLoading: loadingPool } = trpc.admin.matching.poolStats.useQuery();

  const isLoading = loadingUsers || loadingRecords || loadingMatches || loadingPool;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">仪表盘</h1>
        <p className="text-sm text-muted-foreground mt-1">Molt.Date 平台运营概览</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* User Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Users}
              label="总用户数"
              value={userStats?.totalUsers ?? 0}
            />
            <StatCard
              icon={Users}
              label="已完成问卷"
              value={userStats?.completedQuestionnaires ?? 0}
            />
            <StatCard
              icon={Users}
              label="已认证"
              value={userStats?.verifiedUsers ?? 0}
            />
            <StatCard
              icon={Users}
              label="活跃用户"
              value={userStats?.activeUsers ?? 0}
            />
          </div>

          {/* Questionnaire Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={ClipboardList}
              label="总答题数"
              value={recordStats?.totalSessions ?? 0}
            />
            <StatCard
              icon={ClipboardList}
              label="已完成"
              value={recordStats?.completed ?? 0}
            />
            <StatCard
              icon={ClipboardList}
              label="进行中"
              value={recordStats?.inProgress ?? 0}
            />
            <StatCard
              icon={ClipboardList}
              label="完成率"
              value={`${recordStats?.completionRate ?? 0}%`}
            />
          </div>

          {/* Matching Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={Link2}
              label="匹配池人数"
              value={poolStats?.eligible ?? 0}
            />
            <StatCard
              icon={Link2}
              label="总匹配对数"
              value={matchStats?.total ?? 0}
            />
            <StatCard
              icon={Link2}
              label="已推送"
              value={matchStats?.pushed ?? 0}
            />
            <StatCard
              icon={Link2}
              label="平均兼容分"
              value={matchStats?.avgScore ?? 0}
            />
          </div>

          {/* Pool breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">匹配池用户漏斗</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <FunnelRow label="总注册用户" value={poolStats?.totalUsers ?? 0} />
                <FunnelRow label="已认证用户" value={poolStats?.verified ?? 0} />
                <FunnelRow label="已完成问卷" value={poolStats?.withQuestionnaire ?? 0} />
                <FunnelRow label="已计算画像" value={poolStats?.withScores ?? 0} />
                <FunnelRow label="可匹配用户" value={poolStats?.eligible ?? 0} highlight />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold text-foreground mt-0.5">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FunnelRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 px-3 rounded ${highlight ? "bg-primary/10" : ""}`}>
      <span className={highlight ? "font-medium text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={`font-mono ${highlight ? "font-semibold text-primary" : "text-foreground"}`}>{value}</span>
    </div>
  );
}
