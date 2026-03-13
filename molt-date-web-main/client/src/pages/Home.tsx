/**
 * Home Page - Cyberpunk Neon Landing
 * v2: Campus-first, real-name verification, pilot universities
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Shield, Zap, Users, ChevronRight, Sparkles, GraduationCap, BadgeCheck, Lock, School } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/zjkRxQwKWENUjBTLANKz0Y/sandbox/DfiLxrQdE6ZVpS2XW1FnGJ-img-1_1771177143000_na1fn_aGVyby1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvemprUnhRd0tXRU5VakJUTEFOS3owWS9zYW5kYm94L0RmaUx4clFkRTZaVnBTMlhXMUZuR0otaW1nLTFfMTc3MTE3NzE0MzAwMF9uYTFmbl9hR1Z5YnkxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=OJ5wZgWCL7EV0MjDpq1DcLQbIWS8c7llvbd3wDlCWbdlcl-~gvvkqjzd61xMtH17mdO5Jo1BRSJ9-ZeZhwegJpfQaQlW3D69q2xTv97fC3CWQ24aIvIggQbhkoWEZwG5dd3h0-AhTysUvOB9JTlQ7kFK7BEI3v4HpjiEy-v35JJ~skCtMyX~ZUVIyeeGoODVcxczOFb6VlsR2C7IDxE-E8B~MxQptmr4wzxnMLzAoFI9uaCDOTlU1Aw23A0DVgfmlIYjkOvNFiHOg0wLLDRaynj-Dk~Obr-9-naUVDdyh7sfXjOYrmJnbrVRJa~aQSgEdyHRMAj-rZbLvYshYsTTBg__";

const RESULT_BG = "https://private-us-east-1.manuscdn.com/sessionFile/zjkRxQwKWENUjBTLANKz0Y/sandbox/DfiLxrQdE6ZVpS2XW1FnGJ-img-3_1771177146000_na1fn_cmVzdWx0LWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvemprUnhRd0tXRU5VakJUTEFOS3owWS9zYW5kYm94L0RmaUx4clFkRTZaVnBTMlhXMUZuR0otaW1nLTNfMTc3MTE3NzE0NjAwMF9uYTFmbl9jbVZ6ZFd4MExXSm4uanBnP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=T~hG-sIX~SGPLlmgFpiUlV-m5Dh7HBYN3-iQpqRk17sbbTU6oaEFzbNMMjJbYUwLEnj8jPtcyZb8fKue9HzW1Hjv2UtKQYNfE~0OM7-cUDp7kzBGznWqkqurFNbNQHrJlTgsPpt21tQDl-ZMNxzm4OL178XGArxefq7XSYlsnp9tYZ5IPNQuiIm28-81Q-v8gLEWteX0m6NWnoCByOr~ILMlktDw7RS2N167IzpUyDmzTpRl~3nYmailjV29j3aNsHbeKCj7K-1ypUaaODyiKXy1inN7641TFHkvtwPOFPNhCEhXKE7zHySoOHFHdqccWdvu8Hg3n7YMeyqS2jWDVA__";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6 },
  }),
};

// Pilot universities data
const PILOT_UNIVERSITIES = [
  { name: "浙江大学", nameEn: "Zhejiang University", abbr: "ZJU", domain: "zju.edu.cn", online: 1280 },
  { name: "清华大学", nameEn: "Tsinghua University", abbr: "THU", domain: "tsinghua.edu.cn", online: 2150 },
  { name: "北京大学", nameEn: "Peking University", abbr: "PKU", domain: "pku.edu.cn", online: 1890 },
  { name: "复旦大学", nameEn: "Fudan University", abbr: "FDU", domain: "fudan.edu.cn", online: 1560 },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const features = [
    {
      icon: GraduationCap,
      title: t("校园实名制", "Campus Verified"),
      desc: t(
        "校园邮箱或学信网实名认证，确保每位用户都是真实在校生或校友",
        "Campus email or Xuexin verification ensures every user is a real student or alumni"
      ),
      color: "neon-cyan",
    },
    {
      icon: Brain,
      title: t("66 题深度问卷", "66 Deep Questions"),
      desc: t(
        "涵盖价值观、生活方式、社会观点和亲密关系四大维度，全面解析你的兼容性画像",
        "Covering values, lifestyle, social views, and intimacy — a complete compatibility profile"
      ),
      color: "neon-pink",
    },
    {
      icon: Zap,
      title: t("AI 智能匹配", "AI Smart Matching"),
      desc: t(
        "每周六为你推送一位最兼容的约会对象，校园优先匹配",
        "Every Saturday, receive one most compatible match — campus-priority matching"
      ),
      color: "neon-cyan",
    },
    {
      icon: Shield,
      title: t("隐私至上", "Privacy First"),
      desc: t(
        "端到端加密保护你的个人数据，你的答案只用于匹配计算",
        "End-to-end encryption protects your data — answers are only used for matching"
      ),
      color: "neon-pink",
    },
  ];

  const stats = [
    { value: "4", label: t("首批高校", "Pilot Universities") },
    { value: "66", label: t("深度问题", "Deep Questions") },
    { value: "100%", label: t("实名认证", "Verified Users") },
    { value: t("每周六", "Sat"), label: t("匹配推送", "Weekly Match") },
  ];

  return (
    <Layout particleDensity={35}>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
        </div>

        <div className="container relative z-10 pt-24 pb-16 lg:pt-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={0}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/5"
              >
                <GraduationCap className="w-4 h-4 text-neon-cyan" />
                <span className="text-xs font-medium text-neon-cyan tracking-wide">
                  {t("校园实名制 · AI 深度兼容性匹配", "Campus Verified · AI Deep Compatibility Matching")}
                </span>
              </motion.div>

              <motion.h1
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={1}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="text-white">{t("在校园里", "Find Your")}</span>
                <br />
                <span className="gradient-text">{t("遇见对的人", "Campus Soulmate")}</span>
              </motion.h1>

              <motion.p
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={2}
                className="text-base lg:text-lg text-white/50 max-w-lg leading-relaxed"
              >
                {t(
                  "Molt.Date 是一款面向中国顶尖高校的 AI 相亲平台。通过校园邮箱实名认证，66 题深度兼容性问卷，每周六为你推送一位最匹配的约会对象。首批开放浙大、清华、北大、复旦。",
                  "Molt.Date is an AI matchmaking platform for China's top universities. Verified via campus email, with 66 deep compatibility questions, we push your best match every Saturday. Now open at ZJU, Tsinghua, PKU, and Fudan."
                )}
              </motion.p>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                custom={3}
                className="flex flex-col sm:flex-row gap-4"
              >
                {isAuthenticated ? (
                  <Link href="/questionnaire">
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-8 py-6 text-base rounded-xl"
                      style={{ boxShadow: "0 0 20px oklch(0.65 0.28 350 / 30%), 0 0 60px oklch(0.65 0.28 350 / 10%)" }}
                    >
                      <Heart className="w-5 h-5 mr-2 group-hover:animate-heartbeat" />
                      {t("开始匹配", "Start Matching")}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <a href={getLoginUrl()}>
                    <Button
                      size="lg"
                      className="group relative overflow-hidden bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-8 py-6 text-base rounded-xl"
                      style={{ boxShadow: "0 0 20px oklch(0.65 0.28 350 / 30%), 0 0 60px oklch(0.65 0.28 350 / 10%)" }}
                    >
                      <GraduationCap className="w-5 h-5 mr-2" />
                      {t("注册并认证", "Sign Up & Verify")}
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                )}
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/20 hover:border-neon-cyan/50 text-white/70 hover:text-white font-medium px-8 py-6 text-base rounded-xl bg-transparent"
                  >
                    {t("了解更多", "Learn More")}
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Right: Stats Cards */}
            <motion.div
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 gap-3 sm:gap-4 mt-8 lg:mt-0"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  variants={fadeInUp}
                  custom={i + 2}
                  className="glass-card rounded-xl sm:rounded-2xl p-4 sm:p-6 group hover:border-neon-cyan/30 transition-all duration-500"
                >
                  <div
                    className="text-2xl sm:text-3xl xl:text-4xl font-bold gradient-text mb-1 sm:mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-white/40 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pilot Universities Section */}
      <section className="relative py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 mb-6">
              <School className="w-4 h-4 text-neon-cyan" />
              <span className="text-xs font-medium text-neon-cyan">
                {t("首批开放高校", "Pilot Universities")}
              </span>
            </div>
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("四所顶尖高校，率先开放", "Four Top Universities, Now Open")}
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-base lg:text-lg">
              {t(
                "校园优先匹配 — 优先在你的校园内寻找最兼容的对象，跨校匹配同步进行",
                "Campus-priority matching — find the most compatible match within your campus first, cross-campus matching runs in parallel"
              )}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILOT_UNIVERSITIES.map((uni, i) => (
              <motion.div
                key={uni.abbr}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 group hover:border-neon-pink/30 transition-all duration-500 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <span
                    className="text-xl font-bold gradient-text"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {uni.abbr}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{t(uni.name, uni.nameEn)}</h3>
                <p className="text-xs text-white/30 mb-3">{uni.domain}</p>
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-green-400/80">
                    {uni.online.toLocaleString()} {t("人在线", "online")}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center text-white/30 text-sm mt-8"
          >
            {t("更多高校即将开放，敬请期待…", "More universities coming soon...")}
          </motion.p>
        </div>
      </section>

      {/* Verification Process Section */}
      <section className="relative py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("实名认证，安全社交", "Verified Identity, Safe Dating")}
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-base lg:text-lg">
              {t(
                "两种认证方式，确保每位用户的真实身份",
                "Two verification methods to ensure every user's real identity"
              )}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 border-l-2 border-l-neon-cyan/50"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center mb-4">
                <BadgeCheck className="w-6 h-6 text-neon-cyan" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("校园邮箱认证", "Campus Email Verification")}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-4">
                {t(
                  "使用你的 .edu.cn 校园邮箱注册，系统自动发送验证链接，一键完成认证。",
                  "Register with your .edu.cn campus email, receive an automatic verification link, and verify in one click."
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {["zju.edu.cn", "tsinghua.edu.cn", "pku.edu.cn", "fudan.edu.cn"].map(d => (
                  <span key={d} className="text-xs px-2 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan/70 border border-neon-cyan/20">
                    @{d}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass-card rounded-2xl p-8 border-l-2 border-l-neon-pink/50"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-pink/10 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-neon-pink" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {t("学信网认证", "Xuexin (CHSI) Verification")}
              </h3>
              <p className="text-sm text-white/40 leading-relaxed mb-4">
                {t(
                  "通过学信网在线学籍验证，适用于已毕业校友或无法使用校园邮箱的用户。",
                  "Verify via CHSI online enrollment check, suitable for alumni or users without campus email access."
                )}
              </p>
              <span className="text-xs px-2 py-1 rounded-full bg-neon-pink/10 text-neon-pink/70 border border-neon-pink/20">
                {t("学信网在线验证", "CHSI Online Verification")}
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("为什么选择 ", "Why Choose ")}
              <span className="gradient-text">Molt.Date</span>
              {t(" ？", "?")}
            </h2>
            <p className="text-white/40 max-w-2xl mx-auto text-base lg:text-lg">
              {t(
                "校园实名 + AI 深度匹配，让相亲回归真诚与科学。",
                "Campus verification + AI deep matching — bringing sincerity and science back to dating."
              )}
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card rounded-2xl p-6 group hover:border-neon-cyan/20 transition-all duration-500"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                    feature.color === "neon-pink"
                      ? "bg-neon-pink/10 text-neon-pink"
                      : "bg-neon-cyan/10 text-neon-cyan"
                  }`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 lg:py-28">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2
              className="text-3xl lg:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("四步找到你的", "Find Your Soulmate")}
              <span className="gradient-text">{t("校园灵魂伴侣", " in 4 Steps")}</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
            {[
              {
                step: "01",
                title: t("注册认证", "Sign Up & Verify"),
                desc: t("使用校园邮箱或学信网完成实名认证", "Verify with campus email or CHSI"),
                icon: "🎓",
              },
              {
                step: "02",
                title: t("完成问卷", "Complete Questionnaire"),
                desc: t("回答 66 个深度问题，构建你的兼容性画像", "Answer 66 deep questions to build your profile"),
                icon: "📝",
              },
              {
                step: "03",
                title: t("AI 分析", "AI Analysis"),
                desc: t("AI 从四大维度分析你的兼容性模型", "AI analyzes your compatibility across 4 dimensions"),
                icon: "🧠",
              },
              {
                step: "04",
                title: t("每周六推送", "Saturday Match"),
                desc: t("每周六收到一位最匹配的约会对象", "Receive your best match every Saturday"),
                icon: "💕",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div
                    className="text-xs font-bold text-neon-cyan/60 tracking-widest mb-2"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    STEP {item.step}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 lg:-right-5 w-6 lg:w-8 h-px bg-gradient-to-r from-neon-pink/40 to-neon-cyan/40" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={RESULT_BG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/60" />
        </div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <h2
              className="text-3xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("准备好了吗？", "Ready?")}
            </h2>
            <p className="text-lg text-white/40 mb-10">
              {t(
                "加入你的校园社区，用 10 分钟回答 66 个问题，让 AI 帮你找到命中注定的那个人。",
                "Join your campus community, spend 10 minutes answering 66 questions, let AI find your destined one."
              )}
            </p>
            {isAuthenticated ? (
              <Link href="/questionnaire">
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-10 py-7 text-lg rounded-xl"
                  style={{ boxShadow: "0 0 30px oklch(0.65 0.28 350 / 40%), 0 0 80px oklch(0.65 0.28 350 / 15%)" }}
                >
                  <Heart className="w-5 h-5 mr-2 group-hover:animate-heartbeat" />
                  {t("立即开始", "Start Now")}
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-10 py-7 text-lg rounded-xl"
                  style={{ boxShadow: "0 0 30px oklch(0.65 0.28 350 / 40%), 0 0 80px oklch(0.65 0.28 350 / 15%)" }}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  {t("注册并认证", "Sign Up & Verify")}
                  <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-neon-pink" />
              <span
                className="text-lg font-bold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                <span className="neon-text-pink">Molt</span>
                <span className="text-white/40">.</span>
                <span className="neon-text-cyan">Date</span>
              </span>
            </div>
            <p className="text-xs text-white/30">
              &copy; 2026 Molt.Date. {t("校园实名制 AI 相亲平台", "Campus-Verified AI Matchmaking Platform")}
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
