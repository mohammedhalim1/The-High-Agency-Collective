import React, { useState, useEffect } from 'react'
import { usePageContent, useUpdatePageContent, useRealtimeContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Save, Loader2, Clock, Plus, Trash2, Upload, FileText } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { ContactPageContent, SocialLink } from '@/types/pageContent'
import { createDefaultContactContent } from '@/lib/defaultContent'

const defaultContent: ContactPageContent = createDefaultContactContent()

export default function ContactEditor(): JSX.Element {
  const { data: pageData, isLoading } = usePageContent('contact')
  const updateMutation = useUpdatePageContent()
  const [content, setContent] = useState<ContactPageContent>(defaultContent)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  const [pdfUploading, setPdfUploading] = useState<boolean>(false)

  // Enable real-time updates
  useRealtimeContent('contact')

  useEffect(() => {
    if (pageData?.content) {
      const mergedContent: ContactPageContent = {
        ...defaultContent,
        ...pageData.content,
        socialLinks: {
          ...defaultContent.socialLinks,
          ...(pageData.content.socialLinks || {}),
          items: pageData.content.socialLinks?.items || defaultContent.socialLinks.items
        }
      }
      setContent(mergedContent)
    }
  }, [pageData])

  const handleSave = async (): Promise<void> => {
    try {
      await updateMutation.mutateAsync({ slug: 'contact', content })
      setHasChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const updateField = (section: keyof ContactPageContent, field: string, value: string): void => {
    setContent((prev: ContactPageContent) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string): void => {
    setContent((prev: ContactPageContent) => {
      if (!prev.socialLinks?.items || !Array.isArray(prev.socialLinks.items)) {
        return prev
      }
      return {
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          items: prev.socialLinks.items.map((item: SocialLink, i: number) =>
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    })
    setHasChanges(true)
  }

  const addSocialLink = (): void => {
    const newLink: SocialLink = {
      platform: "New Platform",
      url: "https://example.com",
      icon: "🔗",
      description: "Platform description"
    }
    setContent((prev: ContactPageContent) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        items: [...(prev.socialLinks?.items || []), newLink]
      }
    }))
    setHasChanges(true)
  }

  const removeSocialLink = (index: number): void => {
    setContent((prev: ContactPageContent) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        items: prev.socialLinks.items.filter((_: SocialLink, i: number) => i !== index)
      }
    }))
    setHasChanges(true)
  }

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file only.')
      return
    }

    setPdfUploading(true)
    try {
      // This would typically use your file upload service
      // For now, creating a mock URL - replace with actual upload logic
      const formData = new FormData()
      formData.append('file', file)
      
      // Replace this with your actual upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) throw new Error('Upload failed')
      
      const { url } = await response.json()
      
      setContent((prev: ContactPageContent) => ({
        ...prev,
        alternative: {
          ...prev.alternative,
          pdfUrl: url,
          filename: file.name
        }
      }))
      setHasChanges(true)
    } catch (error) {
      console.error('PDF upload failed:', error)
      alert('PDF upload failed. Please try again.')
    } finally {
      setPdfUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!content) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Initializing content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Edit Contact Page</h2>
          <p className="text-gray-600 mt-2">
            Manage your contact page content including form settings and social links.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {hasChanges && (
            <div className="flex items-center text-orange-600 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              Unsaved changes
            </div>
          )}
          <Button 
            onClick={handleSave} 
            disabled={updateMutation.isPending || !hasChanges}
          >
            {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
          <CardDescription>
            Main contact page header with background image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={content.hero.title}
              onChange={(e) => updateField('hero', 'title', e.target.value)}
              placeholder="Contact page title"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-description">Description</Label>
            <Textarea
              id="hero-description"
              value={content.hero.description}
              onChange={(e) => updateField('hero', 'description', e.target.value)}
              placeholder="Contact page description"
              rows={3}
            />
          </div>

          <ImageUpload
            label="Background Image"
            description="Hero section background image"
            value={content.hero.backgroundImage}
            onChange={(url: string) => updateField('hero', 'backgroundImage', url)}
          />
        </CardContent>
      </Card>

      {/* Contact Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
          <CardDescription>
            Form labels, placeholder text, and Formspree configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="form-title">Form Title</Label>
            <Input
              id="form-title"
              value={content.form.title}
              onChange={(e) => updateField('form', 'title', e.target.value)}
              placeholder="Form section title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name-placeholder">Name Field Placeholder</Label>
              <Input
                id="name-placeholder"
                value={content.form.namePlaceholder}
                onChange={(e) => updateField('form', 'namePlaceholder', e.target.value)}
                placeholder="Name placeholder text"
              />
            </div>
            <div>
              <Label htmlFor="email-placeholder">Email Field Placeholder</Label>
              <Input
                id="email-placeholder"
                value={content.form.emailPlaceholder}
                onChange={(e) => updateField('form', 'emailPlaceholder', e.target.value)}
                placeholder="Email placeholder text"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message-placeholder">Message Field Placeholder</Label>
            <Textarea
              id="message-placeholder"
              value={content.form.messagePlaceholder}
              onChange={(e) => updateField('form', 'messagePlaceholder', e.target.value)}
              placeholder="Message placeholder text"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="submit-button">Submit Button Text</Label>
            <Input
              id="submit-button"
              value={content.form.submitButtonText}
              onChange={(e) => updateField('form', 'submitButtonText', e.target.value)}
              placeholder="Submit button text"
            />
          </div>

          <div>
            <Label htmlFor="formspree-url">Formspree URL</Label>
            <Input
              id="formspree-url"
              value={content.form.formspreeUrl || defaultContent.form.formspreeUrl}
              onChange={(e) => updateField('form', 'formspreeUrl', e.target.value)}
              placeholder="https://formspree.io/f/xvgqqrdl"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your Formspree endpoint URL. If empty, will use the default: {defaultContent.form.formspreeUrl}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Booking Section */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Section</CardTitle>
          <CardDescription>
            Direct booking information and calendar integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="booking-title">Title</Label>
            <Input
              id="booking-title"
              value={content.booking.title}
              onChange={(e) => updateField('booking', 'title', e.target.value)}
              placeholder="Booking section title"
            />
          </div>
          
          <div>
            <Label htmlFor="booking-description">Description</Label>
            <Textarea
              id="booking-description"
              value={content.booking.description}
              onChange={(e) => updateField('booking', 'description', e.target.value)}
              placeholder="Booking section description"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="booking-placeholder">Calendar Placeholder Text</Label>
            <Input
              id="booking-placeholder"
              value={content.booking.placeholderText}
              onChange={(e) => updateField('booking', 'placeholderText', e.target.value)}
              placeholder="Calendar integration placeholder"
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Your social media and contact links
              </CardDescription>
            </div>
            <Button onClick={addSocialLink} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="social-title">Section Title</Label>
            <Input
              id="social-title"
              value={content.socialLinks.title}
              onChange={(e) => updateField('socialLinks', 'title', e.target.value)}
              placeholder="Social links section title"
            />
          </div>

          <Separator />

          {(content.socialLinks?.items || []).map((link: SocialLink, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Social Link {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Platform Name</Label>
                    <Input
                      value={link.platform}
                      onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                      placeholder="Instagram"
                    />
                  </div>
                  <div>
                    <Label>Icon/Abbreviation</Label>
                    <Input
                      value={link.icon}
                      onChange={(e) => updateSocialLink(index, 'icon', e.target.value)}
                      placeholder="IG"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div>
                  <Label>URL</Label>
                  <Input
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder="https://instagram.com/username"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={link.description}
                    onChange={(e) => updateSocialLink(index, 'description', e.target.value)}
                    placeholder="Daily inspiration & insights"
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Alternative Resource Section */}
      <Card>
        <CardHeader>
          <CardTitle>Alternative Resource</CardTitle>
          <CardDescription>
            Provide a Google Drive link to a PDF resource for visitors not ready to contact directly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="drive-link">Google Drive PDF Link</Label>
            <Input
              id="drive-link"
              value={content.contact?.driveLink || ''}
              onChange={(e) => updateField('contact', 'driveLink', e.target.value)}
              placeholder="https://drive.google.com/file/d/your-file-id/view"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
