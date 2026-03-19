"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const Joyride = dynamic(() => import("react-joyride"), { ssr: false });

const steps = [
  {
    target: "body",
    content: "Welcome to JobDeck! Let's take a quick tour to get you started.",
    placement: "center" as const,
    disableBeacon: true,
  },
  {
    target: ".board-tab", // Note: will add this class to Board link
    content: "This is your Kanban board. Drag and drop jobs across columns to track your progress.",
    placement: "right" as const,
  },
  {
    target: ".add-job-btn", // Note: add this class to "Add Job" button
    content: "Click here to add a new job application. You can track company, position, salary, and notes.",
    placement: "left" as const,
  },
  {
    target: ".analytics-tab",
    content: "View insights into your job search performance, like application volume and success rate.",
    placement: "right" as const,
  },
  {
    target: ".contacts-tab",
    content: "Keep track of recruiters and interviewers easily in the Contacts manager.",
    placement: "right" as const,
  },
];

export function OnboardingTour() {
  const { user } = useAuth();
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Only run if user is loaded and hasn't completed onboarding
    // For now, we'll store a flag in local storage to prevent annoyance during dev
    // In a real app, you'd check `user?.preferences?.hasCompletedOnboarding`
    if (user && !localStorage.getItem("jobdeck_onboarding_done")) {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleJoyrideCallback = async (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = ["finished", "skipped"];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem("jobdeck_onboarding_done", "true");
      // Optional: save to backend
      try {
        await api.patch("/users/preferences", { hasCompletedOnboarding: true });
      } catch (e) {
        // ignore
      }
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#0ea5e9",
          backgroundColor: "var(--bg-card)",
          textColor: "var(--text-primary)",
          overlayColor: "rgba(0,0,0,0.6)",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#0ea5e9",
          color: "#fff",
          borderRadius: "6px",
        },
        buttonBack: {
          color: "var(--text-secondary)",
          marginRight: "10px",
        },
      }}
    />
  );
}
