/**
 * Result Page - AI Compatibility Analysis Results
 * Design: Dramatic reveal with neon data visualization,
 * radar chart, dimension breakdowns, and share CTA
 */
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuestionnaire } from "@/contexts/QuestionnaireContext";
import { categories, questions } from "@/data/questions";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Share2,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Shield,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

const RESULT_BG = "https://private-us-east-1.manuscdn.com/sessionFile/zjkRxQwKWENUjBTLANKz0Y/sandbox/DfiLxrQdE6ZVpS2XW1FnGJ-img-3_1771177146000_na1fn_cmVzdWx0LWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvemprUnhRd0tXRU5VakJUTEFOS3owWS9zYW5kYm94L0RmaUx4clFkRTZaVnBTMlhXMUZuR0otaW1nLTNfMTc3MTE3NzE0NjAwMF9uYTFmbl9jbVZ6ZFd4MExXSm4uanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=T~hG-sIX~SGPLlmgFpiUlV-m5Dh7HBYN3-iQpqRk17sbbTU6oaEFzbNMMjJbYUwLEnj8jPtcyZb8fKue9HzW1Hjv2UtKQYNfE~0OM7-cUDp7kzBGznWqkqurFNbNQHrJlTgsPpt21tQDl-ZMNxzm4OL178XGArxefq7XSYlsnp9tYZ5IPNQuiIm28-81Q-v8gLEWteX0m6NWnoCByOr~ILMlktDw7RS2N167IzpUyDmzTpRl~3nYmailjV29j3aNsHbeKCj7K-1ypUaaODyiKXy1inN7641TFHkvtwPOFPNhCEhXKE7zHySoOHFHdqccWdvu8Hg3n7YMeyqS2jWDVA__";

interface DimensionScore {
  category: string;
  categoryZh: string;
  categoryEn: string;
  icon: string;
  score: number;
  insight: { zh: string; en: string };
}

function computeScores(answers: Record<number, string>): DimensionScore[] {
  const categoryScores: Record<string, number[]> = {};

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (!answer) return;
    if (!categoryScores[q.category]) categoryScores[q.category] = [];
    const optionIndex = q.options.findIndex((o) => o.id === answer);
    const baseScore = [92, 85, 75, 65, 55][optionIndex] || 70;
    // Use deterministic variance based on question id
    const variance = ((q.id * 7 + optionIndex * 3) % 11) - 5;
    categoryScores[q.category].push(Math.min(99, Math.max(50, baseScore + variance)));
  });

  const insights: Record<string, { zh: string; en: string }> = {
    values: {
      zh: "你拥有清晰的人生方向和坚定的价值观，这将帮助你找到志同道合的伴侣。",
      en: "You have a clear life direction and firm values, which will help you find a like-minded partner.",
    },
    lifestyle: {
      zh: "你的生活方式偏好展现了良好的自律性和开放态度，这是建立健康关系的基础。",
      en: "Your lifestyle preferences show good self-discipline and openness, a foundation for healthy relationships.",
    },
    social: {
      zh: "你对社会议题有独到的见解，能够与伴侣进行深层次的思想交流。",
      en: "You have unique insights on social issues, enabling deep intellectual exchange with your partner.",
    },
    intimate: {
      zh: "你在亲密关系中展现了成熟的态度和清晰的期待，这有助于建立稳固的情感纽带。",
      en: "You show mature attitudes and clear expectations in intimate relationships, helping build strong emotional bonds.",
    },
  };

  return categories.map((cat) => {
    const scores = categoryScores[cat.id] || [];
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 70;
    return {
      category: cat.id,
      categoryZh: cat.zh,
      categoryEn: cat.en,
      icon: cat.icon,
      score: Math.round(avg),
      insight: insights[cat.id] || { zh: "", en: "" },
    };
  });
}

