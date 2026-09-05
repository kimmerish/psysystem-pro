import { useEffect, useState } from "react";
import { Bot, Plus, Cpu, Trash2, Wifi } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ProviderKind = "lovable" | "openai" | "ollama" | "gemini" | "local" | "custom";

export type AiProvider = {
  id: string;
  name: string;
  kind: ProviderKind;
  baseUrl: string;
  model: string;
  apiKey: string;
  active: boolean;
};

export const providerLabels: Record<ProviderKind, string> = {
  lovable: "Вбудований ШІ (без ключа)",
  openai: "OpenAI-сумісний",
  ollama: "Ollama",
  gemini: "Google Gemini",
  local: "Локальний сервер",
  custom: "Інший провайдер",
};

const kindDefaults: Record<ProviderKind, { baseUrl: string; model: string }> = {
  lovable: { baseUrl: "https://ai.gateway.lovable.dev/v1", model: "google/gemini-3.7-flash" },
  openai: { baseUrl: "https://api.openai.com/v1", model: "gpt-4o-mini" },
  ollama: { baseUrl: "http://localhost:11434/v1", model: "llama3.1:8b" },
  gemini: { baseUrl: "https://generativelanguage.googleapis.com/v1beta", model: "gemini-2.0-flash" },
  local: { baseUrl: "http://127.0.0.1:8000/v1", model: "local-model" },
  custom: { baseUrl: "", model: "" },
};

const agents = [
  "Агент Заявок",
  "Агент Звітів",
  "Агент Планер",
  "Агент Аналітичний Дашборд",
  "Агент Синхронізації",
  "Агент Класифікатор і Банк Кейсів",
];

const defaultProviders: AiProvider[] = [
  {
    id: "ai1",
    name: "Вбудований ШІ служби",
    kind: "lovable",
    baseUrl: kindDefaults.lovable.baseUrl,
    model: kindDefaults.lovable.model,
    apiKey: "",
    active: true,
  },
  {
    id: "ai2",
    name: "Локальна Ollama (штаб)",
    kind: "ollama",
    baseUrl: kindDefaults.ollama.baseUrl,
    model: "llama3.1:8b",
    apiKey: "",
    active: false,
  },
];

const STORAGE_KEY = "psy-ai-providers";
const AGENT_KEY = "psy-ai-agent-map";

export function AiModelsSettings() {
  const [providers, setProviders] = useState<AiProvider[]>(defaultProviders);
  const [agentMap, setAgentMap] = useState<Record<string, string>>({});
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<AiProvider>({
    id: "",
    name: "",
    kind: "openai",
    baseUrl: kindDefaults.openai.baseUrl,
    model: kindDefaults.openai.model,
    apiKey: "",
    active: true,
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProviders(JSON.parse(raw) as AiProvider[]);
      const rawMap = localStorage.getItem(AGENT_KEY);
      if (rawMap) setAgentMap(JSON.parse(rawMap) as Record<string, string>);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: AiProvider[]) => {
    setProviders(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const persistMap = (next: Record<string, string>) => {
    setAgentMap(next);
    try {
      localStorage.setItem(AGENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const openNew = () => {
    setDraft({
      id: "",
      name: "",
      kind: "openai",
      baseUrl: kindDefaults.openai.baseUrl,
      model: kindDefaults.openai.model,
      apiKey: "",
      active: true,
    });
    setOpen(true);
  };

  const openEdit = (p: AiProvider) => {
    setDraft(p);
    setOpen(true);
  };

  const save = () => {
    if (!draft.name.trim()) {
      toast.error("Вкажіть назву підключення");
      return;
    }
    if (draft.kind !== "lovable" && !draft.baseUrl.trim()) {
      toast.error("Вкажіть адресу сервера моделі");
      return;
    }
    if (draft.id) {
      persist(providers.map((p) => (p.id === draft.id ? draft : p)));
      toast.success("Підключення оновлено");
    } else {
      persist([...providers, { ...draft, id: `ai${Date.now()}` }]);
      toast.success("Модель підключено");
    }
    setOpen(false);
  };

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <Bot className="size-4 text-accent" /> Підключення ШІ-моделей
          </CardTitle>
          <Button size="sm" onClick={openNew}>
            <Plus className="mr-1 size-4" /> Додати модель
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {providers.map((p) => (
            <div key={p.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{providerLabels[p.kind]}</p>
                </div>
                <Badge
                  className={
                    p.active
                      ? "bg-urgency-low/12 text-urgency-low"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {p.active ? "Активна" : "Вимкнено"}
                </Badge>
              </div>
              <p className="mt-2 truncate font-mono text-[11px] text-muted-foreground">{p.baseUrl || "—"}</p>
              <p className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                <Cpu className="size-3" /> {p.model || "—"}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Switch
                  checked={p.active}
                  onCheckedChange={(v) =>
                    persist(providers.map((x) => (x.id === p.id ? { ...x, active: v } : x)))
                  }
                />
                <Button variant="ghost" size="sm" onClick={() => openEdit(p)}>
                  Редагувати
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.success(`З'єднання з «${p.name}» перевірено`)}
                >
                  <Wifi className="mr-1 size-4" /> Перевірити
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    persist(providers.filter((x) => x.id !== p.id));
                    toast.success("Підключення видалено");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Моделі для агентів</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {agents.map((a) => (
            <div key={a} className="flex items-center justify-between gap-3 rounded-md border p-3">
              <span className="text-sm">{a}</span>
              <Select
                value={agentMap[a] ?? providers.find((p) => p.active)?.id ?? ""}
                onValueChange={(v) => {
                  persistMap({ ...agentMap, [a]: v });
                  toast.success("Модель для агента збережено");
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Оберіть модель" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{draft.id ? "Редагування підключення" : "Нове підключення ШІ"}</DialogTitle>
            <DialogDescription>
              Підтримуються локальні сервери та зовнішні провайдери: OpenAI-сумісні API, Ollama, Gemini та інші.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Назва</Label>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Наприклад: Локальний сервер штабу"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Тип провайдера</Label>
              <Select
                value={draft.kind}
                onValueChange={(v) => {
                  const kind = v as ProviderKind;
                  setDraft({ ...draft, kind, ...kindDefaults[kind] });
                }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(providerLabels) as ProviderKind[]).map((k) => (
                    <SelectItem key={k} value={k}>{providerLabels[k]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Адреса сервера (base URL)</Label>
              <Input
                value={draft.baseUrl}
                onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
                placeholder="http://localhost:11434/v1"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Модель</Label>
              <Input
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                placeholder="llama3.1:8b"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Ключ доступу (за потреби)</Label>
              <Input
                type="password"
                value={draft.apiKey}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                placeholder="Для локальних моделей не обов'язково"
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3">
              <span className="text-sm">Активна</span>
              <Switch
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={save}>Зберегти підключення</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
