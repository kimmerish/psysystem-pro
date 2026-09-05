import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, CheckCircle2, HelpCircle, Paperclip, Sparkles, Wand2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge, UrgencyBadge } from "@/components/StatusBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  categories,
  requests,
  statusLabels,
  urgencyLabels,
  type RequestItem,
  type Urgency,
} from "@/data/mock";
import { useLocations, useUnits } from "@/hooks/use-directory";

export const Route = createFileRoute("/requests")({
  head: () => ({
    meta: [
      { title: "Заявки та Агент Заявок — психологічна служба" },
      {
        name: "description",
        content:
          "Прийом звернень, структурування тексту, перевірка повноти, уточнювальні питання та автоматична категоризація з оцінкою терміновості.",
      },
      { property: "og:title", content: "Заявки та Агент Заявок" },
      {
        property: "og:description",
        content: "Прийом і опрацювання звернень із ШІ-секретарем психологічної служби.",
      },
    ],
  }),
  component: RequestsPage,
});

const clarifyQuestions = [
  "Які саме труднощі виникли (поведінка, стан, стосунки)?",
  "Коли вперше з'явилися ці ознаки?",
  "Хто залучений: одна особа, група, підрозділ?",
  "Чи були раніше звернення з цього приводу?",
];

function structure(text: string) {
  const t = text.trim().toLowerCase();
  if (!t) return "";
  if (t.includes("поговорити") || t.includes("виснаж"))
    return "Командир підрозділу повідомляє про ознаки емоційного виснаження військовослужбовців. Потребує групової діагностики та індивідуальних консультацій.";
  if (t.includes("сплю") || t.includes("сон"))
    return "Військовослужбовець повідомляє про стійке порушення сну, ознаки тривожності та зниження концентрації уваги. Потрібна діагностична консультація.";
  if (t.includes("п'є") || t.includes("алкогол"))
    return "Отримано повідомлення про систематичне вживання алкоголю. Ознаки адиктивної поведінки, потрібна діагностична бесіда та скринінг.";
  if (t.includes("сенс") || t.includes("суїц"))
    return "Отримано інформацію про висловлювання, що можуть свідчити про суїцидальні наміри. Потрібне негайне кризове втручання та оцінка ризику.";
  return `Заявник повідомляє про ситуацію, що потребує психологічного втручання: ${text.trim()}. Потрібне уточнення обставин, кола залучених осіб та формулювання запиту.`;
}

function detectCategory(text: string) {
  const t = text.toLowerCase();
  if (t.includes("сенс") || t.includes("суїц")) return "Суїцидальні ризики";
  if (t.includes("п'є") || t.includes("алкогол") || t.includes("грає")) return "Адиктивна поведінка";
  if (t.includes("сплю") || t.includes("ротац") || t.includes("обстріл")) return "Бойовий стрес";
  if (t.includes("конфлікт") || t.includes("сварк")) return "Конфлікт";
  if (t.includes("сім") || t.includes("вдома") || t.includes("дружин")) return "Сімейні труднощі";
  if (t.includes("нов") || t.includes("колектив")) return "Адаптація";
  return "Інше";
}

function detectUrgency(text: string): Urgency {
  const t = text.toLowerCase();
  if (t.includes("сенс") || t.includes("суїц")) return "critical";
  if (t.includes("п'є") || t.includes("виснаж")) return "high";
  if (t.includes("сплю") || t.includes("конфлікт")) return "medium";
  return "low";
}

