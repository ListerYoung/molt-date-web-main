/**
 * Questionnaire Page - Immersive single-question mode
 * Requires login. Saves answers to database on completion.
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuestionnaire } from "@/contexts/QuestionnaireContext";
import { questions, categories } from "@/data/questions";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  SkipForward,
  Lock,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { useEffect, useState, useRef } from "react";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const QUESTIONNAIRE_BG = "https://private-us-east-1.manuscdn.com/sessionFile/zjkRxQwKWENUjBTLANKz0Y/sandbox/DfiLxrQdE6ZVpS2XW1FnGJ-img-2_1771177135000_na1fn_cXVlc3Rpb25uYWlyZS1iZw.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvemprUnhRd0tXRU5VakJUTEFOS3owWS9zYW5kYm94L0RmaUx4clFkRTZaVnBTMlhXMUZuR0otaW1nLTJfMTc3MTE3NzEzNTAwMF9uYTFmbl9jWFZsYzNScGIyNXVZV2x5WlMxaVp3LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MIW4z95dz~SVpzQejZfuX1ngyG3N2TLRE0y3TMQiDOj1n7bAN-MU~HTzEfiF2XtMpcqyTry2sdtxUBM~Pr--JQcjJeMQf82XBMGWsAv~KnrHT~QuvU1V37Bc5dVBKjqZz89vJXPzMbZeOZWRZ-HB1ziQAKX8e8Ujx8xPeSQDe1e7lo8H44JUsR~~m-612Di2CZvTWTegIWxx58Y7dMFV1PbUqhPRUWjODK19b4L1UpoQfbHeMkQ91x56~bWM88TNE5MVHJrGkoRIZ0WLsQRCdMYjbivoJ33bLpb7CbvtRgOYZOKNME2dOP5Yto4R1xY2PddUi6I09lATBcrNr1mPAw__";

export default function Questionnaire() {
  
  
  //const { user, isAuthenticated, loading: authLoading } = useAuth();
  

// 改成：强制设为已登录，关闭加载态

// 修复重复声明报错
//const { isAuthenticated: _, authLoading: __ } = useAuth();
//const isAuthenticated = true; // 强制已登录
//const authLoading = false;    // 关闭登录加载态

// 完全不拿 useAuth 的值，直接自己定义



// 只保留这4行，删掉所有其他和 skipLogin 相关的 useEffect
const [skipLogin, setSkipLogin] = useState(false); // 初始值必须是 false！
useAuth();
const isAuthenticated = skipLogin;
const authLoading = false;




  const { lang, t } = useLanguage();
  const {
    answers,
    currentQuestion,
    setAnswer,
    nextQuestion,
    prevQuestion,
    getProgress,
    isComplete,
  } = useQuestionnaire();
  const [, navigate] = useLocation();
  const [direction, setDirection] = useState(0);
  const [justSelected, setJustSelected] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const hasSubmittedRef = useRef(false);

  const saveAnswers = trpc.questionnaire.saveAnswers.useMutation({
    onSuccess: () => {
      toast.success(t("问卷已保存", "Questionnaire saved"));
      navigate("/result");
    },
    onError: (err) => {
      toast.error(err.message);
      setSubmitting(false);
    },
  });

  const question = questions[currentQuestion];
  const currentCategory = categories.find((c) => c.id === question.category);
  const progress = getProgress();
  const answeredCount = Object.keys(answers).length;

  useEffect(() => {
    if (isComplete && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      handleSubmit();
    }
  }, [isComplete]);

  // Reset justSelected when question changes
  useEffect(() => {
    setJustSelected(false);
  }, [currentQuestion]);

  const handleSelect = (optionId: string) => {
    setAnswer(question.id, optionId);
    setJustSelected(true);
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setDirection(1);
        nextQuestion();
      }
    }, 500);
  };

  const handlePrev = () => {
    setDirection(-1);
    prevQuestion();
  };

  const handleNext = () => {
    setDirection(1);
    nextQuestion();
  };




  const handleSubmit = () => {
   // if (!isAuthenticated) {
   //   navigate("/result");
   //   return;
   // }
    setSubmitting(true);
    // Convert Record<number, string> to Record<string, string> for tRPC
    const stringAnswers: Record<string, string> = {};
    for (const [key, value] of Object.entries(answers)) {
      stringAnswers[String(key)] = value;
    }
    saveAnswers.mutate({ answers: stringAnswers });
  };





  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 200 : -200,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -200 : 200,
      opacity: 0,
    }),
  };

  const categoryQuestions = questions.filter((q) => q.category === question.category);
  const categoryAnswered = categoryQuestions.filter((q) => answers[q.id]).length;

  // Auth loading state
  if (authLoading) {
    return (
      <Layout particleDensity={15}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
        </div>
      </Layout>
    );
  }

  // Not logged in — show login gate
 if (!isAuthenticated) {
    return (
      <Layout particleDensity={15}>
        <div className="fixed inset-0 z-0">
          <img src={QUESTIONNAIRE_BG} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-8 lg:p-12 max-w-md w-full text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-neon-pink/10 flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-neon-pink" />
            </div>
            <h2
              className="text-2xl font-bold text-white mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("登录后开始问卷", "Sign In to Start")}
            </h2>
            <p className="text-white/40 mb-4 text-sm leading-relaxed">
              {t(
                "完成 66 题深度兼容性问卷需要登录账号。你的答案将被安全保存，用于 AI 匹配分析。",
                "Completing the 66-question deep compatibility questionnaire requires signing in. Your answers will be securely saved for AI matching analysis."
              )}
            </p>
            <p className="text-white/20 text-xs mb-8">
              {t(
                "首次登录将自动创建账号，支持微信、邮箱等方式",
                "First login will automatically create an account"
              )}
            </p>
            <a href={getLoginUrl()}>


              <Button
                className="bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-8 py-5 rounded-xl w-full"
                style={{ boxShadow: "0 0 20px oklch(0.65 0.28 350 / 30%)" }}
              >
                <Heart className="w-5 h-5 mr-2" />
                {t("登录 / 注册", "Sign In / Sign Up")}
              </Button>

</a> 
<Button
  onClick={() => {
    setSkipLogin(true); // 仅这一行，不要加任何跳转/刷新代码
  }}
  className="bg-transparent border border-neon-pink/50 hover:bg-neon-pink/10 text-neon-pink px-8 py-3 text-lg rounded-full mt-4"
>
  测试
</Button>

            
          </motion.div>
        </div>
      </Layout>
  );
 }

  // Submitting state
  if (submitting) {
    return (
      <Layout particleDensity={15}>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Loader2 className="w-10 h-10 text-neon-pink animate-spin" />
          <p className="text-white/50 text-sm">{t("正在保存你的答案…", "Saving your answers...")}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout particleDensity={15}>
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img src={QUESTIONNAIRE_BG} alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-background/90" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col pt-18 sm:pt-20 lg:pt-24 pb-24 sm:pb-8">
        {/* Progress Header */}
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">{currentCategory?.icon}</span>
                <span className="text-[10px] sm:text-xs font-medium text-neon-cyan/80 truncate max-w-[160px] sm:max-w-none">
                  {lang === "zh" ? currentCategory?.zh : currentCategory?.en}
                </span>
                <span className="text-[10px] text-white/20 hidden sm:inline">
                  ({categoryAnswered}/{categoryQuestions.length})
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs text-white/40">
                  {answeredCount}/66 {t("已完成", "done")}
                </span>
                <span
                  className="text-xs sm:text-sm font-bold gradient-text"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {Math.round(progress)}%
                </span>
              </div>
            </div>

            {/* Neon Progress Bar */}
            <div className="relative h-1 sm:h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  background: "linear-gradient(90deg, oklch(0.65 0.28 350), oklch(0.82 0.18 180))",
                  boxShadow: "0 0 10px oklch(0.65 0.28 350 / 50%), 0 0 30px oklch(0.82 0.18 180 / 20%)",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Question Number */}
            <div className="flex items-center gap-2 mt-3 sm:mt-4">
              <span
                className="text-[10px] sm:text-xs text-white/20 font-mono"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Q{String(currentQuestion + 1).padStart(2, "0")} / 66
            </span>
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex items-center justify-center px-4 py-4 sm:py-0">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                {/* Question Text */}
                <motion.h2
                  className="text-xl sm:text-2xl lg:text-4xl font-bold text-white text-center mb-2 sm:mb-3 leading-snug"
                  style={{ fontFamily: "'Space Grotesk', 'Noto Sans SC', sans-serif" }}
                >
                  {lang === "zh" ? question.zh : question.en}
                </motion.h2>

                {/* Bilingual subtitle */}
                <p className="text-center text-white/20 text-xs sm:text-sm mb-6 sm:mb-10">
                  {lang === "zh" ? question.en : question.zh}
                </p>

                {/* Options */}
                <div className="space-y-2 sm:space-y-3">
                  {question.options.map((option, idx) => {
                    const isSelected = answers[question.id] === option.id;
                    return (
                      <motion.button
                        key={option.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.25 }}
                        onClick={() => handleSelect(option.id)}
                        className={`w-full text-left p-3 sm:p-4 lg:p-5 rounded-xl border transition-all duration-300 group ${
                          isSelected
                            ? "border-neon-pink/60 bg-neon-pink/10"
                            : "border-white/8 bg-white/3 hover:border-white/20 hover:bg-white/5"
                        }`}
                        style={
                          isSelected
                            ? { boxShadow: "0 0 15px oklch(0.65 0.28 350 / 15%)" }
                            : undefined
                        }
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                          <div
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 transition-all ${
                              isSelected
                                ? "bg-neon-pink text-white"
                                : "bg-white/5 text-white/40 group-hover:bg-white/10 group-hover:text-white/60"
                            }`}
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {isSelected ? (
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              option.id
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-xs sm:text-sm lg:text-base font-medium transition-colors leading-snug ${
                                isSelected ? "text-white" : "text-white/70 group-hover:text-white/90"
                              }`}
                            >
                              {lang === "zh" ? option.zh : option.en}
                            </div>
                            <div className="text-[10px] sm:text-xs text-white/20 mt-0.5 truncate">
                              {lang === "zh" ? option.en : option.zh}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="fixed bottom-0 left-0 right-0 sm:relative sm:bottom-auto bg-background/80 backdrop-blur-lg sm:bg-transparent sm:backdrop-blur-none border-t border-white/5 sm:border-0 z-20">
          <div className="container">
            <div className="max-w-3xl mx-auto flex items-center justify-between py-3 sm:py-0 sm:pt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentQuestion === 0}
                className="border-white/10 text-white/50 hover:text-white hover:border-white/20 bg-transparent disabled:opacity-20 text-xs sm:text-sm h-9 sm:h-10"
              >
                <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                {t("上一题", "Prev")}
              </Button>

              <div className="flex items-center gap-2 sm:gap-3">
                {!answers[question.id] && currentQuestion < questions.length - 1 && !justSelected && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNext}
                    className="text-white/30 hover:text-white/50 text-[10px] sm:text-xs h-9 sm:h-10"
                  >
                    <SkipForward className="w-3 h-3 mr-0.5 sm:mr-1" />
                    {t("跳过", "Skip")}
                  </Button>
                )}

                {answeredCount >= 60 ? (
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    className="bg-neon-pink hover:bg-neon-pink/90 text-white font-semibold px-4 sm:px-6 text-xs sm:text-sm h-9 sm:h-10"
                    style={{ boxShadow: "0 0 15px oklch(0.65 0.28 350 / 30%)" }}
                  >
                    <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                    {t("查看结果", "Results")}
                  </Button>
                ) : currentQuestion < questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={handleNext}
                    disabled={!answers[question.id]}
                    className="bg-white/10 hover:bg-white/15 text-white disabled:opacity-20 text-xs sm:text-sm h-9 sm:h-10"
                  >
                    {t("下一题", "Next")}
                    <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
