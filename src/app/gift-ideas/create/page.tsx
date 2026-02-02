'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { StepOne } from '@/features/gift-ideas/components/wizard/StepOne'
import { StepTwo } from '@/features/gift-ideas/components/wizard/StepTwo'
import { StepThree } from '@/features/gift-ideas/components/wizard/StepThree'
import { StepFour } from '@/features/gift-ideas/components/wizard/StepFour'
import { GenerationOverlay } from '@/features/gift-ideas/components/GenerationOverlay'
import { generateGiftIdeas } from '@/features/gift-ideas/actions'
import { useToast } from '@/hooks/use-toast'
import type { WizardState, RecipientType, Occasion } from '@/features/gift-ideas/types'
import { ImageCacheProvider } from '@/features/gift-ideas/contexts/ImageCacheContext'

export default function CreateGiftIdeasPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [currentStep, setCurrentStep] = useState(1)
    const [isGenerating, setIsGenerating] = useState(false)

    const [formData, setFormData] = useState<WizardState>({
        recipient_type: null as any,
        gender: undefined,
        budget_min: 100000,
        budget_max: 500000,
        interests: [],
        occasion: 'ramadan',
        additional_notes: ''
    })

    const totalSteps = 4

    const updateField = <K extends keyof WizardState>(
        field: K,
        value: WizardState[K]
    ) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.recipient_type !== null && formData.gender !== undefined
            case 2:
                return formData.budget_min > 0 && formData.budget_max >= formData.budget_min
            case 3:
                return true // Optional step
            case 4:
                return true // Optional step
            default:
                return false
        }
    }

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleGenerate = async () => {
        if (!formData.recipient_type) {
            toast({
                title: 'Missing information',
                description: 'Please select a recipient type',
                variant: 'destructive'
            })
            return
        }

        setIsGenerating(true)

        try {
            const result = await generateGiftIdeas(formData as Required<WizardState>)

            if (result.error) {
                toast({
                    title: 'Generation failed',
                    description: result.error,
                    variant: 'destructive'
                })
                return
            }

            if (result.data) {
                toast({
                    title: '🎁 Gift ideas generated!',
                    description: 'Redirecting you to the results...'
                })

                // Redirect to results page
                router.push(`/gift-ideas/results/${result.data.id}`)
            }
        } catch (error: any) {
            toast({
                title: 'An error occurred',
                description: error.message || 'Please try again',
                variant: 'destructive'
            })
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <ImageCacheProvider>
            <div className="min-h-screen bg-background relative">
                <GenerationOverlay
                    isVisible={isGenerating}
                    recipientType={formData.recipient_type || 'Penerima'}
                    gender={formData.gender}
                />

                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-foreground mb-3">
                            🎁 Find the Perfect Gift
                        </h1>
                        <p className="text-muted-foreground">
                            AI-powered gift recommendations for Ramadan & Eid
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-muted-foreground">
                                Step {currentStep} of {totalSteps}
                            </span>
                            <span className="text-sm font-medium text-primary">
                                {Math.round((currentStep / totalSteps) * 100)}% Complete
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-amber-500 to-yellow-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step Content */}
                    <Card className="p-8 mb-6 shadow-lg">
                        {currentStep === 1 && (
                            <StepOne
                                value={formData.recipient_type}
                                gender={formData.gender}
                                onChange={(type) => updateField('recipient_type', type)}
                                onGenderChange={(gender) => updateField('gender', gender)}
                            />
                        )}

                        {currentStep === 2 && (
                            <StepTwo
                                budgetMin={formData.budget_min}
                                budgetMax={formData.budget_max}
                                onChange={(min, max) => {
                                    updateField('budget_min', min)
                                    updateField('budget_max', max)
                                }}
                            />
                        )}

                        {currentStep === 3 && (
                            <StepThree
                                interests={formData.interests}
                                onChange={(interests) => updateField('interests', interests)}
                            />
                        )}

                        {currentStep === 4 && (
                            <StepFour
                                occasion={formData.occasion}
                                additionalNotes={formData.additional_notes || ''}
                                onOccasionChange={(occasion) => updateField('occasion', occasion)}
                                onNotesChange={(notes) => updateField('additional_notes', notes)}
                            />
                        )}
                    </Card>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={currentStep === 1 || isGenerating}
                            className="gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </Button>

                        {currentStep < totalSteps ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed() || isGenerating}
                                variant="gold"
                                className="gap-2"
                            >
                                Next
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleGenerate}
                                disabled={!canProceed() || isGenerating}
                                variant="gold"
                                className="gap-2 min-w-[200px]"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Generate Gift Ideas
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    {/* Step Indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: totalSteps }).map((_, idx) => (
                            <div
                                key={idx}
                                className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${currentStep > idx + 1
                                        ? 'bg-primary'
                                        : currentStep === idx + 1
                                            ? 'bg-primary w-4'
                                            : 'bg-muted'
                                    }
              `}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </ImageCacheProvider>
    )
}

