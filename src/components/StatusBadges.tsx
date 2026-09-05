import { cn } from "@/lib/utils";
import {
  reportStatusLabels,
  statusLabels,
  urgencyLabels,
  type ReportStatus,
  type RequestStatus,
  type Urgency,
} from "@/data/mock";

const urgencyClass: Record<Urgency, string> = {
  low: "bg-urgency-low/12 text-urgency-low ring-urgency-low/30",
  medium: "bg-urgency-medium/15 text-urgency-medium ring-urgency-medium/30",
  high: "bg-urgency-high/12 text-urgency-high ring-urgency-high/30",
  critical: "bg-urgency-critical/12 text-urgency-critical ring-urgency-critical/30",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        urgencyClass[urgency],
      )}
    >
      {urgencyLabels[urgency]}
    </span>
  );
}

const statusClass: Record<RequestStatus, string> = {
  new: "bg-accent/10 text-accent ring-accent/25",
  in_processing: "bg-urgency-medium/15 text-urgency-medium ring-urgency-medium/30",
  scheduled: "bg-primary/8 text-primary ring-primary/20",
  completed: "bg-urgency-low/12 text-urgency-low ring-urgency-low/30",
  cancelled: "bg-muted text-muted-foreground ring-border",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        statusClass[status],
      )}
    >
      {statusLabels[status]}
    </span>
  );
}

const reportClass: Record<ReportStatus, string> = {
  draft: "bg-muted text-muted-foreground ring-border",
  submitted: "bg-accent/10 text-accent ring-accent/25",
  approved: "bg-urgency-low/12 text-urgency-low ring-urgency-low/30",
  rejected: "bg-urgency-critical/12 text-urgency-critical ring-urgency-critical/30",
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        reportClass[status],
      )}
    >
      {reportStatusLabels[status]}
    </span>
  );
}