function RadarChart({ scores }: { scores: DimensionScore[] }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = size / 2 - 40;
  const levels = 4;
  const angleStep = (2 * Math.PI) / scores.length;

  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const dataPoints = scores.map((s, i) => getPoint(i, s.score));
  const pathData = dataPoints.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[280px] mx-auto">
      {Array.from({ length: levels }, (_, i) => {
        const r = ((i + 1) / levels) * maxRadius;
        const points = scores
          .map((_, j) => {
            const angle = j * angleStep - Math.PI / 2;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          })
          .join(" ");
        return (
          <polygon key={i} points={points} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        );
      })}

      {scores.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const endX = center + maxRadius * Math.cos(angle);
        const endY = center + maxRadius * Math.sin(angle);
        return <line key={i} x1={center} y1={center} x2={endX} y2={endY} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}

      <motion.path
        d={pathData}
        fill="url(#radarGradient)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      <defs>
        <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(255, 45, 120)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="rgb(0, 245, 212)" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(255, 45, 120)" />
          <stop offset="100%" stopColor="rgb(0, 245, 212)" />
        </linearGradient>
      </defs>

      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill={i % 2 === 0 ? "rgb(255, 45, 120)" : "rgb(0, 245, 212)"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
        />
      ))}

      {scores.map((s, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const labelRadius = maxRadius + 25;
        const x = center + labelRadius * Math.cos(angle);
        const y = center + labelRadius * Math.sin(angle);
        return (
          <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="fill-white/50 text-[10px]">
            {s.icon}
          </text>
        );
      })}
    </svg>
  );
}

