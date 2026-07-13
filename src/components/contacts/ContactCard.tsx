"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building,
  Mail,
  Video,
  Phone,
  MapPin,
  Trash2,
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

const MEETING_TYPE_LABELS: Record<string, string> = {
  google_meet: "Google Meet",
  zoom: "Zoom",
  teams: "Microsoft Teams",
  offline: "Offline / On-site",
  other: "Other",
};

interface Props {
  contact: Contact;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export function ContactCard({ contact, onClick, onDelete }: Props) {
  const [now] = useState(() => Date.now());
  const isOverdue =
    contact.followUpDate && new Date(contact.followUpDate).getTime() < now;
  const isDueSoon =
    contact.followUpDate &&
    !isOverdue &&
    new Date(contact.followUpDate).getTime() - now <
      2 * 24 * 60 * 60 * 1000;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-xl border border-border bg-(--bg-card) p-4 cursor-pointer hover:border-(--accent-cyan)/30 transition group relative"
      onClick={onClick}
    >
      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(contact._id);
        }}
        className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-destructive/10 text-(--text-muted) hover:text-destructive"
        title="Delete contact"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <div className="flex items-start justify-between mb-3 pr-6">
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
          <Mail className="h-3 w-3 shrink-0" />
          <a
            href={`mailto:${contact.email}`}
            onClick={(e) => e.stopPropagation()}
            className="line-clamp-1 text-(--accent-cyan) hover:underline transition-colors"
          >
            {contact.email}
          </a>
        </div>
      )}
      {contact.phone && (
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted) mb-1">
          <Phone className="h-3 w-3 shrink-0" />
          <a
            href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="line-clamp-1 text-(--accent-cyan) hover:underline transition-colors"
          >
            {contact.phone}
          </a>
        </div>
      )}
      {contact.meetingLink && (
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted) mb-1">
          <Video className="h-3 w-3 shrink-0" />
          <a
            href={contact.meetingLink.startsWith('http') ? contact.meetingLink : `https://${contact.meetingLink}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="line-clamp-1 text-(--accent-cyan) hover:underline transition-colors"
          >
            {contact.meetingType ? MEETING_TYPE_LABELS[contact.meetingType] ?? contact.meetingType : "Meeting Link"}
          </a>
        </div>
      )}
      {contact.meetingType === "offline" && contact.meetingLocationUrl && (
        <div className="flex items-center gap-1.5 text-xs text-(--text-muted) mb-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <a
            href={contact.meetingLocationUrl.startsWith('http') ? contact.meetingLocationUrl : `https://${contact.meetingLocationUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="line-clamp-1 text-(--accent-cyan) hover:underline transition-colors"
          >
            View Location
          </a>
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
