import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, QrCode, Shield, Users } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  auditLogs,
  locations,
  profiles,
  qrCodes,
  roleLabels,
  units,
  type Role,
} from "@/data/mock";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Адміністрування системи — психологічна служба" },
      {
        name: "description",
        content:
          "Керування користувачами й ролями, підрозділами, локаціями, QR-кодами звернень, журналом аудиту та сповіщеннями.",
      },
      { property: "og:title", content: "Адміністрування системи" },
      {
        property: "og:description",
        content: "Користувачі, підрозділи, локації, QR-коди та журнал аудиту служби.",
      },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [list, setList] = useState(profiles);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Psychologist");
  const [unit, setUnit] = useState(units[0]!.name);

  const addUser = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Заповніть ПІБ та електронну пошту");
      return;
    }
    setList([...list, { id: `pr${list.length + 1}`, full_name: name, email, role, unit }]);
    setName("");
    setEmail("");
    toast.success("Користувача створено");
  };

  return (
    <AppShell
      title="Модуль 7 — Адміністрування та інфраструктура"
      description="Користувачі й ролі, підрозділи, локації, генератор QR-кодів, журнал аудиту та налаштування сповіщень."
    >
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Користувачі</TabsTrigger>
          <TabsTrigger value="units">Підрозділи та локації</TabsTrigger>
          <TabsTrigger value="qr">QR-коди</TabsTrigger>
          <TabsTrigger value="audit">Журнал аудиту</TabsTrigger>
          <TabsTrigger value="notify">Сповіщення</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-4 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Users className="size-4 text-accent" /> Користувачі системи
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ПІБ</TableHead>
                    <TableHead>Пошта</TableHead>
                    <TableHead>Роль</TableHead>
                    <TableHead>Підрозділ</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {list.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="text-sm">{p.full_name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {roleLabels[p.role]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{p.unit}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setList(list.filter((x) => x.id !== p.id));
                            toast.success("Користувача видалено");
                          }}
                        >
                          Видалити
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Новий користувач</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">ПІБ</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Іванов Іван" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Електронна пошта</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="i.ivanov@psy.mil" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Роль</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(roleLabels) as Role[]).map((r) => (
                      <SelectItem key={r} value={r}>{roleLabels[r]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <Button className="w-full" onClick={addUser}>Створити користувача</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="units" className="mt-4 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Shield className="size-4 text-accent" /> Підрозділи
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Назва</TableHead>
                    <TableHead>Код</TableHead>
                    <TableHead>Підпорядкування</TableHead>
                    <TableHead>Локація</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {units.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="text-sm">{u.name}</TableCell>
                      <TableCell className="font-mono text-xs">{u.code}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.parent}</TableCell>
                      <TableCell className="text-sm">{u.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="size-4 text-accent" /> Локації
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {locations.map((l) => (
                <div key={l.id} className="rounded-md border p-3">
                  <p className="text-sm font-medium">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.address}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{l.coordinates}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="mt-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <QrCode className="size-4 text-accent" /> QR-коди для миттєвих звернень
              </CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Згенерувати QR-код</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Новий QR-код</DialogTitle>
                    <DialogDescription>
                      QR-код відкриває форму звернення з попередньо заповненим підрозділом і локацією.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Select defaultValue={units[0]!.name}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {units.map((u) => (
                          <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select defaultValue={locations[0]!.name}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {locations.map((l) => (
                          <SelectItem key={l.id} value={l.name}>{l.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center justify-center rounded-md border bg-muted p-8">
                      <QrCode className="size-24 text-primary" />
                    </div>
                    <Button className="w-full" onClick={() => toast.success("QR-код створено та активовано")}>
                      Створити та активувати
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Токен</TableHead>
                    <TableHead>Підрозділ</TableHead>
                    <TableHead>Локація</TableHead>
                    <TableHead>Сканувань</TableHead>
                    <TableHead>Стан</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {qrCodes.map((q) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-mono text-xs">{q.token}</TableCell>
                      <TableCell className="text-sm">{q.unit}</TableCell>
                      <TableCell className="text-sm">{q.location}</TableCell>
                      <TableCell className="text-sm">{q.scans}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            q.active
                              ? "bg-urgency-low/12 text-urgency-low"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {q.active ? "Активний" : "Вимкнено"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Журнал дій користувачів</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Час</TableHead>
                    <TableHead>Користувач</TableHead>
                    <TableHead>Дія</TableHead>
                    <TableHead>Сутність</TableHead>
                    <TableHead>ID запису</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs">{a.ts}</TableCell>
                      <TableCell className="text-sm">{a.user}</TableCell>
                      <TableCell className="text-sm">{a.action}</TableCell>
                      <TableCell className="font-mono text-xs">{a.entity}</TableCell>
                      <TableCell className="font-mono text-xs">{a.entity_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notify" className="mt-4">
          <Card className="max-w-2xl">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="size-4 text-accent" /> Налаштування сповіщень
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Нове критичне звернення",
                "Звіт подано на затвердження",
                "Звіт повернуто на доопрацювання",
                "Перевищення норми навантаження психолога",
                "Щотижневе зведення для керівництва",
              ].map((n, i) => (
                <div key={n} className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">{n}</span>
                  <Switch defaultChecked={i < 4} />
                </div>
              ))}
              <Button onClick={() => toast.success("Налаштування сповіщень збережено")}>
                Зберегти налаштування
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