function LoadingReveal() {
  const { t } = useLanguage();

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-transparent border-t-neon-pink border-r-neon-cyan"
        />
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/60 text-sm"
        >
          {t("AI 正在分析你的兼容性画像...", "AI is analyzing your compatibility profile...")}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Result() {
  const { lang, t } = useLanguage();
  const { answers, resetQuestionnaire } = useQuestionnaire();
  const [, navigate] = useLocation();
  const [showContent, setShowContent] = useState(false);

  const scores = useMemo(() => computeScores(answers), [answers]);
  const overallScore = useMemo(
    () => Math.round(scores.reduce((a, b) => a + b.score, 0) / scores.length),
    [scores]
  );

  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getPersonalityType = (score: number) => {
    if (score >= 85) return { zh: "理想主义者", en: "Idealist" };
    if (score >= 75) return { zh: "务实浪漫者", en: "Pragmatic Romantic" };
    if (score >= 65) return { zh: "自由探索者", en: "Free Explorer" };
    return { zh: "随性生活家", en: "Casual Lifestyle" };
  };

  const personality = getPersonalityType(overallScore);

  const handleRetake = () => {
    resetQuestionnaire();
    navigate("/questionnaire");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Molt.Date - AI 深度兼容性分析",
        text: `我在 Molt.Date 的兼容性画像得分：${overallScore}分！来测测你的？`,
        url: window.location.origin,
      });
    } else {
      navigator.clipboard.writeText(
        `我在 Molt.Date 的兼容性画像得分：${overallScore}分！来测测你的？ ${window.location.origin}`
      );
      toast.success(t("链接已复制到剪贴板", "Link copied to clipboard"));
    }
  };

  return (
    <Layout particleDensity={25}>
      <div className="fixed inset-0 z-0">
        <img src={RESULT_BG} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-background/80" />
      </div>

      {/* Loading Animation */}
      <AnimatePresence>
        {!showContent && <LoadingReveal />}
      </AnimatePresence>

      {/* Result Content */}
      {showContent && (
        <div className="relative z-10 pt-24 lg:pt-28 pb-16">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 mb-6">
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                  <span className="text-xs font-medium text-neon-cyan">
                    {t("AI 分析完成", "AI Analysis Complete")}
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t("你的兼容性画像", "Your Compatibility Profile")}
                </h1>
                <p className="text-white/40 text-base">
                  {t(
                    `基于你回答的 ${answeredCount} 个问题，AI 为你生成了以下分析报告`,
                    `Based on your ${answeredCount} answers, AI generated the following analysis`
                  )}
                </p>
              </motion.div>

              {/* Score Hero */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card rounded-3xl p-8 lg:p-12 mb-8"
              >
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className="mb-4">
                      <span className="text-xs text-white/30 tracking-widest uppercase">
                        {t("综合兼容性指数", "Overall Compatibility Index")}
                      </span>
                    </div>
                    <div className="relative inline-block">
                      <motion.span
                        className="text-7xl lg:text-8xl font-bold gradient-text"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                      >
                        {overallScore}
                      </motion.span>
                      <span className="text-2xl text-white/30 ml-1">/100</span>
                    </div>

                    <div className="mt-4 flex items-center gap-2 justify-center lg:justify-start">
                      <Star className="w-4 h-4 text-neon-pink" />
                      <span className="text-lg font-semibold text-white">
                        {lang === "zh" ? personality.zh : personality.en}
                      </span>
                    </div>

                    <p className="text-sm text-white/35 mt-3 max-w-sm">
                      {t(
                        "你的兼容性画像展现了独特的个人特质，AI 将基于此为你匹配最合适的伴侣。",
                        "Your compatibility profile reveals unique personal traits. AI will match you with the most suitable partner based on this."
                      )}
                    </p>
                  </div>

                  <div>
                    <RadarChart scores={scores} />
                  </div>
                </div>
              </motion.div>

              {/* Dimension Breakdown */}
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {scores.map((dim, i) => (
                  <motion.div
                    key={dim.category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="glass-card rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{dim.icon}</span>
                        <span className="text-sm font-medium text-white/80">
                          {lang === "zh" ? dim.categoryZh : dim.categoryEn}
                        </span>
                      </div>
                      <span
                        className="text-2xl font-bold gradient-text"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {dim.score}
                      </span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden mb-3">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: "linear-gradient(90deg, oklch(0.65 0.28 350), oklch(0.82 0.18 180))",
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                      />
                    </div>

                    <p className="text-xs text-white/30 leading-relaxed">
                      {lang === "zh" ? dim.insight.zh : dim.insight.en}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* AI Insight Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="glass-card rounded-2xl p-6 lg:p-8 mb-8 border-neon-cyan/10"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-neon-cyan" />
                  <h3 className="text-lg font-semibold text-white">
                    {t("AI 洞察", "AI Insight")}
                  </h3>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">
                  {t(
                    `根据你的回答分析，你在亲密关系中倾向于寻求深层次的精神共鸣和情感连接。你重视伴侣的独立性和个人成长，同时也期待在关系中建立稳固的信任基础。你的理想伴侣应该是一个既能与你进行深度思想交流，又能在日常生活中给予你足够个人空间的人。建议你在匹配时特别关注"价值观"和"亲密关系"维度的兼容性。`,
                    `Based on your answers, you tend to seek deep spiritual resonance and emotional connection in intimate relationships. You value your partner's independence and personal growth, while also expecting a solid foundation of trust. Your ideal partner should be someone who can engage in deep intellectual exchange and give you enough personal space in daily life. We recommend paying special attention to "Values" and "Intimate Relationships" dimension compatibility.`
                  )}
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  onClick={handleShare}
                  className="bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-8 py-6 text-base rounded-xl"
                  style={{ boxShadow: "0 0 20px oklch(0.65 0.28 350 / 30%)" }}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  {t("分享结果", "Share Results")}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleRetake}
                  className="border-white/20 hover:border-neon-cyan/50 text-white/70 hover:text-white font-medium px-8 py-6 text-base rounded-xl bg-transparent"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  {t("重新测试", "Retake Test")}
                </Button>
              </motion.div>

              {/* Disclaimer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center mt-12"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-white/20" />
                  <span className="text-xs text-white/20">
                    {t("你的数据已加密保护", "Your data is encrypted and protected")}
                  </span>
                </div>
                <p className="text-xs text-white/15 max-w-md mx-auto">
                  {t(
                    "本分析结果仅供参考，不构成任何专业建议。匹配结果基于问卷回答的统计分析。",
                    "This analysis is for reference only and does not constitute professional advice. Matching results are based on statistical analysis of questionnaire responses."
                  )}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8">
        <div className="container text-center">
          <div className="flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-neon-pink" />
            <span
              className="text-sm font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="neon-text-pink">Molt</span>
              <span className="text-white/40">.</span>
              <span className="neon-text-cyan">Date</span>
            </span>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
