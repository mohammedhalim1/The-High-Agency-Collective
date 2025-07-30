import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { supabase, isSupabaseReady } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  description?: string
}

export default function ImageUpload({ value, onChange, label, description }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

    const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setError('')

      if (!supabase || !isSupabaseReady()) {
        throw new Error('Supabase is not configured. Please set up your Supabase credentials to upload images.')
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `images/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      onChange(data.publicUrl)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadImage(acceptedFiles[0])
    }
  }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    disabled: !isSupabaseReady()
  })

  const removeImage = () => {
    onChange('')
    setError('')
  }

    return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      {description && <p className="text-sm text-gray-600">{description}</p>}

      {!isSupabaseReady() && (
        <Alert>
          <AlertDescription>
            Image upload requires Supabase configuration. You can still enter image URLs manually below.
          </AlertDescription>
        </Alert>
      )}
      
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="max-w-sm h-32 object-cover rounded-lg border"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
            onClick={removeImage}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mb-2" />
              <p className="text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-gray-600">
                {isDragActive 
                  ? 'Drop the image here...' 
                  : 'Drag & drop an image here, or click to select'
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports: JPEG, PNG, GIF, WebP
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="text-sm text-gray-500">
        Alternatively, you can enter an image URL:
      </div>
      <Input
        type="url"
        placeholder="https://example.com/image.jpg"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
