import { useState, useEffect } from 'react';

/**
 * Custom hook for simulating progress during AI generation
 * Since we don't have real-time API progress, this provides UX feedback
 * 
 * @param isGenerating - Whether generation is currently active
 * @param estimatedDuration - Expected generation time in seconds (default: 20s)
 * @returns { progress: 0-100, eta: seconds remaining }
 */
export function useGenerationProgress(
    isGenerating: boolean,
    estimatedDuration: number = 20
) {
    const [progress, setProgress] = useState(0);
    const [eta, setEta] = useState(estimatedDuration);

    useEffect(() => {
        if (!isGenerating) {
            setProgress(0);
            setEta(estimatedDuration);
            return;
        }

        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;

            // Progress up to 95%, then hold for actual completion
            const calculatedProgress = Math.min((elapsed / estimatedDuration) * 95, 95);
            setProgress(calculatedProgress);

            // Countdown ETA
            const remainingTime = Math.max(0, Math.ceil(estimatedDuration - elapsed));
            setEta(remainingTime);
        }, 100); // Update every 100ms for smooth animation

        return () => clearInterval(interval);
    }, [isGenerating, estimatedDuration]);

    return { progress, eta };
}
