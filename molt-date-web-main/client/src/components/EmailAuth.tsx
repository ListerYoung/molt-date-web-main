import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Mail, CheckCircle2, XCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import Layout from '@/components/Layout';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function EmailAuth() {
  const [, navigate] = useLocation();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [countdown, setCountdown] = useState(0);

  const sendCodeMutation = trpc.auth.sendCode.useMutation();
  const verifyCodeMutation = trpc.auth.verifyCode.useMutation({
    onSuccess: () => {
      navigate('/');
    },
  });

  // 倒计时逻辑
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!email) return;

    const result = await sendCodeMutation.mutateAsync({ email });
    if (result.success) {
      setStep('verification');
      setCountdown(60); // 60秒倒计时
    }
  };

  const handleVerifyCode = async () => {
    if (!email || !code) return;

    await verifyCodeMutation.mutateAsync({ email, code });
  };

  const handleResendCode = () => {
    setCode('');
    handleSendCode();
  };

  return (
    <Layout>
      <div className="container pt-24 pb-16 lg:pt-32 relative z-10 flex items-center justify-center min-h-[80vh]">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="glass-card p-6 sm:p-8">
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <motion.div variants={fadeIn} className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-pink/10 flex items-center justify-center">
                  <Mail className="w-8 h-8 text-neon-pink" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  {t('邮箱登录', 'Email Login')}
                </h1>
                <p className="text-white/60">
                  {t('使用邮箱验证码登录，未注册用户将自动注册', 'Login with email verification code, new users will be automatically registered')}
                </p>
              </motion.div>

              {sendCodeMutation.error && (
                <motion.div variants={fadeIn} className="mb-4">
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>{t('发送失败', 'Failed')}</AlertTitle>
                    <AlertDescription>
                      {t('验证码发送失败，请重试', 'Failed to send verification code, please try again')}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {verifyCodeMutation.error && (
                <motion.div variants={fadeIn} className="mb-4">
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>{t('验证失败', 'Failed')}</AlertTitle>
                    <AlertDescription>
                      {t('验证码无效或已过期', 'Verification code is invalid or expired')}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {step === 'email' ? (
                <motion.div variants={fadeIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      {t('邮箱地址', 'Email Address')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('请输入邮箱地址', 'Please enter your email')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                        disabled={sendCodeMutation.isPending}
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSendCode}
                    disabled={!email || sendCodeMutation.isPending}
                    className="w-full bg-neon-pink hover:bg-neon-pink/90 text-white"
                  >
                    {sendCodeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('发送中...', 'Sending...')}
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {t('发送验证码', 'Send Verification Code')}
                      </>
                    )}
                  </Button>
                </motion.div>
              ) : (
                <motion.div variants={fadeIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      {t('邮箱地址', 'Email Address')}
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="code" className="text-white">
                      {t('验证码', 'Verification Code')}
                    </Label>
                    <Input
                      id="code"
                      type="text"
                      placeholder={t('请输入6位验证码', 'Please enter 6-digit code')}
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      disabled={verifyCodeMutation.isPending}
                    />
                  </div>

                  <div className="flex justify-between items-center text-sm text-white/60">
                    <span>{t('验证码已发送到您的邮箱', 'Verification code has been sent to your email')}</span>
                    <button
                      onClick={handleResendCode}
                      disabled={countdown > 0}
                      className={`${countdown > 0 ? 'text-white/30 cursor-not-allowed' : 'text-neon-cyan hover:text-neon-cyan/80'}`}
                    >
                      {countdown > 0 ? `${t('重新发送', 'Resend')} (${countdown}s)` : t('重新发送', 'Resend')}
                    </button>
                  </div>

                  <Button
                    onClick={handleVerifyCode}
                    disabled={!code || code.length !== 6 || verifyCodeMutation.isPending}
                    className="w-full bg-neon-pink hover:bg-neon-pink/90 text-white"
                  >
                    {verifyCodeMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('验证中...', 'Verifying...')}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {t('验证登录', 'Verify & Login')}
                      </>
                    )}
                  </Button>
                </motion.div>
              )}

              <motion.div variants={fadeIn} className="mt-6 text-center">
                <button
                  onClick={() => setStep('email')}
                  className="text-sm text-neon-cyan hover:text-neon-cyan/80"
                >
                  {t('更换邮箱', 'Change Email')}
                </button>
              </motion.div>
            </motion.div>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
