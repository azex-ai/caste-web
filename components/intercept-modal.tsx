"use client";

import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// Wraps server-rendered detail content in a Radix dialog and ties its
// open/close state to the router. Closing the modal goes back so the URL
// returns to the originating page. The title is rendered visually hidden;
// Radix requires it for screen reader announcements.
export function InterceptModal({
  title = "Detail",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent>
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