function RequestsPage() {
  const [raw, setRaw] = useState("");
  const [units] = useUnits();
  const [locations] = useLocations();
  const [unitSel, setUnit] = useState("");
  const [locSel, setLocation] = useState("");
  const unit = unitSel || units[0]?.name || "";
  const location = locSel || locations[0]?.name || "";
  const [type, setType] = useState("Самозвернення");
  const [structured, setStructured] = useState("");
  const [category, setCategory] = useState<string>("");
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [analyzed, setAnalyzed] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<RequestItem | null>(null);

  const words = raw.trim().split(/\s+/).filter(Boolean).length;
  const checks = [
    { label: "Чіткість проблеми", ok: words >= 6 },
    { label: "Учасники", ok: /(я|командир|військовослуж|група|побратим|підрозділ|хлопц)/i.test(raw) },
    { label: "Місце / підрозділ", ok: Boolean(unit && location) },
    { label: "Основний запит", ok: /(потріб|треба|прошу|допомог|консультац|поговорити)/i.test(raw) },
  ];
  const needsClarification = checks.filter((c) => !c.ok).length > 0;

  const runAgent = () => {
    if (!raw.trim()) {
      toast.error("Введіть текст звернення для опрацювання");
      return;
    }
    setStructured(structure(raw));
    setCategory(detectCategory(raw));
    setUrgency(detectUrgency(raw));
    setAnalyzed(true);
    toast.success("Агент Заявок опрацював звернення");
  };

  const visible = requests.filter((r) => (filter === "all" ? true : r.status === filter));

  return (
    <AppShell
      title="Модуль 1 — Прийом та опрацювання звернень"
      description="Агент №1 «Агент Заявок»: структурування тексту, перевірка повноти, уточнювальні питання, категоризація та оцінка терміновості."
    >
      <Tabs defaultValue="form">
        <TabsList className="flex w-full justify-start overflow-x-auto">
          <TabsTrigger value="form">Форма звернення</TabsTrigger>
          <TabsTrigger value="registry">Реєстр звернень</TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Нове звернення</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Підрозділ</Label>
                    <Select value={unit} onValueChange={setUnit}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {units.map((u) => (
                          <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Локація</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {locations.map((l) => (
                          <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Тип звернення</Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Самозвернення", "Звернення командира", "QR-звернення", "Скерування медичної служби"].map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Текст звернення (вільна форма)</Label>
                  <Textarea
                    rows={5}
                    value={raw}
                    onChange={(e) => setRaw(e.target.value)}
                    placeholder="Наприклад: «Треба поговорити, у хлопців щось не те після ротації»"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => toast.success("Файл прикріплено до звернення")}>
                    <Paperclip className="size-4" /> Прикріпити файл
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="sm" onClick={runAgent}>
                        <Sparkles className="size-4" /> Опрацювати ШІ-секретарем
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <Bot className="size-4 text-accent" /> Агент Заявок
                        </SheetTitle>
                        <SheetDescription>
                          Структурування, перевірка повноти, уточнення та попередня класифікація звернення.
                        </SheetDescription>
                      </SheetHeader>

                      <div className="space-y-5 p-4">
                        <section className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Структурований текст
                          </p>
                          <Textarea
                            rows={5}
                            value={structured}
                            onChange={(e) => setStructured(e.target.value)}
                            placeholder="Спочатку натисніть «Опрацювати ШІ-секретарем»"
                          />
                        </section>

                        <section className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Перевірка повноти
                          </p>
                          {checks.map((c) => (
                            <div key={c.label} className="flex items-center gap-2 text-sm">
                              {c.ok ? (
                                <CheckCircle2 className="size-4 text-urgency-low" />
                              ) : (
                                <XCircle className="size-4 text-urgency-high" />
                              )}
                              <span className={c.ok ? "" : "text-muted-foreground"}>{c.label}</span>
                            </div>
                          ))}
                        </section>

                        {needsClarification && (
                          <section className="space-y-2 rounded-md border border-urgency-medium/40 bg-urgency-medium/8 p-3">
                            <p className="flex items-center gap-2 text-xs font-semibold uppercase text-urgency-high">
                              <HelpCircle className="size-3.5" /> Уточнювальні питання
                            </p>
                            {clarifyQuestions.map((q, i) => (
                              <div key={q} className="space-y-1">
                                <Label className="text-xs">{q}</Label>
                                <Input
                                  value={answers[i] ?? ""}
                                  onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                                  placeholder="Відповідь заявника"
                                />
                              </div>
                            ))}
                          </section>
                        )}

                        <section className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Попередня категоризація
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {categories.map((c) => (
                              <button key={c} onClick={() => setCategory(c)}>
                                <Badge variant={category === c ? "default" : "outline"}>{c}</Badge>
                              </button>
                            ))}
                          </div>
                        </section>

                        <section className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Оцінка терміновості (з можливістю ручного коригування)
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {(Object.keys(urgencyLabels) as Urgency[]).map((u) => (
                              <Button
                                key={u}
                                size="sm"
                                variant={urgency === u ? "default" : "outline"}
                                onClick={() => setUrgency(u)}
                              >
                                {urgencyLabels[u]}
                              </Button>
                            ))}
                          </div>
                          {analyzed && (
                            <p className="text-xs text-muted-foreground">
                              Рекомендація агента: <UrgencyBadge urgency={detectUrgency(raw)} />
                            </p>
                          )}
                        </section>

                        <Button
                          className="w-full"
                          onClick={() =>
                            toast.success("Звернення збережено у реєстрі", {
                              description: `${unit} • ${location} • ${category || "Інше"}`,
                            })
                          }
                        >
                          <Wand2 className="size-4" /> Зберегти структуроване звернення
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Стан опрацювання</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Row label="Символів у тексті" value={String(raw.length)} />
                <Row label="Категорія" value={category || "—"} />
                <Row label="Терміновість" value={urgencyLabels[urgency]} />
                <Row label="Повнота" value={`${checks.filter((c) => c.ok).length}/4`} />
                <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                  Агент перетворює неформальний текст на професійне формулювання, перевіряє
                  повноту, ставить уточнювальні питання та пропонує категорію і рівень терміновості.
                  Остаточне рішення завжди за фахівцем.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registry" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-3 pb-3">
              <CardTitle className="text-sm font-semibold">Реєстр звернень</CardTitle>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-8 w-48 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Усі статуси</SelectItem>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Заявник</TableHead>
                    <TableHead>Підрозділ</TableHead>
                    <TableHead>Категорія</TableHead>
                    <TableHead>Терміновість</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visible.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-mono text-xs">{r.code}</TableCell>
                      <TableCell className="text-sm">{r.applicant}</TableCell>
                      <TableCell className="text-sm">{r.unit}</TableCell>
                      <TableCell className="text-sm">{r.category}</TableCell>
                      <TableCell><UrgencyBadge urgency={r.urgency} /></TableCell>
                      <TableCell><StatusBadge status={r.status} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{r.created_at}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelected(r)}>
                              Деталі
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Звернення {selected?.code}</DialogTitle>
                              <DialogDescription>
                                {selected?.unit} • {selected?.location} • {selected?.request_type}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-3 text-sm">
                              <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                  Первинний текст
                                </p>
                                <p className="mt-1 italic text-muted-foreground">«{selected?.raw_text}»</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold uppercase text-muted-foreground">
                                  Структуроване формулювання
                                </p>
                                <p className="mt-1">{selected?.structured_text}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline">{selected?.category}</Badge>
                                {selected && <UrgencyBadge urgency={selected.urgency} />}
                                {selected && <StatusBadge status={selected.status} />}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
