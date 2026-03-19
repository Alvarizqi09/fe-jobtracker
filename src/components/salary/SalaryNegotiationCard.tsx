"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { OfferDetails } from "@/types/notification.types";

const DECISIONS = [
  { value: "pending", label: "Pending", color: "#F59E0B" },
  { value: "accepted", label: "Accept", color: "#10B981" },
  { value: "negotiating", label: "Negotiate", color: "#3B82F6" },
  { value: "declined", label: "Decline", color: "#EF4444" },
] as const;

interface Props {
  offerDetails?: OfferDetails;
  onUpdate: (details: OfferDetails) => void;
}

export function SalaryNegotiationCard({ offerDetails, onUpdate }: Props) {
  const [details, setDetails] = useState<OfferDetails>({
    offeredSalary: "",
    negotiatedSalary: "",
    offerDeadline: "",
    negotiationNotes: "",
    decision: "pending",
    ...offerDetails,
  });

  useEffect(() => {
    if (offerDetails) setDetails((prev) => ({ ...prev, ...offerDetails }));
  }, [offerDetails]);

  const handleChange = useCallback(
    (key: keyof OfferDetails, value: string) => {
      const updated = { ...details, [key]: value };
      setDetails(updated);
      onUpdate(updated);
    },
    [details, onUpdate],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.04)] p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-(--status-offer)" />
        <h3 className="font-syne text-lg text-(--text-primary)">
          Offer Details
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-1 block">
            Offered Salary
          </label>
          <Input
            value={details.offeredSalary ?? ""}
            onChange={(e) => handleChange("offeredSalary", e.target.value)}
            placeholder="e.g. Rp 15,000,000/month"
            className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
          />
        </div>
        <div>
          <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-1 block">
            Expected / Negotiated Salary
          </label>
          <Input
            value={details.negotiatedSalary ?? ""}
            onChange={(e) => handleChange("negotiatedSalary", e.target.value)}
            placeholder="e.g. Rp 18,000,000/month"
            className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-1 block">
          Offer Deadline
        </label>
        <Input
          type="date"
          value={details.offerDeadline?.split("T")[0] ?? ""}
          onChange={(e) =>
            handleChange(
              "offerDeadline",
              e.target.value ? new Date(e.target.value).toISOString() : "",
            )
          }
          className="bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary) max-w-xs"
        />
      </div>

      <div>
        <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-1 block">
          Negotiation Notes
        </label>
        <Textarea
          value={details.negotiationNotes ?? ""}
          onChange={(e) => handleChange("negotiationNotes", e.target.value)}
          placeholder="Talking points, counter-offer strategy, benefits discussed..."
          className="min-h-[80px] text-sm bg-(--bg-primary) border-[rgba(60,90,140,0.4)] text-(--text-primary)"
        />
      </div>

      {/* Decision Buttons */}
      <div>
        <label className="text-xs text-(--text-muted) uppercase tracking-wider mb-2 block">
          Decision
        </label>
        <div className="flex gap-2 flex-wrap">
          {DECISIONS.map((d) => (
            <Button
              key={d.value}
              variant={details.decision === d.value ? "default" : "ghost"}
              size="sm"
              onClick={() => handleChange("decision", d.value)}
              style={{
                ...(details.decision === d.value
                  ? {
                      backgroundColor: d.color + "20",
                      color: d.color,
                      borderColor: d.color + "50",
                      border: `1px solid ${d.color}50`,
                    }
                  : {}),
              }}
              className="text-xs"
            >
              {d.label}
            </Button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
