import React, { useState, useEffect } from 'react'
import { usePageContent, useUpdatePageContent, useRealtimeContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Save, Loader2, Clock, Plus, Trash2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { AboutPageContent, CoreValue, Credential } from '@/types/pageContent'
import { createDefaultAboutContent } from '@/lib/defaultContent'

const defaultContent: AboutPageContent = createDefaultAboutContent()

export default function AboutEditor(): JSX.Element {
  const { data: pageData, isLoading } = usePageContent('about')
  const updateMutation = useUpdatePageContent()
  const [content, setContent] = useState<AboutPageContent>(defaultContent)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Enable real-time updates
  useRealtimeContent('about')

  useEffect(() => {
    if (pageData?.content) {
      const mergedContent: AboutPageContent = {
        ...defaultContent,
        ...pageData.content,
        coreValues: {
          ...defaultContent.coreValues,
          ...(pageData.content.coreValues || {}),
          items: pageData.content.coreValues?.items || defaultContent.coreValues.items
        },
        credentials: {
          ...defaultContent.credentials,
          ...(pageData.content.credentials || {}),
          items: pageData.content.credentials?.items || defaultContent.credentials.items
        }
      }
      setContent(mergedContent)
    }
  }, [pageData])

  const handleSave = async (): Promise<void> => {
    try {
      await updateMutation.mutateAsync({ slug: 'about', content })
      setHasChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const updateField = (section: keyof AboutPageContent, field: string, value: string): void => {
    setContent((prev: AboutPageContent) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateCoreValue = (index: number, field: keyof CoreValue, value: string): void => {
    setContent((prev: AboutPageContent) => {
      if (!prev.coreValues?.items || !Array.isArray(prev.coreValues.items)) {
        return prev
      }
      return {
        ...prev,
        coreValues: {
          ...prev.coreValues,
          items: prev.coreValues.items.map((item: CoreValue, i: number) =>
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    })
    setHasChanges(true)
  }

  const addCoreValue = (): void => {
    const newValue: CoreValue = {
      title: "New Value",
      description: "Description for this core value",
      icon: "+"
    }
    setContent((prev: AboutPageContent) => ({
      ...prev,
      coreValues: {
        ...prev.coreValues,
        items: [...(prev.coreValues?.items || []), newValue]
      }
    }))
    setHasChanges(true)
  }

  const removeCoreValue = (index: number): void => {
    setContent((prev: AboutPageContent) => ({
      ...prev,
      coreValues: {
        ...prev.coreValues,
        items: prev.coreValues.items.filter((_: CoreValue, i: number) => i !== index)
      }
    }))
    setHasChanges(true)
  }

  const updateCredential = (index: number, field: keyof Credential, value: string): void => {
    setContent((prev: AboutPageContent) => {
      if (!prev.credentials?.items || !Array.isArray(prev.credentials.items)) {
        return prev
      }
      return {
        ...prev,
        credentials: {
          ...prev.credentials,
          items: prev.credentials.items.map((item: Credential, i: number) =>
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    })
    setHasChanges(true)
  }

  const addCredential = (): void => {
    const newCredential: Credential = {
      title: "New Credential",
      organization: "Organization Name"
    }
    setContent((prev: AboutPageContent) => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        items: [...(prev.credentials?.items || []), newCredential]
      }
    }))
    setHasChanges(true)
  }

  const removeCredential = (index: number): void => {
    setContent((prev: AboutPageContent) => ({
      ...prev,
      credentials: {
        ...prev.credentials,
        items: prev.credentials.items.filter((_: Credential, i: number) => i !== index)
      }
    }))
    setHasChanges(true)
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
          <h2 className="text-3xl font-bold text-gray-900">Edit About Page</h2>
          <p className="text-gray-600 mt-2">
            Manage your about page content including hero section, core values, and credentials.
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
            The main introduction and coach portrait
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={content.hero.title}
              onChange={(e) => updateField('hero', 'title', e.target.value)}
              placeholder="Main title"
            />
          </div>

          <div>
            <Label htmlFor="hero-subtitle">Quote/Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={content.hero.subtitle}
              onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
              placeholder="Quote or subtitle"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-description">First Description</Label>
            <Textarea
              id="hero-description"
              value={content.hero.description}
              onChange={(e) => updateField('hero', 'description', e.target.value)}
              placeholder="First paragraph about your journey"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hero-quote">Second Description</Label>
            <Textarea
              id="hero-quote"
              value={content.hero.quote}
              onChange={(e) => updateField('hero', 'quote', e.target.value)}
              placeholder="Second paragraph about your mission"
              rows={3}
            />
          </div>

          <ImageUpload
            label="Coach Portrait"
            description="Your professional photo"
            value={content.hero.backgroundImage}
            onChange={(url: string) => updateField('hero', 'backgroundImage', url)}
          />
        </CardContent>
      </Card>

      {/* Core Values Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Core Values Section</CardTitle>
              <CardDescription>
                Your guiding principles and values
              </CardDescription>
            </div>
            <Button onClick={addCoreValue} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Value
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="values-title">Section Title</Label>
            <Input
              id="values-title"
              value={content.coreValues.title}
              onChange={(e) => updateField('coreValues', 'title', e.target.value)}
              placeholder="Section title"
            />
          </div>
          
          <div>
            <Label htmlFor="values-description">Section Description</Label>
            <Textarea
              id="values-description"
              value={content.coreValues.description}
              onChange={(e) => updateField('coreValues', 'description', e.target.value)}
              placeholder="Section description"
              rows={2}
            />
          </div>

          <Separator />

          {(content.coreValues?.items || []).map((value: CoreValue, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Core Value {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCoreValue(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={value.title}
                    onChange={(e) => updateCoreValue(index, 'title', e.target.value)}
                    placeholder="Value title"
                  />
                </div>
                <div>
                  <Label>Icon/Letter</Label>
                  <Input
                    value={value.icon}
                    onChange={(e) => updateCoreValue(index, 'icon', e.target.value)}
                    placeholder="Single letter or emoji"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={value.description}
                    onChange={(e) => updateCoreValue(index, 'description', e.target.value)}
                    placeholder="Value description"
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Credentials Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Credentials Section</CardTitle>
              <CardDescription>
                Your certifications and training
              </CardDescription>
            </div>
            <Button onClick={addCredential} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Credential
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="credentials-title">Section Title</Label>
            <Input
              id="credentials-title"
              value={content.credentials.title}
              onChange={(e) => updateField('credentials', 'title', e.target.value)}
              placeholder="Section title"
            />
          </div>

          <Separator />

          {(content.credentials?.items || []).map((credential: Credential, index: number) => (
            <Card key={index} className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Credential {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeCredential(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={credential.title}
                    onChange={(e) => updateCredential(index, 'title', e.target.value)}
                    placeholder="Credential title"
                  />
                </div>
                <div>
                  <Label>Organization</Label>
                  <Input
                    value={credential.organization}
                    onChange={(e) => updateCredential(index, 'organization', e.target.value)}
                    placeholder="Issuing organization"
                  />
                </div>
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action Section</CardTitle>
          <CardDescription>
            Encourage visitors to take the next step
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cta-title">Title</Label>
            <Input
              id="cta-title"
              value={content.cta.title}
              onChange={(e) => updateField('cta', 'title', e.target.value)}
              placeholder="CTA title"
            />
          </div>
          
          <div>
            <Label htmlFor="cta-description">Description</Label>
            <Textarea
              id="cta-description"
              value={content.cta.description}
              onChange={(e) => updateField('cta', 'description', e.target.value)}
              placeholder="CTA description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cta-button-text">Button Text</Label>
              <Input
                id="cta-button-text"
                value={content.cta.buttonText}
                onChange={(e) => updateField('cta', 'buttonText', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="cta-button-link">Button Link</Label>
              <Input
                id="cta-button-link"
                value={content.cta.buttonLink}
                onChange={(e) => updateField('cta', 'buttonLink', e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
