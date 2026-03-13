/**
 * Profile Page - User personal center
 * Features: avatar, nickname, university, verification status, bio, wechat
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { BadgeCheck, GraduationCap, Mail, User, Shield, Pencil, Save, X, MessageSquare, QrCode, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Profile() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const { t } = useLanguage();

  const profileQuery = trpc.profile.get.useQuery(undefined, { enabled: isAuthenticated });
  const updateProfile = trpc.profile.update.useMutation({
    onSuccess: () => {
      toast.success(t("个人资料已更新", "Profile updated"));
      profileQuery.refetch();
      setEditing(false);
    },
    onError: (err) => toast.error(err.message),
  });
  const submitCampusEmail = trpc.profile.submitCampusEmail.useMutation({
    onSuccess: (data) => {
      toast.success(t(`已认证为 ${data.university}`, `Verified as ${data.university}`));
      profileQuery.refetch();
      setShowVerifyModal(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const [editing, setEditing] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [campusEmail, setCampusEmail] = useState("");
  const [form, setForm] = useState({
    nickname: "",
    gender: "" as "male" | "female" | "other" | "",
    birthYear: 0,
    university: "",
    major: "",
    graduationYear: 0,
    bio: "",
    wechatId: "",
  });

  const profile = profileQuery.data;

  useEffect(() => {
    if (profile) {
      setForm({
        nickname: profile.nickname || "",
        gender: (profile.gender as "male" | "female" | "other") || "",
        birthYear: profile.birthYear || 0,
        university: profile.university || "",
        major: profile.major || "",
        graduationYear: profile.graduationYear || 0,
        bio: profile.bio || "",
        wechatId: profile.wechatId || "",
      });
    }
  }, [profile]);

  const handleSave = () => {
    const data: Record<string, unknown> = {};
    if (form.nickname) data.nickname = form.nickname;
    if (form.gender) data.gender = form.gender;
    if (form.birthYear > 0) data.birthYear = form.birthYear;
    if (form.major) data.major = form.major;
    if (form.graduationYear > 0) data.graduationYear = form.graduationYear;
    if (form.bio) data.bio = form.bio;
    if (form.wechatId) data.wechatId = form.wechatId;
    updateProfile.mutate(data as any);
  };

  const verificationStatus = profile?.verificationStatus || "unverified";
  const isVerified = verificationStatus === "verified";

  return (
    <Layout particleDensity={20}>
      <div className="container pt-24 pb-16 lg:pt-32 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-2xl lg:text-3xl font-bold text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("个人中心", "My Profile")}
            </h1>
            {!editing ? (
              <Button
                onClick={() => setEditing(true)}
                variant="outline"
                className="border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 bg-transparent"
              >
                <Pencil className="w-4 h-4 mr-2" />
                {t("编辑", "Edit")}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="bg-neon-pink hover:bg-neon-pink/90 text-white"
                  disabled={updateProfile.isPending}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {t("保存", "Save")}
                </Button>
                <Button
                  onClick={() => setEditing(false)}
                  variant="outline"
                  className="border-white/20 text-white/60 bg-transparent"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="glass-card rounded-2xl p-6 lg:p-8 mb-6">
            {/* Avatar & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center text-3xl font-bold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {(form.nickname || user?.name || "?")[0]?.toUpperCase()}
              </div>
              <div>
                {editing ? (
                  <input
                    value={form.nickname}
                    onChange={e => setForm(f => ({ ...f, nickname: e.target.value }))}
                    placeholder={t("输入昵称", "Enter nickname")}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-lg font-semibold focus:border-neon-cyan/50 outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-semibold text-white">{form.nickname || user?.name || t("未设置", "Not set")}</h2>
                )}
                <p className="text-sm text-white/40 mt-1">{user?.email || ""}</p>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="mb-6">
              {isVerified ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <BadgeCheck className="w-5 h-5 text-green-400" />
                  <span className="text-sm font-medium text-green-400">
                    {t("已认证", "Verified")} · {profile?.university}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">
                      {t("未认证 — 需要校园认证才能使用匹配功能", "Not verified — campus verification required for matching")}
                    </span>
                  </div>
                  <Button
                    onClick={() => setShowVerifyModal(true)}
                    size="sm"
                    className="bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 border border-neon-cyan/30"
                  >
                    {t("去认证", "Verify")}
                  </Button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FieldRow
                  label={t("性别", "Gender")}
                  icon={<User className="w-4 h-4" />}
                  editing={editing}
                  value={form.gender === "male" ? t("男", "Male") : form.gender === "female" ? t("女", "Female") : form.gender === "other" ? t("其他", "Other") : t("未设置", "Not set")}
                >
                  <select
                    value={form.gender}
                    onChange={e => setForm(f => ({ ...f, gender: e.target.value as any }))}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan/50 outline-none w-full"
                  >
                    <option value="">{t("请选择", "Select")}</option>
                    <option value="male">{t("男", "Male")}</option>
                    <option value="female">{t("女", "Female")}</option>
                    <option value="other">{t("其他", "Other")}</option>
                  </select>
                </FieldRow>

                <FieldRow
                  label={t("出生年份", "Birth Year")}
                  icon={<User className="w-4 h-4" />}
                  editing={editing}
                  value={form.birthYear > 0 ? String(form.birthYear) : t("未设置", "Not set")}
                >
                  <input
                    type="number"
                    value={form.birthYear || ""}
                    onChange={e => setForm(f => ({ ...f, birthYear: Number(e.target.value) }))}
                    placeholder="2000"
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan/50 outline-none w-full"
                  />
                </FieldRow>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldRow
                  label={t("学校", "University")}
                  icon={<GraduationCap className="w-4 h-4" />}
                  editing={false}
                  value={form.university || t("通过认证自动填写", "Auto-filled after verification")}
                >
                  <span />
                </FieldRow>

                <FieldRow
                  label={t("专业", "Major")}
                  icon={<GraduationCap className="w-4 h-4" />}
                  editing={editing}
                  value={form.major || t("未设置", "Not set")}
                >
                  <input
                    value={form.major}
                    onChange={e => setForm(f => ({ ...f, major: e.target.value }))}
                    placeholder={t("输入专业", "Enter major")}
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan/50 outline-none w-full"
                  />
                </FieldRow>
              </div>

              <FieldRow
                label={t("个人简介", "Bio")}
                icon={<MessageSquare className="w-4 h-4" />}
                editing={editing}
                value={form.bio || t("未设置", "Not set")}
              >
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder={t("介绍一下自己吧…", "Tell us about yourself...")}
                  rows={3}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan/50 outline-none w-full resize-none"
                />
              </FieldRow>

              <FieldRow
                label={t("微信号", "WeChat ID")}
                icon={<QrCode className="w-4 h-4" />}
                editing={editing}
                value={form.wechatId || t("未设置", "Not set")}
              >
                <input
                  value={form.wechatId}
                  onChange={e => setForm(f => ({ ...f, wechatId: e.target.value }))}
                  placeholder={t("输入微信号", "Enter WeChat ID")}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-neon-cyan/50 outline-none w-full"
                />
              </FieldRow>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Email Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-2">
              {t("校园邮箱认证", "Campus Email Verification")}
            </h3>
            <p className="text-sm text-white/40 mb-6">
              {t(
                "输入你的校园邮箱（@zju.edu.cn / @tsinghua.edu.cn / @pku.edu.cn / @fudan.edu.cn）",
                "Enter your campus email (@zju.edu.cn / @tsinghua.edu.cn / @pku.edu.cn / @fudan.edu.cn)"
              )}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-neon-cyan" />
              <input
                value={campusEmail}
                onChange={e => setCampusEmail(e.target.value)}
                placeholder="yourname@zju.edu.cn"
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:border-neon-cyan/50 outline-none flex-1"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => submitCampusEmail.mutate({ campusEmail })}
                className="bg-neon-cyan text-background hover:bg-neon-cyan/90 flex-1"
                disabled={submitCampusEmail.isPending || !campusEmail}
              >
                <BadgeCheck className="w-4 h-4 mr-2" />
                {submitCampusEmail.isPending ? t("认证中…", "Verifying...") : t("提交认证", "Submit")}
              </Button>
              <Button
                onClick={() => setShowVerifyModal(false)}
                variant="outline"
                className="border-white/20 text-white/60 bg-transparent"
              >
                {t("取消", "Cancel")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

// Reusable field row component
function FieldRow({
  label,
  icon,
  editing,
  value,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  editing: boolean;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-white/30">{icon}</span>
        <span className="text-xs font-medium text-white/50">{label}</span>
      </div>
      {editing ? children : (
        <p className="text-sm text-white/80 pl-6">{value}</p>
      )}
    </div>
  );
}
