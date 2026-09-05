import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { caseBank, taxonomy, type CaseRecord } from "@/data/mock";

export const Route = createFileRoute("/knowledge")({
  head: () => ({
    meta: [
      { title: "Банк кейсів і таксономія — психологічна служба" },
      {
        name: "description",
        content:
          "Семантичний пошук випадків, ієрархічна таксономія проблем, підбір схожих кейсів та статистичні висновки по практиці служби.",
      },
      { property: "og:title", content: "Банк кейсів і таксономія" },
      {
        property: "og:description",
        content: "Агент Класифікатор: пошук, класифікація та аналіз психологічних кейсів.",
      },
    ],
  }),
  component: KnowledgePage,
});

function KnowledgePage() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<Record<string, boolean>>({ "Психологічні проблеми": true });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return caseBank.filter((c) => {
      const matchesCat = active ? c.primary_category === active || c.subcategories.includes(active) : true;
      if (!q) return matchesCat;
      const hay = `${c.primary_category} ${c.subcategories.join(" ")} ${c.symptoms} ${c.interventions} ${c.unit}`.toLowerCase();
      const tokens = q.split(/\s+/).filter((t) => t.length > 3);
      return matchesCat && tokens.some((t) => hay.includes(t.slice(0, 5)));
    });
  }, [query, active]);

  const addictive = caseBank.filter((c) => c.primary_category === "Адиктивна поведінка");
  const alcohol = addictive.filter((c) => c.subcategories.includes("Алкоголь"));

  return (
    <AppShell
      title="Модуль 6 — Банк кейсів і класифікатор"
      description="Агент №6 «Агент Класифікатор і Банк Кейсів»: семантичний пошук, ієрархічна таксономія, мультикатегоризація та підбір схожих випадків."
    >
      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Таксономія проблем</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            {taxonomy.map((root) => (
              <TreeNode
                key={root.name}
                node={root}
                depth={0}
                open={open}
                setOpen={setOpen}
                active={active}
                setActive={setActive}
              />
            ))}
            {active && (
              <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setActive(null)}>
                Скинути фільтр
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-accent" /> Семантичний пошук
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-8"
                  placeholder="усі випадки адиктивної поведінки після ротації за останні два роки"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Знайдено {results.length} записів{active ? ` у категорії «${active}»` : ""}.
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {results.map((c) => (
                  <CaseCard key={c.id} c={c} />
                ))}
                {results.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Записів не знайдено — уточніть запит або оберіть іншу категорію.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Крос-аналітика випадків</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Insight
                  text={`${Math.round((alcohol.length / addictive.length) * 100)}% випадків адиктивної поведінки пов'язані з алкоголем`}
                  value={(alcohol.length / addictive.length) * 100}
                />
                <Insight text="64% випадків бойового стресу зафіксовано після ротації" value={64} />
                <Insight text="38% конфліктів врегульовано через медіацію без ескалації" value={38} />
                <Insight text="81% адаптаційних кейсів завершено успішно протягом місяця" value={81} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Найпоширеніші практики</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {[
                  "Мотиваційне інтерв'ювання — 46 застосувань",
                  "Техніки заземлення та стабілізації — 38",
                  "Групова медіація — 24",
                  "Психоедукація щодо гігієни сну — 21",
                  "План безпеки при суїцидальному ризику — 9",
                ].map((p) => (
                  <div key={p} className="rounded-md border px-3 py-2 text-xs">{p}</div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

type Node = { name: string; children?: Node[] };

function TreeNode({
  node,
  depth,
  open,
  setOpen,
  active,
  setActive,
}: {
  node: Node;
  depth: number;
  open: Record<string, boolean>;
  setOpen: (v: Record<string, boolean>) => void;
  active: string | null;
  setActive: (v: string | null) => void;
}) {
  const hasChildren = Boolean(node.children?.length);
  const isOpen = open[node.name];
  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs hover:bg-muted ${
          active === node.name ? "bg-accent/10 font-medium text-accent" : ""
        }`}
        style={{ paddingLeft: depth * 12 + 8 }}
        onClick={() => {
          if (hasChildren) setOpen({ ...open, [node.name]: !isOpen });
          setActive(active === node.name ? null : node.name);
        }}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )
        ) : (
          <span className="w-3.5" />
        )}
        {node.name}
      </div>
      {hasChildren && isOpen && (
        <div>
          {node.children!.map((c) => (
            <TreeNode
              key={c.name}
              node={c}
              depth={depth + 1}
              open={open}
              setOpen={setOpen}
              active={active}
              setActive={setActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CaseCard({ c }: { c: CaseRecord }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="rounded-md border p-3 text-left transition-colors hover:border-accent/50">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
            <Badge variant="secondary" className="text-[10px]">
              Знайдено {c.similar} схожих випадків
            </Badge>
          </div>
          <p className="mt-1 text-sm font-medium">{c.primary_category}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{c.symptoms}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {c.subcategories.map((s) => (
              <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
            ))}
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Кейс {c.code}</DialogTitle>
          <DialogDescription>
            {c.primary_category} • {c.unit} • {c.created_at} (дані знеособлені)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <Section title="Симптоми / прояви" text={c.symptoms} />
          <Section title="Інтервенції" text={c.interventions} />
          <Section title="Результати" text={c.outcomes} />
          <Section title="Найкращі практики та рекомендації" text={c.recommendations} />
          <div className="flex flex-wrap gap-1">
            {c.subcategories.map((s) => (
              <Badge key={s} variant="outline">{s}</Badge>
            ))}
          </div>
          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              Схожість із базою: {Math.min(96, 60 + c.similar)}%
            </p>
            <Progress value={Math.min(96, 60 + c.similar)} className="h-1.5" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
      <p className="mt-0.5">{text}</p>
    </div>
  );
}

function Insight({ text, value }: { text: string; value: number }) {
  return (
    <div>
      <p className="mb-1 text-xs">{text}</p>
      <Progress value={value} className="h-1.5" />
    </div>
  );
}
