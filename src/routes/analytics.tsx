import { createFileRoute } from "@tanstack/react-router";
import { Database, PlugZap, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  categoryBreakdown,
  monthlyDynamics,
  unitBreakdown,
  workload,
} from "@/data/mock";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Аналітичний центр — психологічна служба" },
      {
        name: "description",
        content:
          "Динаміка звернень, розподіл за підрозділами й категоріями, ефективність психологів та автоматичні аналітичні інсайти.",
      },
      { property: "og:title", content: "Аналітичний центр служби" },
      {
        property: "og:description",
        content: "Агент Аналітики: дашборди, тренди та інсайти для керівництва служби.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const chartColors = ["#4f46e5", "#059669", "#f59e0b", "#ea580c", "#64748b", "#e11d48"];

const insights = [
  "Кількість звернень щодо адаптації зросла на 18% порівняно з попереднім місяцем.",
  "Частка критичних звернень у 47 ОМБр перевищує середню по службі на 6 в.п.",
  "Час опрацювання звернення скоротився з 3,2 до 2,4 доби.",
  "Навантаження Олени Ковальчук перевищує норму на 12% — рекомендовано перерозподіл.",
];

function AnalyticsPage() {
  return (
    <AppShell
      title="Модуль 4 — Аналітичний центр керівництва"
      description="Агент №4 «Агент Аналітичний Дашборд»: динаміка звернень, географія, підрозділи, тематика, ефективність та інсайти."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Динаміка звернень за місяцями</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyDynamics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="requests" name="Звернення" stroke="#4f46e5" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" name="Опрацьовано" stroke="#059669" strokeWidth={2} />
                <Line type="monotone" dataKey="critical" name="Критичні" stroke="#e11d48" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="size-4 text-accent" /> Інсайти агента
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {insights.map((i) => (
              <div key={i} className="rounded-md border border-accent/25 bg-accent/6 p-2.5 text-xs">
                {i}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Розподіл за підрозділами</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="unit" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="requests" name="Звернення" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reports" name="Звіти" fill="#059669" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Тематичні категорії</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryBreakdown} dataKey="value" nameKey="name" outerRadius={90}>
                  {categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={chartColors[i % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Ефективність та навантаження психологів</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Психолог</TableHead>
                  <TableHead>Годин роботи</TableHead>
                  <TableHead>Годин у дорозі</TableHead>
                  <TableHead>Ризик вигорання</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workload.map((w) => (
                  <TableRow key={w.psychologist}>
                    <TableCell className="text-sm">{w.psychologist}</TableCell>
                    <TableCell className="text-sm">{w.hours}</TableCell>
                    <TableCell className="text-sm">{w.travel}</TableCell>
                    <TableCell>
                      <Badge
                        variant={w.risk === "Високий" ? "destructive" : "secondary"}
                        className="text-[10px]"
                      >
                        {w.risk}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <PlugZap className="size-4 text-accent" /> Конектор Power BI / PostgreSQL
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Статус підключення</span>
              <Badge className="bg-urgency-low/12 text-urgency-low">Активне</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Останнє оновлення</span>
              <span className="text-xs">05.09.2026, 09:23</span>
            </div>
            <div className="rounded-md bg-muted p-2 font-mono text-[11px] leading-relaxed text-muted-foreground">
              <p>[09:23] SELECT * FROM v_requests_monthly — 84 ms</p>
              <p>[09:23] Індекс idx_requests_created — використано</p>
              <p>[09:24] Оптимізовано JOIN reports × units</p>
            </div>
            <div className="flex items-center gap-2">
              <Database className="size-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Схема: public • 9 таблиць</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => toast.success("Налаштування експорту оновлено")}
            >
              Налаштування експорту
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
