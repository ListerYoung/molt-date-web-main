/**
 * About Page - Molt.Date Story & Mission
 * Design: Storytelling layout with neon accents and glass cards
 */
import { useLanguage } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Shield, Users, Target, Lightbulb, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function About() {
  const { t } = useLanguage();

  const values = [
    {
      icon: Brain,
      title: t("科学匹配", "Scientific Matching"),
      desc: t(
        "基于心理学研究和 AI 算法，从四大维度深度分析兼容性，超越传统的外貌和条件筛选。",
        "Based on psychological research and AI algorithms, deeply analyzing compatibility across four dimensions, beyond traditional appearance and condition screening."
      ),
    },
    {
      icon: Shield,
      title: t("隐私保护", "Privacy Protection"),
      desc: t(
        "采用端到端加密技术，你的个人数据和问卷答案仅用于匹配计算，绝不会被泄露或出售。",
        "Using end-to-end encryption, your personal data and questionnaire answers are only used for matching calculations, never leaked or sold."
      ),
    },
    {
      icon: Target,
      title: t("深度兼容", "Deep Compatibility"),
      desc: t(
        "66 个精心设计的问题涵盖价值观、生活方式、社会观点和亲密关系，确保匹配的深度和准确性。",
        "66 carefully designed questions covering values, lifestyle, social views, and intimate relationships, ensuring depth and accuracy of matching."
      ),
    },
    {
      icon: Users,
      title: t("真实社区", "Authentic Community"),
      desc: t(
        "严格的身份验证和社区管理，确保每一位用户都是真实、认真寻找伴侣的人。",
        "Strict identity verification and community management ensure every user is genuinely seeking a partner."
      ),
    },
    {
      icon: Lightbulb,
      title: t("持续进化", "Continuous Evolution"),
      desc: t(
        "AI 匹配算法持续学习和优化，随着用户反馈不断提升匹配准确率和用户体验。",
        "AI matching algorithms continuously learn and optimize, improving matching accuracy and user experience with user feedback."
      ),
    },
    {
      icon: Heart,
      title: t("用心连接", "Heartfelt Connection"),
      desc: t(
        "我们相信真正的爱情建立在深层兼容性之上，而不仅仅是表面的吸引力。",
        "We believe true love is built on deep compatibility, not just surface attraction."
      ),
    },
  ];

  const team = [
    {
      role: t("创始人 & CEO", "Founder & CEO"),
      desc: t("前 AI 研究员，致力于用技术改变人们的社交方式", "Former AI researcher, dedicated to using technology to change social interactions"),
    },
    {
      role: t("首席算法工程师", "Chief Algorithm Engineer"),
      desc: t("深度学习专家，专注于推荐系统和兼容性匹配算法", "Deep learning expert, focused on recommendation systems and compatibility matching"),
    },
    {
      role: t("产品设计总监", "Product Design Director"),
      desc: t("用户体验设计专家，曾服务于多家知名互联网公司", "UX design expert, previously served at several well-known internet companies"),
    },
  ];

  return (
    <Layout particleDensity={25}>
      {/* Hero */}
      <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1
                className="text-4xl lg:text-5xl font-bold text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t("关于 ", "About ")}
                <span className="gradient-text">Molt.Date</span>
              </h1>
              <p className="text-lg text-white/40 leading-relaxed mb-4">
                {t(
                  "Molt.Date 诞生于一个简单的信念：真正的爱情不应该靠运气，而应该靠理性和科学。我们相信，通过深度了解一个人的价值观、生活方式和关系期待，AI 可以帮助人们找到真正兼容的灵魂伴侣。",
                  "Molt.Date was born from a simple belief: true love shouldn't rely on luck, but on reason and science. We believe that by deeply understanding a person's values, lifestyle, and relationship expectations, AI can help people find truly compatible soulmates."
                )}
              </p>
              <p className="text-base text-white/30">
                {t(
                  '"Molt" 意为蜕变——我们帮助你蜕去表面的伪装，展现真实的自我，找到与你灵魂共振的人。',
                  '"Molt" means transformation — we help you shed surface pretenses, reveal your true self, and find someone who resonates with your soul.'
                )}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-white text-center mb-12"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("我们的理念", "Our Values")}
          </motion.h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:border-neon-cyan/20 transition-all duration-500"
              >
                <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 flex items-center justify-center mb-4">
                  <item.icon className="w-5 h-5 text-neon-cyan" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Questionnaire */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8 lg:p-12"
            >
              <h2
                className="text-2xl lg:text-3xl font-bold text-white mb-6"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {t("66 题深度问卷", "66 Deep Questions")}
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: "💎",
                    title: t("价值观与人生观", "Values & Life Philosophy"),
                    count: "15",
                    desc: t("探索你对人生、婚姻、家庭的核心信念", "Explore your core beliefs about life, marriage, and family"),
                  },
                  {
                    icon: "🌃",
                    title: t("生活方式与习惯", "Lifestyle & Habits"),
                    count: "10",
                    desc: t("了解你的日常偏好和生活节奏", "Understand your daily preferences and life rhythm"),
                  },
                  {
                    icon: "🌐",
                    title: t("社会观点与态度", "Social Views & Attitudes"),
                    count: "10",
                    desc: t("洞察你对社会议题的立场和态度", "Insight into your stance on social issues"),
                  },
                  {
                    icon: "💫",
                    title: t("亲密关系与偏好", "Intimate Relationships"),
                    count: "31",
                    desc: t("深入了解你在亲密关系中的期待和需求", "Deep understanding of your expectations in intimate relationships"),
                  },
                ].map((dim, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 p-4 rounded-xl bg-white/3 border border-white/5"
                  >
                    <span className="text-2xl">{dim.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white">{dim.title}</h4>
                        <span className="text-xs text-neon-cyan/60 font-mono">{dim.count}Q</span>
                      </div>
                      <p className="text-xs text-white/30">{dim.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link href="/questionnaire">
                <Button
                  className="bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-8 py-6 text-base rounded-xl"
                  style={{ boxShadow: "0 0 20px oklch(0.65 0.28 350 / 30%)" }}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  {t("开始测试", "Start Test")}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-bold text-white text-center mb-12"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("核心团队", "Core Team")}
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-pink/20 to-neon-cyan/20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-7 h-7 text-white/40" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{member.role}</h3>
                <p className="text-xs text-white/35">{member.desc}</p>
              </motion.div>
            ))}
          </div>
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
              &copy; 2026 Molt.Date. {t("用理性找到感性。", "Find emotion through reason.")}
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
