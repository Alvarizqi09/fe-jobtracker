"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { ProfileStepper } from "@/components/profile/ProfileStepper";
import { ProfileCompleteness } from "@/components/profile/ProfileCompleteness";
import { PersonalInfoStep } from "@/components/profile/steps/PersonalInfoStep";
import { WorkExperienceStep } from "@/components/profile/steps/WorkExperienceStep";
import { EducationStep } from "@/components/profile/steps/EducationStep";
import { SkillsStep } from "@/components/profile/steps/SkillsStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useProfileStore } from "@/store/profileStore";

const STEPS = [
  "Personal Info",
  "Work Experience",
  "Education",
  "Skills & More",
];

export default function ProfilePage() {
  const { fetchProfile, saveProfile, loading } = useProfile();
  const { profile } = useProfileStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetchProfile().finally(() => setIsReady(true));
  }, [fetchProfile]);

  const navigateStep = async (newStep: number) => {
    // Auto save on navigation
    if (profile) {
      await saveProfile(profile);
    }
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      navigateStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      navigateStep(currentStep - 1);
    }
  };

  const handleSaveAndFinish = async () => {
    if (profile) {
      await saveProfile(profile);
    }
  };

  const isStepValid = () => {
    if (!profile) return false;
    if (currentStep === 0) {
      return !!(
        profile.headline?.trim() &&
        profile.location?.trim() &&
        profile.summary?.trim()
      );
    }
    if (currentStep === 1) {
      return profile.workExperience.length >= 1;
    }
    if (currentStep === 2) {
      return profile.education.length >= 1;
    }
    if (currentStep === 3) {
      return profile.skills.length >= 5 && profile.achievements.length >= 2;
    }
    return true;
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  if (!isReady) {
    return (
      <div className="p-8 text-center text-muted-foreground animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your Profile</h1>
        <p className="text-muted-foreground">
          Complete your profile to generate highly personalized AI cover
          letters.
        </p>
      </div>

      <ProfileStepper
        currentStep={currentStep}
        steps={STEPS}
        setStep={navigateStep}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 overflow-x-hidden relative min-h-[300px] sm:min-h-[500px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="w-full"
            >
              {currentStep === 0 && <PersonalInfoStep />}
              {currentStep === 1 && <WorkExperienceStep />}
              {currentStep === 2 && <EducationStep />}
              {currentStep === 3 && <SkillsStep />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <ProfileCompleteness />

          <Card>
            <div className="p-4 flex flex-col gap-3">
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handlePrev}
                  disabled={currentStep === 0 || loading}
                >
                  Previous
                </Button>
                {currentStep < STEPS.length - 1 ? (
                  <Button
                    className="flex-1"
                    onClick={handleNext}
                    disabled={loading || !isStepValid()}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    onClick={handleSaveAndFinish}
                    disabled={loading || !isStepValid()}
                  >
                    Save & Finish
                  </Button>
                )}
              </div>
              <p className="text-xs text-center text-muted-foreground">
                Your progress is automatically saved when navigating between
                steps.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
