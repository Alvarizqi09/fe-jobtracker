"use client";

import { ErrorBoundary } from "react-error-boundary";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>
      <h2 className="text-xl font-syne font-semibold text-(--text-primary) mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-(--text-secondary) max-w-sm mb-6">
        {error.message || "An unexpected error occurred while loading this section."}
      </p>
      <Button
        onClick={resetErrorBoundary}
        variant="outline"
        className="border-[rgba(60,90,140,0.4)] text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-hover)"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try Again
      </Button>
    </div>
  );
}

export function GlobalErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
