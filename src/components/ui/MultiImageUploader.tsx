"use client"

import { useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { UploadCloud, X, Loader2, Image as ImageIcon, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface MultiImageUploaderProps {
    onImagesChange: (urls: string[]) => void
    currentImages?: string[]
    className?: string
    folder?: string
    maxImages?: number
}

export function MultiImageUploader({
    onImagesChange,
    currentImages = [],
    className,
    folder = 'uploads',
    maxImages = 4
}: MultiImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const supabase = createClient()

    // Handle Drag Events
    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }, [])

    const uploadFile = async (file: File): Promise<string> => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("You must be logged in to upload.")

        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('uploads')
            .getPublicUrl(fileName)

        return data.publicUrl
    }

    const handleFiles = async (files: FileList | File[]) => {
        setError(null)
        setUploading(true)

        try {
            const newUrls: string[] = []
            const fileArray = Array.from(files)

            // Validation & Upload Loop
            for (const file of fileArray) {
                if (currentImages.length + newUrls.length >= maxImages) {
                    setError(`Maximum ${maxImages} images allowed.`)
                    break
                }

                if (!file.type.startsWith("image/")) {
                    setError("Skipped non-image file.")
                    continue
                }
                if (file.size > 5 * 1024 * 1024) {
                    setError("Skipped large file (>5MB).")
                    continue
                }

                const url = await uploadFile(file)
                newUrls.push(url)
            }

            if (newUrls.length > 0) {
                onImagesChange([...currentImages, ...newUrls])
            }

        } catch (err: any) {
            console.error("Upload failed", err)
            setError(err.message || "Failed to upload image")
        } finally {
            setUploading(false)
        }
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files)
        }
    }, [currentImages])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files)
        }
    }

    const removeImage = (indexToRemove: number) => {
        const newImages = currentImages.filter((_, index) => index !== indexToRemove)
        onImagesChange(newImages)
    }

    return (
        <div className={cn("w-full space-y-4", className)}>
            {/* Grid for existing images */}
            {currentImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                    {currentImages.map((url, index) => (
                        <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                            <img src={url} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => removeImage(index)}
                                    className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 shadow-sm"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add More Button (if under limit) */}
                    {currentImages.length < maxImages && (
                        <div
                            onClick={() => inputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-400 hover:text-emerald-500 hover:border-emerald-300 transition-all"
                        >
                            <Plus className="w-8 h-8 mb-1" />
                            <span className="text-xs font-bold">Add Photo</span>
                        </div>
                    )}
                </div>
            )}

            {/* Dropzone */}

            {currentImages.length === 0 && (
                <div
                    className={cn(
                        "relative group cursor-pointer flex flex-col items-center justify-center w-full h-48 rounded-3xl border-4 border-dashed transition-all duration-200 overflow-hidden bg-gray-50",
                        dragActive ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:bg-slate-100 hover:border-slate-300",
                        error ? "border-red-300 bg-red-50" : ""
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                >
                    {uploading ? (
                        <div className="flex flex-col items-center gap-3 animate-pulse">
                            <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                            <p className="text-sm font-medium text-emerald-600">Uploading...</p>
                        </div>
                    ) : (
                        <div className="text-center px-4 space-y-4">
                            <div className="mx-auto w-12 h-12 bg-white rounded-full shadow-sm border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <UploadCloud className="w-6 h-6 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-700">
                                    Upload Photos
                                </p>
                                <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                                    Main photo + close-ups for better faces.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                accept="image/*"
                onChange={handleChange}
            />

            {error && (
                <p className="mt-2 text-sm text-red-500 font-medium text-center animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    )
}
