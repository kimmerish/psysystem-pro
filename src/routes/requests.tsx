import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, CheckCircle2, HelpCircle, Paperclip, Sparkles, Wand2 } from "lucide-react";
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
  locations,
  requests,
  statusLabels,
  units,
  urgencyLabels,
  type Urgency,
} from "@/data/mock";

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
  component: RequestsPage;
});

function RequestsPage() {
  return <div />;
}
