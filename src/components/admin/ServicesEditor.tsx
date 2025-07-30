import React, { useState, useEffect } from 'react'
import { usePageContent, useUpdatePageContent, useRealtimeContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Save, Loader2, Clock, Plus, Trash2 } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { ServicesPageContent, Service, ServiceFeature, ComparisonItem } from '@/types/pageContent'
import { createDefaultServicesContent } from '@/lib/defaultContent'

const defaultContent: ServicesPageContent = createDefaultServicesContent()

export default function ServicesEditor(): JSX.Element {
  const { data: pageData, isLoading } = usePageContent('services')
  const updateMutation = useUpdatePageContent()
  const [content, setContent] = useState<ServicesPageContent>(defaultContent)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Enable real-time updates
  useRealtimeContent('services')

  useEffect(() => {
    if (pageData?.content) {
      const mergedContent: ServicesPageContent = {
        ...defaultContent,
        ...pageData.content,
        services: {
          ...defaultContent.services,
          ...(pageData.content.services || {}),
          items: pageData.content.services?.items || defaultContent.services.items
        },
        comparison: {
          ...defaultContent.comparison,
          ...(pageData.content.comparison || {}),
          singleSessions: {
            ...defaultContent.comparison.singleSessions,
            ...(pageData.content.comparison?.singleSessions || {}),
            items: pageData.content.comparison?.singleSessions?.items || defaultContent.comparison.singleSessions.items
          },
          packagePrograms: {
            ...defaultContent.comparison.packagePrograms,
            ...(pageData.content.comparison?.packagePrograms || {}),
            items: pageData.content.comparison?.packagePrograms?.items || defaultContent.comparison.packagePrograms.items
          }
        }
      }
      setContent(mergedContent)
    }
  }, [pageData])

  const handleSave = async (): Promise<void> => {
    try {
      await updateMutation.mutateAsync({ slug: 'services', content })
      setHasChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const updateField = (section: keyof ServicesPageContent, field: string, value: string): void => {
    setContent((prev: ServicesPageContent) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateService = (index: number, field: keyof Service, value: string | boolean): void => {
    setContent((prev: ServicesPageContent) => {
      if (!prev.services?.items || !Array.isArray(prev.services.items)) {
        return prev
      }
      return {
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.map((item: Service, i: number) =>
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    })
    setHasChanges(true)
  }

  const updateServiceFeature = (serviceIndex: number, featureIndex: number, value: string): void => {
    setContent((prev: ServicesPageContent) => {
      if (!prev.services?.items || !Array.isArray(prev.services.items)) {
        return prev
      }
      return {
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.map((service: Service, i: number) =>
            i === serviceIndex ? {
              ...service,
              features: service.features.map((feature: ServiceFeature, j: number) =>
                j === featureIndex ? { ...feature, text: value } : feature
              )
            } : service
          )
        }
      }
    })
    setHasChanges(true)
  }

  const addServiceFeature = (serviceIndex: number): void => {
    setContent((prev: ServicesPageContent) => {
      if (!prev.services?.items || !Array.isArray(prev.services.items)) {
        return prev
      }
      return {
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.map((service: Service, i: number) =>
            i === serviceIndex ? {
              ...service,
              features: [...service.features, { text: "New feature" }]
            } : service
          )
        }
      }
    })
    setHasChanges(true)
  }

  const removeServiceFeature = (serviceIndex: number, featureIndex: number): void => {
    setContent((prev: ServicesPageContent) => {
      if (!prev.services?.items || !Array.isArray(prev.services.items)) {
        return prev
      }
      return {
        ...prev,
        services: {
          ...prev.services,
          items: prev.services.items.map((service: Service, i: number) =>
            i === serviceIndex ? {
              ...service,
              features: service.features.filter((_: ServiceFeature, j: number) => j !== featureIndex)
            } : service
          )
        }
      }
    })
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
          <h2 className="text-3xl font-bold text-gray-900">Edit Services Page</h2>
          <p className="text-gray-600 mt-2">
            Manage your services offerings, pricing, and comparison content.
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
            Main services page introduction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="hero-title">Title</Label>
            <Input
              id="hero-title"
              value={content.hero.title}
              onChange={(e) => updateField('hero', 'title', e.target.value)}
              placeholder="Services page title"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-description">Description</Label>
            <Textarea
              id="hero-description"
              value={content.hero.description}
              onChange={(e) => updateField('hero', 'description', e.target.value)}
              placeholder="Services page description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Section */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>
            Your coaching service offerings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(content.services?.items || []).map((service: Service, index: number) => (
            <Card key={index} className="p-6 border-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-lg">Service {index + 1}</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={service.popular || false}
                    onCheckedChange={(checked) => updateService(index, 'popular', checked as boolean)}
                  />
                  <Label>Mark as Popular</Label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Service Title</Label>
                  <Input
                    value={service.title}
                    onChange={(e) => updateService(index, 'title', e.target.value)}
                    placeholder="Service name"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={service.subtitle}
                    onChange={(e) => updateService(index, 'subtitle', e.target.value)}
                    placeholder="Service subtitle"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => updateService(index, 'description', e.target.value)}
                  placeholder="Service description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Price</Label>
                  <Input
                    value={service.price}
                    onChange={(e) => updateService(index, 'price', e.target.value)}
                    placeholder="$197"
                  />
                </div>
                <div>
                  <Label>Icon/Emoji</Label>
                  <Input
                    value={service.icon}
                    onChange={(e) => updateService(index, 'icon', e.target.value)}
                    placeholder="🌿"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="mb-4">
                <ImageUpload
                  label="Service Image"
                  value={service.image}
                  onChange={(url: string) => updateService(index, 'image', url)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label>Features</Label>
                  <Button
                    size="sm"
                    onClick={() => addServiceFeature(index)}
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Feature
                  </Button>
                </div>
                
                {service.features.map((feature: ServiceFeature, featureIndex: number) => (
                  <div key={featureIndex} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={feature.text}
                      onChange={(e) => updateServiceFeature(index, featureIndex, e.target.value)}
                      placeholder="Feature description"
                      className="flex-1"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeServiceFeature(index, featureIndex)}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Comparison Section */}
      <Card>
        <CardHeader>
          <CardTitle>Service Comparison</CardTitle>
          <CardDescription>
            Help visitors choose between single sessions and packages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="comparison-title">Section Title</Label>
            <Input
              id="comparison-title"
              value={content.comparison.title}
              onChange={(e) => updateField('comparison', 'title', e.target.value)}
              placeholder="Comparison section title"
            />
          </div>
          
          <div>
            <Label htmlFor="comparison-description">Section Description</Label>
            <Textarea
              id="comparison-description"
              value={content.comparison.description}
              onChange={(e) => updateField('comparison', 'description', e.target.value)}
              placeholder="Comparison section description"
              rows={2}
            />
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Single Sessions</h4>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.comparison.singleSessions.title}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    comparison: {
                      ...prev.comparison,
                      singleSessions: {
                        ...prev.comparison.singleSessions,
                        title: e.target.value
                      }
                    }
                  }))}
                  placeholder="Single Sessions title"
                />
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3">Package Programs</h4>
              <div>
                <Label>Title</Label>
                <Input
                  value={content.comparison.packagePrograms.title}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    comparison: {
                      ...prev.comparison,
                      packagePrograms: {
                        ...prev.comparison.packagePrograms,
                        title: e.target.value
                      }
                    }
                  }))}
                  placeholder="Package Programs title"
                />
              </div>
            </Card>
          </div>
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
