import { useState } from "react";
import { WizardState, INITIAL_WIZARD_STATE } from "../../types";
import { generateComplexPrompt, SAFETY_NEGATIVE_PROMPT } from "../../lib/prompt-mapper";
import { generateFamilyPhotoAction } from "../../actions"; // Actions
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { StepFive } from "./StepFive";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RamadhanPhotoWizardProps {
    imageUrls: string[];
    onSuccess: (url: string) => void;
    isGenerating?: boolean; // Prop to allow parent to know/control, but we mostly manage here?
    setIsGenerating?: (val: boolean) => void;
    onCreditError?: () => void; // Handler for credit exhaustion
}

export function RamadhanPhotoWizard({ imageUrls, onSuccess, isGenerating, setIsGenerating, onCreditError }: RamadhanPhotoWizardProps) {
    const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);

    // Local loading state if not provided by parent
    const [localIsGenerating, setLocalIsGenerating] = useState(false);
    const loading = isGenerating !== undefined ? isGenerating : localIsGenerating;
    const setLoading = setIsGenerating || setLocalIsGenerating;

    const updateConfig = (updates: Partial<WizardState['config']>) => {
        setState(prev => ({ ...prev, config: { ...prev.config, ...updates } }));
    };

    const nextStep = () => setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 5) }));
    const prevStep = () => setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));

    const handleGenerate = async () => {
        if (!imageUrls || imageUrls.length === 0) {
            toast.error("Please upload an image first.");
            return;
        }

        setLoading(true);
        try {
            // 1. Map State to Complex Prompt
            let prompt = generateComplexPrompt(state);

            // 2. Append Caption (Integration Logic)
            const { greeting } = state.config;
            const captionText = greeting.generated ? greeting.message : (greeting.message || greeting.recipient);
            // Logic: if message exists, use it. Recipient is metadata, usually not printed unless specified.

            if (captionText) {
                prompt += ` Include text "${captionText.replace(/"/g, "'")}" written elegantly at the bottom.`;
            }

            // 3. Append Negative Prompt (Standard)
            // Usually handled by API param 'negative_prompt', but prompt-mapper logic separates it.
            // We'll trust the prompt-mapper's positive string is robust. 
            // If the API supported negative_prompt separate arg, we'd pass SAFETY_NEGATIVE_PROMPT.
            // Actions.ts calls generateContent.
            // Flux/Nano Banana usually works well with just positive description.
            // Let's rely on the positive prompt "High quality..." and implicit negatives from the model.

            console.log("Wizard Generated Prompt:", prompt);

            // 4. Call API
            const result = await generateFamilyPhotoAction({
                imageUrls,
                promptOverride: prompt,
                // We must still pass required fields to satisfy TS, though promptOverride takes precedence logic-wise
                style: 'realistic', // Dummy
                mode: 'family', // Dummy
                aspectRatio: state.config.aspectRatio,
                // Pass other metadata if needed
            });


            if (result.success && result.data) {
                onSuccess(result.data);
                toast.success("Foto berhasil dibuat! ✨");
            } else if (!result.success) {
                // Check if error is related to insufficient credits
                const errorMsg = result.error || "";
                if (errorMsg.toLowerCase().includes("insufficient credits") ||
                    errorMsg.toLowerCase().includes("error checking balance")) {
                    // Trigger paywall modal
                    if (onCreditError) {
                        onCreditError();
                    } else {
                        toast.error("Kredit habis. Silakan upgrade untuk melanjutkan.");
                    }
                } else {
                    toast.error("Gagal membuat foto: " + result.error);
                }
            } else {
                toast.error("Gagal membuat foto: Unknown error");
            }

        } catch (e: any) {
            // Also check exception message for credit errors
            const errorMsg = e.message || "";
            if (errorMsg.toLowerCase().includes("insufficient credits") ||
                errorMsg.toLowerCase().includes("error checking balance")) {
                if (onCreditError) {
                    onCreditError();
                } else {
                    toast.error("Kredit habis. Silakan upgrade untuk melanjutkan.");
                }
            } else {
                toast.error("Terjadi kesalahan: " + e.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderCurrentStep = () => {
        switch (state.currentStep) {
            case 1: return <StepOne config={state.config} updateConfig={updateConfig} />;
            case 2: return <StepTwo config={state.config} updateConfig={updateConfig} />;
            case 3: return <StepThree config={state.config} updateConfig={updateConfig} />;
            case 4: return <StepFour config={state.config} updateConfig={updateConfig} />;
            case 5: return <StepFive config={state.config} updateConfig={updateConfig} onGenerate={handleGenerate} isGenerating={loading} />;
            default: return null;
        }
    };

    return (
        <div className="bg-card rounded-2xl shadow-warm-lg border-0 overflow-hidden flex flex-col min-h-[500px]">
            {/* Header / Progress */}
            <div className="bg-accent/50 border-b border-border/50 p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">Langkah {state.currentStep} dari 5</span>
                    <span className="text-xs text-muted-foreground">Wizard Mode</span>
                </div>
                <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500 ease-out"
                        style={{ width: `${(state.currentStep / 5) * 100}%` }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 relative">
                {renderCurrentStep()}
            </div>

            {/* Footer Navigation (Exceptions for Step 5 which has its own big button) */}
            {state.currentStep < 5 && (
                <div className="p-4 border-t border-border/50 bg-accent/50 flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={state.currentStep === 1}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                    <Button
                        variant="teal"
                        onClick={nextStep}
                    >
                        Lanjut <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                </div>
            )}
            {state.currentStep === 5 && (
                <div className="p-4 border-t border-border/50 bg-accent/50 flex justify-start">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={loading}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Kembali
                    </Button>
                </div>
            )}
        </div>
    );
}
