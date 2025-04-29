"use client";

import { useEffect } from "react";
import { toast } from "sonner";

interface Incident {
  id: string;
  title: string;
  description: string;
  date: string;
  severity: string;
  status: string;
  news_url: string;
  type: string;
}

interface NationalIncidentsToastProps {
  incidents?: Incident[];
}

export function NationalIncidentsToast({
  incidents,
}: NationalIncidentsToastProps) {
  useEffect(() => {
    if (!incidents || incidents.length === 0) return;

    incidents.forEach((incident) => {
      toast.error(incident.title, {
        description: incident.description,
        action: {
          label: "Read more",
          onClick: () => window.open(incident.news_url, "_blank"),
        },
        ...(incident.severity === "critical" && {
          style: { borderLeft: "6px solid red" },
        }),
      });
    });
  }, [incidents]);

  return null;
}
