import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Download, RefreshCw, Sheet as SheetIcon, Table2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { psychologists, unitBreakdown } from "@/data/mock";

export const Route = createFileRoute("/sync")({
  head: () => ({
    meta: [
      { title: "Синхронізація та експорт даних — психологічна служба" },
      {
        name: "description",
        content:
          "Автоматичне оновлення таблиць після затвердження звітів, експорт у XLSX, CSV, PDF і DOCX та формування місячної звітності.",
      },
      { property: "og:title", content: "Синхронізація та експорт даних" },
      {
        property: "og:description",
        content: "Агент Синхронізації: живі таблиці, експорт і місячні зведення служби.",
      },
    ],
  }),
  component: SyncPage,
});

const syncTables = [
  { name: "Зведення звернень", target: "Google Sheets · Звернення_2026", rows: 243, updated: "09:23", status: "Синхронізовано" },
  { name: "Реєстр звітів", target: "Google Sheets · Звіти_2026", rows: 180, updated: "09:23", status: "Синхронізовано" },
  { name: "Навантаження психологів", target: "Google Sheets · Навантаження", rows: 4, updated: "09:20", status: "Синхронізовано" },
  { name: "Банк кейсів", target: "PostgreSQL · case_bank", rows: 312, updated: "09:12", status: "Очікує" },
];

function SyncPage() {
  const [auto, setAuto] = useState(true);
  const [progress, setProgress] = useState(100);

  const runSync = () => {
    setProgress(15);
    toast.success("Запущено синхронізацію");
    setTimeout(() => setProgress(60), 400);
    setTimeout(() => {
      setProgress(100);
      toast.success("Усі таблиці оновлено");
    }, 1100);
  };

  return (
    <AppShell
      title="Модуль 5 — Синхронізація та експорт даних"
      description="Агент №5 «Агент Синхронізації»: автоматичне оновлення таблиць після затвердження звітів, багатоформатний експорт і місячна звітність."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <RefreshCw className="size-4 text-accent" /> Монітор синхронізації таблиць
            </CardTitle>
            <Button size="sm" variant="outline" onClick={runSync}>
              Синхронізувати зараз
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            <Progress value={progress} className="h-2" />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Таблиця</TableHead>
                  <TableHead>Призначення</TableHead>
                  <TableHead>Рядків</TableHead>
                  <TableHead>Оновлено</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {syncTables.map((t) => (
                  <TableRow key={t.name}>
                    <TableCell className="text-sm">{t.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{t.target}</TableCell>
                    <TableCell className="text-sm">{t.rows}</TableCell>
                    <TableCell className="text-xs">{t.updated}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          t.status === "Синхронізовано"
                            ? "bg-urgency-low/12 text-urgency-low"
                            : "bg-urgency-medium/15 text-urgency-medium"
                        }
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center gap-3 rounded-md border p-3">
              <SheetIcon className="size-4 text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">Автооновлення після затвердження звіту</p>
                <p className="text-xs text-muted-foreground">
                  Зміна звіту автоматично оновлює аналітичні таблиці та дашборди керівництва.
                </p>
              </div>
              <Switch checked={auto} onCheckedChange={setAuto} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Download className="size-4 text-accent" /> Експорт даних
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["XLSX", "CSV", "PDF", "DOCX"].map((f) => (
              <Button
                key={f}
                variant="outline"
                className="w-full justify-start"
                onClick={() => toast.success(`Файл ${f} сформовано та готовий до завантаження`)}
              >
                <Table2 className="size-4" /> Завантажити {f}
              </Button>
            ))}
            <div className="mt-2 space-y-2 rounded-md bg-muted p-3">
              <Label className="text-xs font-semibold uppercase text-muted-foreground">
                Останні вивантаження
              </Label>
              <p className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="size-3.5 text-urgency-low" /> Звіт_вересень.xlsx • 09:24
              </p>
              <p className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="size-3.5 text-urgency-low" /> Зведення_115ОМБр.pdf • 08:50
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Місячне зведення за психологами</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Психолог</TableHead>
                  <TableHead>Спеціалізація</TableHead>
                  <TableHead>Звітів</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {psychologists.map((p, i) => (
                  <TableRow key={p.id}>
                    <TableCell className="text-sm">{p.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.specialization}</TableCell>
                    <TableCell className="text-sm">{12 + i * 3}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Місячне зведення за підрозділами</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {unitBreakdown.map((u) => (
              <div key={u.unit}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{u.unit}</span>
                  <span className="text-muted-foreground">
                    {u.requests} звернень • {u.reports} звітів
                  </span>
                </div>
                <Progress value={(u.reports / u.requests) * 100} className="h-1.5" />
              </div>
            ))}
            <Button
              size="sm"
              className="w-full"
              onClick={() => toast.success("Сформовано офіційний місячний звіт служби")}
            >
              Сформувати місячний звіт служби
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
