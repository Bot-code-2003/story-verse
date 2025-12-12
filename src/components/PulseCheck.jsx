"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cloud, Flame, Weight, Coffee, Skull, Waves, Zap, Droplets } from "lucide-react";

export default function PulseCheck({
  storyId,
  onPulseSubmit,
  user,
  pulseCounts = { soft: 0, intense: 0, heavy: 0, warm: 0, dark: 0 },
  userPulse = null,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const pulseOptions = [
    { label: "Soft", value: "soft", Icon: Cloud, color: "#60A5FA", pattern: Droplets },
    { label: "Intense", value: "intense", Icon: Flame, color: "#F87171", pattern: Zap },
    { label: "Heavy", value: "heavy", Icon: Weight, color: "#A78BFA", pattern: Waves },
    { label: "Warm", value: "warm", Icon: Coffee, color: "#FBBF24", pattern: Cloud },
    { label: "Dark", value: "dark", Icon: Skull, color: "#374151", pattern: Flame },
  ];

  const handlePulseClick = async (pulse) => {
    if (!user) {
      router.push(
        `/login?redirect=${encodeURIComponent(
          typeof window !== "undefined" ? window.location.pathname : "/"
        )}`
      );
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (onPulseSubmit) {
        await onPulseSubmit(pulse.value);
      }
    } catch (error) {
      console.error("Failed to submit pulse:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPulses = Object.values(pulseCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const maxCount = Math.max(...Object.values(pulseCounts), 1);

  return (
    <div className="mx-auto px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header with creative typography */}
        <div className="mb-12 text-center">
          {totalPulses > 0 && (
            <p className="mt-3 text-sm font-mono text-gray-400">
              [{totalPulses}] responses
            </p>
          )}
        </div>

        {/* Pulse options with creative layering */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-10">
          {pulseOptions.map((pulse, index) => {
            const count = pulseCounts[pulse.value] || 0;
            const isSelected = userPulse === pulse.value;
            const Icon = pulse.Icon;
            const PatternIcon = pulse.pattern;
            const heightPercentage = (count / maxCount) * 100;

            return (
              <button
                key={pulse.value}
                type="button"
                onClick={() => handlePulseClick(pulse)}
                disabled={isSubmitting}
                style={{
                  transitionDelay: `${index * 50}ms`
                }}
                className={`
                  group relative h-40 md:h-48
                  transition-all duration-500 ease-out
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
                `}
              >
                {/* Layered background cards */}
                <div className="absolute inset-0 bg-gray-900 transform rotate-2 opacity-5 transition-transform group-hover:rotate-3" />
                <div className="absolute inset-0 bg-gray-800 transform -rotate-1 opacity-5 transition-transform group-hover:-rotate-2" />
                
                {/* Main card */}
                <div className="relative h-full bg-white border border-gray-200 overflow-hidden">
                  
                  {/* Rising fill effect with pattern */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 transition-all duration-700 ease-out overflow-hidden"
                    style={{
                      height: isSelected ? '100%' : `${heightPercentage}%`,
                      backgroundColor: `${pulse.color}20`,
                    }}
                  >
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10">
                      <PatternIcon className="absolute top-2 right-2 w-6 h-6" style={{ color: pulse.color }} />
                      <PatternIcon className="absolute bottom-4 left-3 w-5 h-5" style={{ color: pulse.color }} />
                      <PatternIcon className="absolute top-1/2 left-1/2 w-4 h-4 transform -translate-x-1/2 -translate-y-1/2" style={{ color: pulse.color }} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col items-center justify-between p-5">
                    
                    {/* Top: Count badge */}
                    <div className="self-end">
                      {count > 0 && (
                        <div 
                          className="px-2 py-1 text-xs font-bold rounded"
                          style={{ 
                            backgroundColor: `${pulse.color}30`,
                            color: pulse.color 
                          }}
                        >
                          {count}
                        </div>
                      )}
                    </div>

                    {/* Center: Icon */}
                    <div className="flex-1 flex items-center justify-center">
                      <Icon
                        style={{ 
                          color: isSelected ? pulse.color : '#9CA3AF',
                          strokeWidth: isSelected ? 2.5 : 1.5
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
                      />
                    </div>

                    {/* Bottom: Label */}
                    <div className="text-center">
                      <span 
                        className="text-sm font-bold uppercase tracking-widest transition-all duration-300"
                        style={{ 
                          color: isSelected ? pulse.color : '#6B7280',
                          letterSpacing: isSelected ? '0.15em' : '0.1em'
                        }}
                      >
                        {pulse.label}
                      </span>
                    </div>
                  </div>

                  {/* Selection indicator - vertical stripe */}
                  {isSelected && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: pulse.color }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback message with creative layout */}
        {userPulse && !isSubmitting && (
          <div className="flex items-center justify-center gap-2 mb-8">
           
            <span className="text-sm font-medium text-gray-600">
              Pulse recorded
            </span>
          </div>
        )}

        {/* Login prompt with asymmetric design */}
        {!user && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 transform -skew-y-1" />
            <div className="relative px-6 py-4 text-center">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-gray-900">Sign in</span>
                {" "}→ Share your pulse
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}