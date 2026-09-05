import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CalendarDays, Route as RouteIcon, Wand2 } from "lucide-react";
import { toast } from "sonner";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  eventTypeLabels,
  psychologists,
  scheduleEvents,
  timeUsage,
  workload,
} from "@/data/mock";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Планер та логістика — психологічна служба" },
      {
        name: "description",
        content:
          "Календар заходів, планування маршрутів і часу переїздів, контроль перевантаження та розподіл робочого часу психологів.",
      },
      { property: "og:title", content: "Планер та логістика" },
      {
        property: "og:description",
        content: "Агент Планер: графік, маршрути та контроль навантаження фахівців.",
      },
    ],
  }),
  component: SchedulePage,
});

const days = ["Пн", "Вт", "Ср", "Чт", "Пт"];
const chartColors = ["#4f46e5", "#059669", "#f59e0b", "#ea580c", "#64748b"];

const typeColor: Record<string, string> = {
  consultation: "border-l-accent bg-accent/8",
  group_work: "border-l-urgency-low bg-urgency-low/8",
  travel: "border-l-urgency-high bg-urgency-high/8",
  documentation: "border-l-primary bg-primary/5",
  other: "border-l-muted-foreground bg-muted",
};

function SchedulePage() {
  const [who, setWho] = useState("all");
  const events = scheduleEvents.filter((e) => (who === "all" ? true : e.psychologist === who));
  const totalHours = events.reduce((s, e) => {
    const [sh, sm] = e.start.split(":").map(Number);
    const [eh, em] = e.end.split(":").map(Number);
    return s + (eh! * 60 + em! - (sh! * 60 + sm!)) / 60;
  }, 0);
  const travelHours = events.reduce((s, e) => s + e.travel_hours, 0);

  return (
    <AppShell
      title="Модуль 3 — Логістика та планування графіка"
      description="Агент №3 «Агент Планер»: календар, маршрути й час у дорозі, контроль перевантаження та автоматична генерація розкладу."
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Select value={who} onValueChange={setWho}>
          <SelectTrigger className="h-9 w-64"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Усі психологи</SelectItem>
            {psychologists.map((p) => (
              <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          size="sm"
          onClick={() =>
            toast.success("Згенеровано оптимізований графік", {
              description: "Враховано маршрути, доступність та навантаження",
            })
          }
        >
          <Wand2 className="size-4" /> Згенерувати графік
        </Button>
        <Badge variant="secondary">Загалом {totalHours.toFixed(1)} год</Badge>
        <Badge variant="outline">У дорозі {travelHours.toFixed(1)} год</Badge>
      </div>

      <Tabs defaultValue="week">
        <TabsList>
          <TabsTrigger value="day">День</TabsTrigger>
          <TabsTrigger value="week">Тиждень</TabsTrigger>
          <TabsTrigger value="month">Місяць</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Понеділок, 7 вересня</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {events
                .filter((e) => e.day === "Пн")
                .map((e) => (
                  <div key={e.id} className={`rounded-md border border-l-4 p-3 ${typeColor[e.type]}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs">{e.start}–{e.end}</span>
                      <span className="text-sm font-medium">{e.title}</span>
                      <Badge variant="outline" className="text-[10px]">{eventTypeLabels[e.type]}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {e.psychologist} • {e.location}
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="mt-4">
          <div className="grid gap-3 md:grid-cols-5">
            {days.map((d) => (
              <Card key={d}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">{d}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {events.filter((e) => e.day === d).length === 0 && (
                    <p className="text-xs text-muted-foreground">Заходів немає</p>
                  )}
                  {events
                    .filter((e) => e.day === d)
                    .map((e) => (
                      <div key={e.id} className={`rounded-md border border-l-4 p-2 ${typeColor[e.type]}`}>
                        <p className="font-mono text-[11px]">{e.start}–{e.end}</p>
                        <p className="text-xs font-medium leading-snug">{e.title}</p>
                        <p className="text-[11px] text-muted-foreground">{e.location}</p>
                      </div>
                    ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="month" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="size-4 text-accent" /> Вересень 2026
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
                  const count = (d * 7) % 5;
                  return (
                    <div key={d} className="min-h-16 rounded-md border p-1.5">
                      <span className="text-muted-foreground">{d}</span>
                      {count > 0 && (
                        <div className="mt-1 space-y-0.5">
                          <div className="truncate rounded bg-accent/12 px-1 text-[10px] text-accent">
                            {count} заходи
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <RouteIcon className="size-4 text-accent" /> Планувальник маршрутів
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {scheduleEvents
              .filter((e) => e.type === "travel")
              .map((e) => (
                <div key={e.id} className="rounded-md border p-3 text-sm">
                  <p className="font-medium">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.route}</p>
                  <p className="mt-1 text-xs">Час у дорозі: {e.travel_hours} год</p>
                </div>
              ))}
            <div className="flex gap-2 rounded-md border border-urgency-medium/40 bg-urgency-medium/8 p-2 text-xs">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-urgency-high" />
              Конфлікт доступності: вівторок, 07:00–11:30 перетинається з консультацією о 09:00.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Контроль перевантаження</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workload.map((w) => (
              <div key={w.psychologist}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span>{w.psychologist}</span>
                  <span className="text-muted-foreground">
                    {w.hours} год • дорога {w.travel} год
                  </span>
                </div>
                <Progress value={(w.hours / 50) * 100} className="h-1.5" />
                <p
                  className={`mt-0.5 text-[11px] ${
                    w.risk === "Високий"
                      ? "text-urgency-critical"
                      : w.risk === "Помірний"
                        ? "text-urgency-medium"
                        : "text-urgency-low"
                  }`}
                >
                  Ризик вигорання: {w.risk}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Розподіл робочого часу</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={timeUsage} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                  {timeUsage.map((_, i) => (
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
    </AppShell>
  );
}
