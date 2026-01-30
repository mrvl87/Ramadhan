'use client';

import { useEffect, useState } from 'react';
import { Loader2, Sparkles, Wand2, CheckCircle2 } from 'lucide-react';


const STEPS = [
    { id: 1, label: 'Uploading & Processing...', duration: 2000, icon: Loader2 },
    { id: 2, label: 'Analyzing Face Features...', duration: 3000, icon: Wand2 },
    { id: 3, label: 'Dreaming up your scene...', duration: 8000, icon: Sparkles },
    { id: 4, label: 'Adding Final Polish...', duration: 4000, icon: CheckCircle2 },
];

const FUN_FACTS = [
    "Did you know? AI generates pixels based on patterns it learned from millions of images.",
    "Your photo is being transformed into a unique piece of art!",
    "Ramadan Mubarak! We're crafting a special memory for you.",
    "Almost there! Just adding some digital magic dust.",
    "Diffusing noise into clarity...",
];

export function GenerationOverlay({ isVisible }: { isVisible: boolean }) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [factIndex, setFactIndex] = useState(0);

    useEffect(() => {
        if (!isVisible) {
            setCurrentStepIndex(0);
            setProgress(0);
            return;
        }

        let stepTimeout: NodeJS.Timeout;
        let progressInterval: NodeJS.Timeout;
        let factInterval: NodeJS.Timeout;

        // Cycle through facts
        factInterval = setInterval(() => {
            setFactIndex((prev) => (prev + 1) % FUN_FACTS.length);
        }, 4000);

        // Simulate Step Progression
        const runSteps = async () => {
            let accumulatedTime = 0;

            for (let i = 0; i < STEPS.length; i++) {
                if (!isVisible) break;
                setCurrentStepIndex(i);

                const stepDuration = STEPS[i].duration;
                const startTime = Date.now();

                // Smarter progress bar: interpolates from current progress to next target
                // We'll just execute a wait here, but a real progress bar would need a requestAnimationFrame
                // For simplicity, we just wait.

                await new Promise(resolve => setTimeout(resolve, stepDuration));
            }
        };

        runSteps();

        // Separate progress bar simulation (0 to 95% over 15 seconds)
        let currentProgress = 0;
        progressInterval = setInterval(() => {
            currentProgress += 1; // Increment bit by bit
            if (currentProgress > 95) currentProgress = 95; // Cap at 95 until done
            setProgress(currentProgress);
        }, 150); // 150ms * 100 ~ 15s

        return () => {
            clearInterval(factInterval);
            clearInterval(progressInterval);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    const CurrentIcon = STEPS[currentStepIndex]?.icon || Loader2;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md transition-all duration-500">
            <div className="w-full max-w-md bg-card rounded-3xl shadow-warm-xl border-0 p-8 text-center space-y-8 animate-in fade-in zoom-in duration-300">

                {/* Main Icon Animation */}
                <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
                    <div className="relative bg-gradient-to-tr from-amber-500 to-yellow-500 rounded-2xl p-5 shadow-glow-gold">
                        <CurrentIcon className="w-12 h-12 text-white animate-pulse" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-foreground">
                        {STEPS[currentStepIndex]?.label || "Processing..."}
                    </h3>

                    <div className="space-y-2">
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">{Math.round(progress)}%</p>
                    </div>
                </div>

                {/* Fun Fact */}
                <div className="bg-accent/50 rounded-xl p-4 min-h-[80px] flex items-center justify-center">
                    <p className="text-primary text-sm font-medium animate-in fade-in slide-in-from-bottom-2 duration-500 key-{factIndex}">
                        ✨ {FUN_FACTS[factIndex]}
                    </p>
                </div>

            </div>
        </div>
    );
}
