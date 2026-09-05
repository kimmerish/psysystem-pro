import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  FileText,
  ScanText,
  Tags,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ReportStatusBadge } from "@/components/StatusBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { reports } from "@/data/mock";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Звіти та контроль якості — психологічна служба" },
      {
        name: "description",
        content:
          "Робоче середовище підготовки звітів: перевірка стилю, структури, фільтр непсихологічних даних, аналіз слабких місць та експорт документів.",
      },
      { property: "og:title", content: "Звіти та контроль якості" },
      {
        property: "og:description",
        content: "Агент Звітів: якість, структура та експорт службової документації.",
      },
    ],
  }),
  component: ReportsPage,
});

const nonPsychMarkers = ["генератор", "паливо", "автомобіл", "ремонт", "склад", "боєкомплект"];

function ReportsPage() {
  const [goal, setGoal] = useState(
    "Оцінити рівень емоційного виснаження особового складу після ротації.",
  );
  const [work, setWork] = useState("Проведено бесіду. Замінено генератор у наметі служби.");
  const [results, setResults] = useState("");
  const [recommendations, setRecommendations] = useState("");

  const analysis = useMemo(() => {
    const issues: { type: "style" | "structure" | "filter" | "weak"; text: string }[] = [];
    if (!goal.trim()) issues.push({ type: "structure", text: "Відсутній розділ «Мета»." });
    if (!work.trim()) issues.push({ type: "structure", text: "Відсутній розділ «Опис роботи»." });
    if (!results.trim()) issues.push({ type: "structure", text: "Відсутній розділ «Результати»." });
    if (!recommendations.trim())
      issues.push({ type: "structure", text: "Відсутній розділ «Рекомендації»." });

    const all = `${goal} ${work} ${results} ${recommendations}`.toLowerCase();
    nonPsychMarkers.forEach((m) => {
      if (all.includes(m))
        issues.push({
          type: "filter",
          text: `Виявлено непсихологічні дані («${m}»). Рекомендовано вилучити з психологічного звіту.`,
        });
    });

    if (/проведено бесіду\.?/i.test(work) && work.trim().length < 90)
      issues.push({
        type: "weak",
        text: "«Проведено бесіду» — з ким? Щодо чого? Який результат? Деталізуйте.",
      });
    if (/(жах|кошмар|тупо|нормально так)/i.test(all))
      issues.push({ type: "style", text: "Неприйнятний тон формулювання для службового документа." });
    if (all.includes("  ")) issues.push({ type: "style", text: "Подвійні пробіли у тексті." });

    const score = Math.max(0, 100 - issues.length * 14);
    return { issues, score };
  }, [goal, work, results, recommendations]);

  const tags = useMemo(() => {
    const source = `${goal} ${work} ${results}`.toLowerCase();
    const found: string[] = [];
    if (source.includes("ротац")) found.push("ротація");
    if (source.includes("виснаж") || source.includes("стрес")) found.push("бойовий стрес");
    if (source.includes("бесід")) found.push("індивідуальна робота");
    if (source.includes("груп")) found.push("групова робота");
    if (source.includes("алкогол")) found.push("адиктивна поведінка");
    return found.length ? found : ["без тегів"];
  }, [goal, work, results]);

  return (
    <AppShell
      title="Модуль 2 — Звітність та контроль якості"
      description="Агент №2 «Агент Звітів»: перевірка граматики й стилю, валідація структури, фільтр непсихологічних даних, аналіз слабких місць, експорт та авто-теги."
    >
      <Tabs defaultValue="workspace">
        <TabsList>
          <TabsTrigger value="workspace">Робоче середовище</TabsTrigger>
          <TabsTrigger value="registry">Реєстр звітів</TabsTrigger>
        </TabsList>

        <TabsContent value="workspace" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Чернетка звіту</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Field label="Мета роботи" value={goal} onChange={setGoal} rows={2} />
                <Field label="Опис проведеної роботи" value={work} onChange={setWork} rows={4} />
                <Field label="Результати" value={results} onChange={setResults} rows={3} />
                <Field
                  label="Рекомендації"
                  value={recommendations}
                  onChange={setRecommendations}
                  rows={3}
                />
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button size="sm" onClick={() => toast.success("Звіт подано на затвердження")}>
                    Подати звіт
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Чернетку збережено")}>
                    Зберегти чернетку
                  </Button>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileDown className="size-4" /> Експорт документа
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Попередній перегляд експорту</DialogTitle>
                        <DialogDescription>
                          Оберіть формат документа для формування.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="rounded-md border bg-muted/40 p-3 text-xs leading-relaxed">
                        <p className="font-semibold">ЗВІТ ПРО ПРОВЕДЕНУ ПСИХОЛОГІЧНУ РОБОТУ</p>
                        <p className="mt-2"><b>Мета:</b> {goal || "—"}</p>
                        <p><b>Проведена робота:</b> {work || "—"}</p>
                        <p><b>Результати:</b> {results || "—"}</p>
                        <p><b>Рекомендації:</b> {recommendations || "—"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {["PDF", "DOCX", "Службова записка", "Місячний звіт"].map((f) => (
                          <Button
                            key={f}
                            variant="outline"
                            size="sm"
                            onClick={() => toast.success(`Сформовано документ: ${f}`)}
                          >
                            <FileText className="size-4" /> {f}
                          </Button>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <ScanText className="size-4 text-accent" /> Асистент якості
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">Оцінка якості</span>
                      <span className="font-medium">{analysis.score}%</span>
                    </div>
                    <Progress value={analysis.score} className="h-2" />
                  </div>
                  {analysis.issues.length === 0 ? (
                    <p className="flex items-center gap-2 text-sm text-urgency-low">
                      <CheckCircle2 className="size-4" /> Зауважень немає
                    </p>
                  ) : (
                    analysis.issues.map((i, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 rounded-md border border-urgency-medium/40 bg-urgency-medium/8 p-2 text-xs"
                      >
                        <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-urgency-high" />
                        <span>{i.text}</span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                    <Tags className="size-4 text-accent" /> Автоматичні теги
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => toast.success("Структуровані дані передано до банку кейсів")}
                  >
                    Передати до банку кейсів
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="registry" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Реєстр звітів</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Звернення</TableHead>
                    <TableHead>Психолог</TableHead>
                    <TableHead>Теги</TableHead>
                    <TableHead>Вкладення</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.code}</TableCell>
                      <TableCell className="font-mono text-xs">{r.request_code}</TableCell>
                      <TableCell className="text-sm">{r.psychologist}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {r.tags.map((t) => (
                            <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{r.attachments}</TableCell>
                      <TableCell><ReportStatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.created_at}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
