"use client";

import { motion } from "framer-motion";
import {
  Building,
  Mail,
  Linkedin,
  Phone,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Contact } from "@/types/contact.types";
import { formatDistanceToNow } from "date-fns";

const REL_COLORS: Record<string, string> = {
  recruiter: "#3B82F6",
  interviewer: "#F59E0B",
  referral: "#10B981",
  connection: "#8B5CF6",
  other: "#6B7280",
};

interface Props {
  contact: Contact;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onClick, onDelete }: Props) {
  const isOverdue =
    contact.followUpDate && new Date(contact.followUpDate) < new Date();
  const isDueSoon =
    contact.followUpDate &&
    !isOverdue &&
    new Date(contact.followUpDate).getTime() - Date.now() <
      2 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-(--bg-card) p-4 cursor-pointer hover:border-(--accent-cyan)/30 transition group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--accent-cyan)]/20 to-[var(--accent-blue)]/20 flex items-center justify-center text-sm font-semibold text-(--accent-cyan)">
            {contact.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-(--text-primary) line-clamp-1">
              {contact.name}
            </h3>
            <p className="text-xs text-(--text-muted)">
              {contact.role}
            </p>
          </div>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] capitalize border"
          style={{
            borderColor: (REL_COLORS[contact.relationship] ?? "#6B7280") + "50",
            color: REL_COLORS[contact.relationship] ?? "#6B7280",
            backgroundColor:
              (REL_COLORS[contact.relationship] ?? "#6B7280") + "12",
          }}
        >
          {contact.relationship}
        </Badge>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-(--text-secondary) mb-2">
        <Building className="h-3.5 w-3.5" />
        <span className="line-clamp-1">{contact.company}</span>
      </div>

      {contact.email && (
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted) mb-1">
          <Mail className="h-3 w-3" />
          <span className="line-clamp-1">{contact.email}</span>
        </div>
      )}
      {contact.linkedin && (
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted) mb-1">
          <Linkedin className="h-3 w-3" />
          <span className="line-clamp-1">{contact.linkedin}</span>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs text-(--text-muted)">
        <div>
          {contact.linkedJobIds.length > 0 && (
            <span>Linked jobs: {contact.linkedJobIds.length}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {contact.lastContactDate && (
            <span>
              {formatDistanceToNow(new Date(contact.lastContactDate), {
                addSuffix: true,
              })}
            </span>
          )}
          {isOverdue && (
            <Badge
              variant="destructive"
              className="text-[10px] px-1.5 h-5"
            >
              Overdue
            </Badge>
          )}
          {isDueSoon && (
            <Badge className="text-[10px] px-1.5 h-5 bg-amber-500/20 text-amber-400 border-amber-500/40">
              Due Soon
            </Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
