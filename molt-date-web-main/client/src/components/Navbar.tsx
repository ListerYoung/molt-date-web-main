/**
 * Navbar Component - Cyberpunk Neon Style
 * Updated: Auth-aware navigation with login/register and profile
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, Globe, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: t("首页", "Home") },
    { href: "/questionnaire", label: t("开始匹配", "Questionnaire") },
    { href: "/match", label: t("AI 匹配", "AI Match") },
    { href: "/about", label: t("关于我们", "About") },
  ];

  const handleLogout = async () => {
    setProfileDropdown(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="glass-card border-b border-white/5">
        <div className="container flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Heart className="w-7 h-7 text-neon-pink group-hover:animate-heartbeat transition-all" />
              <div className="absolute inset-0 blur-md bg-neon-pink/30 group-hover:bg-neon-pink/50 transition-all" />
            </div>
            <span
              className="text-xl lg:text-2xl font-bold tracking-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <span className="neon-text-pink">Molt</span>
              <span className="text-white/60">.</span>
              <span className="neon-text-cyan">Date</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 relative group ${
                  location === link.href
                    ? "neon-text-cyan"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {link.label}
                {location === link.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan rounded-full"
                    style={{ boxShadow: "0 0 8px oklch(0.82 0.18 180 / 60%)" }}
                  />
                )}
              </Link>
            ))}

            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === "zh" ? "en" : "zh")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-neon-cyan/50 text-white/60 hover:text-white text-xs font-medium transition-all duration-300"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === "zh" ? "EN" : "中文"}
            </button>

            {/* Auth Area */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-pink/30 bg-neon-pink/5 hover:bg-neon-pink/10 transition-all duration-300"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-pink to-neon-cyan flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/80 max-w-[80px] truncate">
                    {user?.name || t("我的", "Me")}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-white/40 transition-transform ${profileDropdown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -5, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 glass-card rounded-xl border border-white/10 py-2 shadow-xl"
                    >
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
                      >
                        <User className="w-4 h-4" />
                        {t("个人中心", "My Profile")}
                      </Link>
                      <div className="h-px bg-white/5 mx-3 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:text-red-400 hover:bg-white/5 transition-all w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t("退出登录", "Log Out")}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                href={getLoginUrl()}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-neon-pink/10 border border-neon-pink/30 hover:bg-neon-pink/20 text-neon-pink text-xs font-semibold transition-all duration-300"
                style={{ boxShadow: "0 0 10px oklch(0.65 0.28 350 / 15%)" }}
              >
                <User className="w-3.5 h-3.5" />
                {t("登录 / 注册", "Sign In")}
              </a>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white/60 hover:text-white transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden glass-card border-b border-white/5"
          >
            <div className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm font-medium py-2 px-3 rounded-lg transition-all ${
                    location === link.href
                      ? "neon-text-cyan bg-white/5"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Auth */}
              {isAuthenticated ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all"
                  >
                    <User className="w-4 h-4" />
                    {t("个人中心", "My Profile")}
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    {t("退出登录", "Log Out")}
                  </button>
                </>
              ) : (
                <a
                  href={getLoginUrl()}
                  className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-lg text-neon-pink hover:bg-white/5 transition-all"
                >
                  <User className="w-4 h-4" />
                  {t("登录 / 注册", "Sign In")}
                </a>
              )}

              <button
                onClick={() => {
                  setLang(lang === "zh" ? "en" : "zh");
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 py-2 px-3 text-white/60 hover:text-white text-sm font-medium transition-all"
              >
                <Globe className="w-4 h-4" />
                {lang === "zh" ? "Switch to English" : "切换到中文"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
