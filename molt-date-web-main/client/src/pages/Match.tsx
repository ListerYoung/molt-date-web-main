/**
 * Match Page - AI Weekly Match Push
 * Shows the weekly match result or a friendly waiting state
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Clock, MessageSquare, QrCode, GraduationCap, User, CalendarDays, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Match() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  // 强制设为已登录，跳过登录校验
//const { user, isAuthenticated: _, loading: authLoading } = useAuth();
//const isAuthenticated = true;

 const { t } = useLanguage();

  const matchQuery = trpc.match.getLatest.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const profileQuery = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const answersQuery = trpc.questionnaire.getAnswers.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const match = matchQuery.data;
  const profile = profileQuery.data;
  const answers = answersQuery.data;
  const isVerified = profile?.verificationStatus === "verified";
  const hasCompletedQuestionnaire = answers && Object.keys(answers.answers as Record<string, string>).length >= 66;

  // Loading state
  if (authLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
        </div>
      </Layout>
    );
  }

  // Not logged in
  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container pt-24 pb-16 lg:pt-32 relative z-10 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 lg:p-12 max-w-lg w-full text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-neon-pink/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-neon-pink" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t("登录后查看匹配", "Sign In to View Matches")}
            </h2>
            <p className="text-white/40 mb-8">
              {t("请先登录并完成校园认证，才能使用 AI 匹配功能。", "Please sign in and complete campus verification to use AI matching.")}
            </p>
            <a href={getLoginUrl()}>
              <Button className="bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-8 py-5 rounded-xl">
                {t("登录 / 注册", "Sign In")}
              </Button>
            </a>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Not verified or not completed questionnaire
  if (!isVerified || !hasCompletedQuestionnaire) {
    return (
      <Layout>
        <div className="container pt-24 pb-16 lg:pt-32 relative z-10 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 lg:p-12 max-w-lg w-full text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-neon-cyan/10 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-neon-cyan" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t("还差一步", "Almost There")}
            </h2>
            <p className="text-white/40 mb-8">
              {t("完成以下步骤后，每周六将为你推送一位最兼容的约会对象。", "Complete the steps below, and every Saturday we'll push your most compatible match.")}
            </p>

            <div className="space-y-4 text-left">
              {/* Step 1: Verification */}
              <div className={`flex items-center gap-4 p-4 rounded-xl border ${isVerified ? "border-green-500/20 bg-green-500/5" : "border-yellow-500/20 bg-yellow-500/5"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isVerified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                  {isVerified ? "✓" : "1"}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isVerified ? "text-green-400" : "text-yellow-400"}`}>
                    {t("校园认证", "Campus Verification")}
                  </p>
                  <p className="text-xs text-white/30">
                    {isVerified ? t("已完成", "Completed") : t("前往个人中心完成认证", "Go to profile to verify")}
                  </p>
                </div>
                {!isVerified && (
                  <Link href="/profile">
                    <Button size="sm" className="bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 border border-neon-cyan/30">
                      {t("去认证", "Verify")}
                    </Button>
                  </Link>
                )}
              </div>

              {/* Step 2: Questionnaire */}
              <div className={`flex items-center gap-4 p-4 rounded-xl border ${hasCompletedQuestionnaire ? "border-green-500/20 bg-green-500/5" : "border-white/10 bg-white/5"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${hasCompletedQuestionnaire ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>
                  {hasCompletedQuestionnaire ? "✓" : "2"}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${hasCompletedQuestionnaire ? "text-green-400" : "text-white/60"}`}>
                    {t("完成 66 题问卷", "Complete 66 Questions")}
                  </p>
                  <p className="text-xs text-white/30">
                    {hasCompletedQuestionnaire ? t("已完成", "Completed") : t("填写深度兼容性问卷", "Fill in the deep compatibility questionnaire")}
                  </p>
                </div>
                {!hasCompletedQuestionnaire && (
                  <Link href="/questionnaire">
                    <Button size="sm" className="bg-neon-pink/20 text-neon-pink hover:bg-neon-pink/30 border border-neon-pink/30">
                      {t("去填写", "Start")}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // No match yet — waiting state
  if (!match) {
    return (
      <Layout>
        <div className="container pt-24 pb-16 lg:pt-32 relative z-10 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 lg:p-12 max-w-lg w-full text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center mx-auto mb-6 border border-white/10"
            >
              <Clock className="w-12 h-12 text-neon-cyan" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t("AI 正在为你寻找…", "AI is Searching for You...")}
            </h2>
            <p className="text-white/40 mb-6 leading-relaxed">
              {t(
                "你的兼容性画像已生成，AI 匹配引擎正在运行中。每周六将为你推送一位最兼容的约会对象，请耐心等待。",
                "Your compatibility profile is ready. The AI matching engine is running. Every Saturday, we'll push your most compatible match. Please wait patiently."
              )}
            </p>
            <div className="glass-card rounded-xl p-4 inline-flex items-center gap-3">
              <CalendarDays className="w-5 h-5 text-neon-pink" />
              <span className="text-sm text-white/60">
                {t("下次推送：本周六 10:00", "Next push: This Saturday 10:00 AM")}
              </span>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-xs text-white/20">
                {t(
                  "提示：完善个人资料和微信信息，可以让匹配对象更好地了解你",
                  "Tip: Complete your profile and WeChat info so your match can know you better"
                )}
              </p>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Has match — show match result
  const matchedProfile = match.matchedProfile;

  return (
    <Layout>
      <div className="container pt-24 pb-16 lg:pt-32 relative z-10">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-pink/30 bg-neon-pink/5 mb-4">
              <Sparkles className="w-4 h-4 text-neon-pink" />
              <span className="text-xs font-medium text-neon-pink">
                {t("本周匹配", "This Week's Match")}
              </span>
            </div>
            <h1
              className="text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("你的约会对象", "Your Date")}
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl overflow-hidden"
          >
            {/* Match Score Header */}
            <div className="bg-gradient-to-r from-neon-pink/20 to-neon-cyan/20 p-6 text-center border-b border-white/5">
              <div className="text-sm text-white/50 mb-1">{t("兼容性指数", "Compatibility Score")}</div>
              <div
                className="text-5xl font-bold gradient-text"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {match.compatibilityScore || 85}%
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-6 lg:p-8">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center overflow-hidden">
                  {matchedProfile?.avatarUrl ? (
                    <img src={matchedProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {matchedProfile?.nickname || t("匿名用户", "Anonymous")}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-4 h-4 text-neon-cyan/60" />
                    <span className="text-sm text-white/40">
                      {matchedProfile?.university || ""} {matchedProfile?.major ? `· ${matchedProfile.major}` : ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {matchedProfile?.bio && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-white/30" />
                    <span className="text-xs font-medium text-white/50">{t("个人简介", "Bio")}</span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed pl-6">
                    {matchedProfile.bio}
                  </p>
                </div>
              )}

              {/* WeChat Info */}
              <div className="glass-card rounded-xl p-5 border border-neon-pink/20">
                <div className="flex items-center gap-2 mb-3">
                  <QrCode className="w-5 h-5 text-neon-pink" />
                  <span className="text-sm font-medium text-white">{t("联系方式", "Contact")}</span>
                </div>
                {matchedProfile?.wechatId ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/40">{t("微信号", "WeChat ID")}:</span>
                      <span className="text-sm text-neon-cyan font-mono">{matchedProfile.wechatId}</span>
                    </div>
                    {matchedProfile.wechatQrUrl && (
                      <div className="mt-3">
                        <img
                          src={matchedProfile.wechatQrUrl}
                          alt="WeChat QR"
                          className="w-40 h-40 rounded-xl mx-auto border border-white/10"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-white/30">
                    {t("对方暂未设置微信信息", "The match hasn't set up WeChat info yet")}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/20 text-xs mt-6"
          >
            {t(
              `匹配周期：${match.matchWeek} · 每周六更新`,
              `Match week: ${match.matchWeek} · Updated every Saturday`
            )}
          </motion.p>
        </div>
      </div>
    </Layout>
  );
}
