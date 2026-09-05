import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FileText,
  Inbox,
  LayoutDashboard,
  Library,
  Menu,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { profiles, roleLabels } from "@/data/mock";
import { useUnits } from "@/hooks/use-directory";

const nav = [
  { to: "/", label: "Огляд служби", icon: LayoutDashboard },
  { to: "/requests", label: "Заявки", icon: Inbox, agent: "Агент №1" },
  { to: "/reports", label: "Звіти", icon: FileText, agent: "Агент №2" },
  { to: "/schedule", label: "Планер", icon: CalendarDays, agent: "Агент №3" },
  { to: "/analytics", label: "Аналітика", icon: BarChart3, agent: "Агент №4" },
  { to: "/sync", label: "Синхронізація", icon: RefreshCw, agent: "Агент №5" },
  { to: "/knowledge", label: "Банк кейсів", icon: Library, agent: "Агент №6" },
  { to: "/admin", label: "Адміністрування", icon: Settings },
];

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState(profiles[4]!.id);
  const [units] = useUnits();
  const [unitSel, setUnit] = useState("");
  const unit = unitSel || units[0]?.name || "";
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = profiles.find((p) => p.id === profile)!;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const sidebarBody = (mini: boolean) => (
    <>
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <ShieldCheck className="size-6 shrink-0 text-sidebar-primary" />
        {!mini && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-sidebar-accent-foreground">
              Психологічна служба
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/70">
              Інтегрована система
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {nav.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={item.label}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!mini && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
              {!mini && item.agent && (
                <span className="shrink-0 text-[10px] text-sidebar-foreground/60">
                  {item.agent}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col bg-sidebar text-sidebar-foreground transition-[width] duration-200 lg:flex",
          collapsed ? "w-16" : "w-64",
        )}
      >
        {sidebarBody(collapsed)}

        <div className="border-t border-sidebar-border p-2">
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {collapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
            {!collapsed && <span>Згорнути</span>}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-card/95 px-3 backdrop-blur sm:gap-3 sm:px-4">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0 lg:hidden" aria-label="Меню">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-[17rem] flex-col gap-0 bg-sidebar p-0 text-sidebar-foreground"
            >
              {sidebarBody(false)}
            </SheetContent>
          </Sheet>

          <div className="relative hidden max-w-sm flex-1 md:block">
            <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Пошук звернень, звітів, кейсів…"
              className="h-9 pl-8"
            />
          </div>


          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-md border bg-muted px-2.5 py-1.5 lg:flex">
              <Activity className="size-3.5 text-accent" />
              <span className="text-xs text-muted-foreground">Активний підрозділ:</span>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="h-6 w-[150px] border-0 bg-transparent px-1 text-xs shadow-none">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u.id} value={u.name}>
                      {u.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="size-4" />
                  <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-urgency-critical" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Сповіщення</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">Критичне звернення ЗВ-0244</span>
                  <span className="text-xs text-muted-foreground">
                    47 ОМБр • потрібне кризове втручання
                  </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">Звіт ЗВІТ-121 очікує перевірки</span>
                  <span className="text-xs text-muted-foreground">Ірина Бондаренко</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex-col items-start gap-0.5">
                  <span className="text-sm font-medium">Зростання звернень щодо адаптації +18%</span>
                  <span className="text-xs text-muted-foreground">Аналітичний агент</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-9 gap-2">
                  <Brain className="size-4 text-accent" />
                  <span className="hidden text-xs sm:inline">{current.full_name}</span>
                  <Badge variant="secondary" className="hidden text-[10px] md:inline-flex">
                    {roleLabels[current.role]}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Перемикач профілю</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {profiles.map((p) => (
                  <DropdownMenuItem key={p.id} onClick={() => setProfile(p.id)}>
                    <div className="flex flex-col">
                      <span className="text-sm">{p.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {roleLabels[p.role]} • {p.unit}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
          <div className="mb-5">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
