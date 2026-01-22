"use client"

import { useState, useCallback, useRef } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase/factory"
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploaderProps {
    onUploadComplete: (url: string) => void
    currentImageUrl?: string
    className?: string
    folder?: string
}

export function ImageUploader({ onUploadComplete, currentImageUrl, className, folder = 'uploads' }: ImageUploaderProps) {
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null)
    const [error, setError] = useState<string | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const supabase = createSupabaseBrowserClient()

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

    // Validate and Upload
    const handleFile = useCallback(async (file: File) => {
        setError(null)

        // 1. Validation
        if (!file.type.startsWith("image/")) {
            setError("Please upload an image file (JPG, PNG).")
            return
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError("File size must be less than 5MB.")
            return
        }

        // 2. Preview
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // 3. Upload to Supabase
        setUploading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                // For MVP/Demo without forcing login on every page, we might hit RLS issues.
                // Assuming user is logged in. If not, we should probably prompt or handle gracefully.
                // But per requirements: "Only authenticated users may upload."
                throw new Error("You must be logged in to upload.")
            }

            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('uploads') // We stick to 'uploads' bucket as per migration
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 4. Get Public URL
            const { data } = supabase.storage
                .from('uploads')
                .getPublicUrl(fileName)

            onUploadComplete(data.publicUrl)

        } catch (err: any) {
            console.error("Upload failed", err)
            setError(err.message || "Failed to upload image")
            setPreview(null) // Revert preview on failure
} finally {
            setUploading(false)
        }
    }, [onUploadComplete, setError, setPreview, setDragActive, setUploading])

const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }, [handleFile])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const clearImage = (e: React.MouseEvent) => {
        e.stopPropagation()
        setPreview(null)
        onUploadComplete("") // Clear parent state
        if (inputRef.current) inputRef.current.value = ""
    }

    return (
        <div className={cn("w-full", className)}>
            <div
                className={cn(
                    "relative group cursor-pointer flex flex-col items-center justify-center w-full h-64 rounded-3xl border-4 border-dashed transition-all duration-200 overflow-hidden bg-gray-50",
                    dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:bg-gray-100 hover:border-gray-300",
                    error ? "border-red-300 bg-red-50" : ""
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleChange}
                />

                {uploading ? (
                    <div className="flex flex-col items-center gap-3 animate-pulse">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                        <p className="text-sm font-medium text-indigo-600">Uploading secure selfie...</p>
                    </div>
                ) : preview ? (
                    <div className="relative w-full h-full bg-black/90 flex items-center justify-center">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-medium flex items-center gap-2">
                                <UploadCloud className="w-5 h-5" /> Change Photo
                            </p>
                        </div>
                        <button
                            onClick={clearImage}
                            className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center px-4 space-y-4">
                        <div className="mx-auto w-16 h-16 bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <UploadCloud className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <p className="text-lg font-bold text-gray-700">
                                Click or drag your photo here
                            </p>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                                Supports JPG/PNG. Max 5MB.
                                <br />Your photo stays private.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-500 font-medium text-center animate-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    )
}
