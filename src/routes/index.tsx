import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  FileText,
  Inbox,
  Library,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, UrgencyBadge } from "@/components/StatusBadges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  monthlyDynamics,
  reports,
  requests,
  scheduleEvents,
  caseBank,
} from "@/data/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Система психологічної служби — огляд" },
      {
        name: "description",
        content:
          "Інтегрована система психологічної служби: звернення, звіти, планування, аналітика та банк кейсів в одному робочому просторі.",
      },
      { property: "og:title", content: "Система психологічної служби — огляд" },
      {
        property: "og:description",
        content:
          "Єдиний робочий простір психологічної служби: заявки, звіти, планер, аналітика, банк кейсів.",
      },
    ],
  }),
  component: Index,
});

const agents = [
  { to: "/requests", icon: Inbox, name: "Агент Заявок", desc: "Структурування, уточнення, категоризація" },
  { to: "/reports", icon: FileText, name: "Агент Звітів", desc: "Якість, структура, експорт документів" },
  { to: "/schedule", icon: CalendarDays, name: "Агент Планер", desc: "Маршрути, графік, контроль навантаження" },
  { to: "/analytics", icon: BarChart3, name: "Агент Аналітики", desc: "Дашборди, тренди, інсайти" },
  { to: "/sync", icon: RefreshCw, name: "Агент Синхронізації", desc: "Таблиці, експорт, місячні звіти" },
  { to: "/knowledge", icon: Library, name: "Агент Класифікатор", desc: "Таксономія, схожі кейси, пошук" },
];

function Index() {
  const openRequests = requests.filter((r) => r.status !== "completed" && r.status !== "cancelled");
  const critical = requests.filter((r) => r.urgency === "critical" || r.urgency === "high");
  const pendingReports = reports.filter((r) => r.status === "submitted" || r.status === "draft");

  return (
    <AppShell
      title="Огляд служби"
      description="Зведений стан звернень, звітів, навантаження та роботи шести інтегрованих ШІ-агентів."
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Активні звернення" value={openRequests.length} hint="з 8 загалом" icon={Inbox} />
        <StatCard label="Пріоритетні випадки" value={critical.length} hint="висока та критична терміновість" icon={AlertTriangle} />
        <StatCard label="Звіти на опрацюванні" value={pendingReports.length} hint="чернетки та подані" icon={FileText} />
        <StatCard label="Записів у банку кейсів" value={caseBank.length} hint="6 категорій" icon={Library} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Останні звернення</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {requests.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="rounded-md border bg-muted/40 px-3 py-2 sm:flex sm:items-center sm:gap-3"
              >
                <span className="font-mono text-xs text-muted-foreground">{r.code}</span>
                <span className="mt-0.5 block text-sm sm:mt-0 sm:min-w-0 sm:flex-1 sm:truncate">
                  {r.structured_text}
                </span>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 sm:mt-0 sm:shrink-0">
                  <span className="text-xs text-muted-foreground">{r.unit}</span>
                  <UrgencyBadge urgency={r.urgency} />
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
            <Link to="/requests" className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-accent">
              Перейти до модуля заявок <ArrowUpRight className="size-3" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Динаміка звернень</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {monthlyDynamics.map((m) => (
              <div key={m.month}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-muted-foreground">{m.month}</span>
                  <span className="font-medium">{m.requests}</span>
                </div>
                <Progress value={(m.requests / 70) * 100} className="h-1.5" />
              </div>
            ))}
            <div className="flex items-start gap-2 rounded-md bg-accent/8 p-2 text-xs text-accent">
              <TrendingUp className="mt-0.5 size-3.5 shrink-0" />
              Кількість звернень щодо адаптації зросла на 18% за останній місяць.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {agents.map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="rounded-md bg-accent/10 p-2 text-accent">
                  <a.icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{a.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Найближчі заходи</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-2">
          {scheduleEvents.slice(0, 6).map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
              <span className="font-mono text-xs text-muted-foreground">
                {e.day} {e.start}
              </span>
              <span className="min-w-0 flex-1 truncate">{e.title}</span>
              <span className="text-xs text-muted-foreground">{e.psychologist}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          <p className="text-[11px] text-muted-foreground">{hint}</p>
        </div>
        <div className="rounded-md bg-primary/5 p-2 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
