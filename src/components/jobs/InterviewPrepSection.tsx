"use client";

import { useMemo } from "react";

const QUESTION_MAP: Record<string, string[]> = {
  react: [
    "Explain React's reconciliation algorithm and virtual DOM diffing.",
    "How do you optimize re-renders in a large React application?",
    "What are React Server Components and how do they differ from client components?",
    "Describe the React hooks lifecycle and common pitfalls.",
    "How would you implement code-splitting and lazy loading in React?",
  ],
  frontend: [
    "How do you approach responsive design for complex layouts?",
    "Explain the critical rendering path and how to optimize it.",
    "What strategies do you use for frontend performance optimization?",
    "How do you handle state management in large-scale applications?",
    "Describe your approach to accessibility (a11y) in web applications.",
  ],
  backend: [
    "How do you design RESTful APIs that scale?",
    "Explain database indexing strategies and query optimization.",
    "How do you handle authentication and authorization in API design?",
    "What's your approach to error handling and logging in production?",
    "Describe how you'd implement rate limiting and caching.",
  ],
  fullstack: [
    "How do you manage data consistency between frontend and backend?",
    "Explain your approach to API versioning.",
    "How do you handle real-time features in a full-stack application?",
    "What deployment and CI/CD strategies do you use?",
    "How do you approach testing across the full stack?",
  ],
  javascript: [
    "Explain closures and their practical applications.",
    "What are generators and iterators in JavaScript?",
    "How does the JavaScript event loop work?",
    "Explain prototypal inheritance vs class-based inheritance.",
    "What are WeakMap and WeakSet used for?",
  ],
  typescript: [
    "How do you use TypeScript generics effectively?",
    "Explain conditional types and mapped types.",
    "How do you handle type narrowing and type guards?",
    "What are discriminated unions and when do you use them?",
    "How do you type complex API responses in TypeScript?",
  ],
  python: [
    "Explain Python's GIL and its implications for concurrency.",
    "How do you optimize Python code for performance?",
    "What are decorators and metaclasses in Python?",
    "Explain async/await in Python and when to use it.",
    "How do you handle dependency management in Python projects?",
  ],
  design: [
    "Walk us through your design process from research to delivery.",
    "How do you balance user needs with business objectives?",
    "Explain your approach to design systems and component libraries.",
    "How do you measure the success of a design?",
    "Describe how you handle design critiques and feedback.",
  ],
  data: [
    "How do you approach data modeling for analytics?",
    "Explain ETL processes and data pipeline design.",
    "What visualization techniques do you use for complex data?",
    "How do you ensure data quality in production systems?",
    "Describe A/B testing methodology and statistical significance.",
  ],
  devops: [
    "How do you design a CI/CD pipeline from scratch?",
    "Explain container orchestration with Kubernetes.",
    "How do you implement infrastructure as code?",
    "What monitoring and alerting strategies do you use?",
    "Describe your approach to disaster recovery and high availability.",
  ],
  general: [
    "Tell us about a challenging project and how you overcame obstacles.",
    "How do you stay updated with new technologies?",
    "Describe your approach to working in a team with diverse skill sets.",
    "How do you prioritize tasks when everything seems urgent?",
    "What's your experience with agile methodologies?",
  ],
};

function getQuestionsForTitle(title: string): string[] {
  const lower = title.toLowerCase();
  const matched: string[] = [];

  for (const [keyword, questions] of Object.entries(QUESTION_MAP)) {
    if (keyword === "general") continue;
    if (lower.includes(keyword)) {
      matched.push(...questions);
    }
  }

  // Always include some general questions
  if (matched.length < 5) {
    matched.push(...QUESTION_MAP.general);
  }

  // Return unique first 5
  return [...new Set(matched)].slice(0, 5);
}

export function InterviewPrepSection({
  jobTitle,
  notes,
  onNotesChange,
}: {
  jobTitle: string;
  notes: string;
  onNotesChange: (notes: string) => void;
}) {
  const suggestedQuestions = useMemo(
    () => getQuestionsForTitle(jobTitle),
    [jobTitle],
  );

  return (
    <div className="space-y-6">
      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-(--text-primary) mb-2">
          Preparation Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Write your interview prep notes here..."
          className="w-full min-h-[160px] rounded-lg border border-[rgba(60,90,140,0.5)] bg-(--bg-secondary) text-(--text-primary) placeholder:text-(--text-muted) p-3 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-(--accent-cyan) transition"
        />
      </div>

      {/* Suggested Questions */}
      <div>
        <h4 className="text-sm font-medium text-(--text-primary) mb-3">
          💡 Suggested Interview Questions
        </h4>
        <div className="space-y-2">
          {suggestedQuestions.map((q, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-[rgba(60,90,140,0.3)] bg-(--bg-secondary) p-3"
            >
              <span className="text-xs text-(--accent-cyan) font-mono shrink-0 mt-0.5">
                Q{i + 1}
              </span>
              <p className="text-sm text-(--text-secondary)">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
