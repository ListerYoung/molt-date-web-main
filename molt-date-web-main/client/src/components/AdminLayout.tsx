import { trpc } from "@/lib/trpc";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  FileText,
  Brain,
  Link2,
  Settings,
  LogOut,
  PanelLeft,
  ArrowLeft,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Loader2 } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "仪表盘", path: "/admin" },
  { icon: Users, label: "用户管理", path: "/admin/users" },
  { icon: ClipboardList, label: "问卷管理", path: "/admin/questions" },
  { icon: FileText, label: "答题记录", path: "/admin/records" },
  { icon: Brain, label: "画像分析", path: "/admin/personality" },
  { icon: Link2, label: "推送管理", path: "/admin/matching" },
  { icon: Settings, label: "系统设置", path: "/admin/settings" },
];

const SIDEBAR_WIDTH_KEY = "admin-sidebar-width";
const DEFAULT_WIDTH = 240;
const MIN_WIDTH = 200;
const MAX_WIDTH = 360;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const [, setLocation] = useLocation();

  // Use independent admin session check (no OAuth dependency)
  const sessionQuery = trpc.admin.checkSession.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  // Loading state
  if (sessionQuery.isLoading) {
    return <DashboardLayoutSkeleton />;
  }

  // Not authenticated or not admin -> redirect to admin login
  if (!sessionQuery.data?.authenticated || !sessionQuery.data?.isAdmin) {
    // Redirect to admin login page
    setLocation("/admin/login");
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <AdminLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  );
}

function AdminLayoutContent({
  children,
  setSidebarWidth,
}: {
  children: React.ReactNode;
  setSidebarWidth: (w: number) => void;
}) {
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/admin/login";
    },
  });

  // Find active menu item
  const activeMenuItem = menuItems.find((item) => {
    if (item.path === "/admin") return location === "/admin";
    return location.startsWith(item.path);
  });

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const sidebarLeft =
        sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };
    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-14 justify-center">
            <div className="flex items-center gap-3 px-2 transition-all w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none shrink-0"
                aria-label="Toggle navigation"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed && (
                <span className="font-semibold text-sm tracking-tight truncate text-foreground">
                  Molt.Date 管理后台
                </span>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0">
            <SidebarMenu className="px-2 py-1">
              {menuItems.map((item) => {
                const isActive =
                  item.path === "/admin"
                    ? location === "/admin"
                    : location.startsWith(item.path);
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => setLocation(item.path)}
                      tooltip={item.label}
                      className="h-9 transition-all font-normal text-sm"
                    >
                      <item.icon
                        className={`h-4 w-4 ${isActive ? "text-primary" : ""}`}
                      />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-1 py-1 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none">
                  <Avatar className="h-8 w-8 border shrink-0">
                    <AvatarFallback className="text-xs font-medium">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-medium truncate leading-none">
                      管理员
                    </p>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      Admin
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => (window.location.href = "/")}
                  className="cursor-pointer"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回前台
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logoutMutation.mutate()}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-12 items-center bg-background/95 px-2 backdrop-blur sticky top-0 z-40">
            <SidebarTrigger className="h-8 w-8 rounded-lg" />
            <span className="ml-2 text-sm font-medium text-foreground">
              {activeMenuItem?.label ?? "管理后台"}
            </span>
          </div>
        )}
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
