import React, { useState, useEffect } from 'react'
import { usePageContent, useUpdatePageContent, useRealtimeContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Save, Loader2, Clock, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import ImageUpload from './ImageUpload'
import { TransformPageContent, TransformationStage } from '@/types/pageContent'
import { createDefaultTransformContent } from '@/lib/defaultContent'

const defaultContent: TransformPageContent = createDefaultTransformContent()

export default function TransformEditor(): JSX.Element {
  const { data: pageData, isLoading } = usePageContent('transform')
  const updateMutation = useUpdatePageContent()
  const [content, setContent] = useState<TransformPageContent>(defaultContent)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Enable real-time updates
  useRealtimeContent('transform')

  useEffect(() => {
    if (pageData?.content) {
      const mergedContent: TransformPageContent = {
        ...defaultContent,
        ...pageData.content,
        stages: {
          ...defaultContent.stages,
          ...(pageData.content.stages || {}),
          items: pageData.content.stages?.items || defaultContent.stages.items
        }
      }
      setContent(mergedContent)
    }
  }, [pageData])

  const handleSave = async (): Promise<void> => {
    try {
      await updateMutation.mutateAsync({ slug: 'transform', content })
      setHasChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const updateField = (section: keyof TransformPageContent, field: string, value: string): void => {
    setContent((prev: TransformPageContent) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updateStage = (index: number, field: keyof TransformationStage, value: string | number): void => {
    setContent((prev: TransformPageContent) => {
      if (!prev.stages?.items || !Array.isArray(prev.stages.items)) {
        return prev
      }
      return {
        ...prev,
        stages: {
          ...prev.stages,
          items: prev.stages.items.map((item: TransformationStage, i: number) =>
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    })
    setHasChanges(true)
  }

  const addStage = (): void => {
    const newStage: TransformationStage = {
      title: "New Stage",
      description: "Stage description",
      image: "/assets/placeholder.jpg",
      emotion: "Emotion",
      order: (content.stages?.items || []).length + 1
    }
    setContent((prev: TransformPageContent) => ({
      ...prev,
      stages: {
        ...prev.stages,
        items: [...(prev.stages?.items || []), newStage]
      }
    }))
    setHasChanges(true)
  }

  const removeStage = (index: number): void => {
    setContent((prev: TransformPageContent) => ({
      ...prev,
      stages: {
        ...prev.stages,
        items: prev.stages.items.filter((_: TransformationStage, i: number) => i !== index)
          .map((stage: TransformationStage, i: number) => ({ ...stage, order: i + 1 }))
      }
    }))
    setHasChanges(true)
  }

  const moveStage = (index: number, direction: 'up' | 'down'): void => {
    setContent((prev: TransformPageContent) => {
      const items = [...(prev.stages?.items || [])]
      const newIndex = direction === 'up' ? index - 1 : index + 1
      
      if (newIndex < 0 || newIndex >= items.length) return prev
      
      // Swap items
      [items[index], items[newIndex]] = [items[newIndex], items[index]]
      
      // Update order numbers
      items.forEach((stage, i) => {
        stage.order = i + 1
      })
      
      return {
        ...prev,
        stages: {
          ...prev.stages,
          items
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
          <h2 className="text-3xl font-bold text-gray-900">Edit Transform Page</h2>
          <p className="text-gray-600 mt-2">
            Manage the transformation journey stages and call-to-action content.
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
            Main transformation page introduction
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
            <Label htmlFor="hero-subtitle">Subtitle</Label>
            <Input
              id="hero-subtitle"
              value={content.hero.subtitle}
              onChange={(e) => updateField('hero', 'subtitle', e.target.value)}
              placeholder="Subtitle"
            />
          </div>
          
          <div>
            <Label htmlFor="hero-description">Description</Label>
            <Textarea
              id="hero-description"
              value={content.hero.description}
              onChange={(e) => updateField('hero', 'description', e.target.value)}
              placeholder="Hero description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="hero-instruction">Scroll Instruction</Label>
            <Input
              id="hero-instruction"
              value={content.hero.instruction}
              onChange={(e) => updateField('hero', 'instruction', e.target.value)}
              placeholder="Scroll to experience the transformation ↓"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transformation Stages */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Transformation Stages</CardTitle>
              <CardDescription>
                The journey stages with images and descriptions
              </CardDescription>
            </div>
            <Button onClick={addStage} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Stage
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {(content.stages?.items || []).map((stage: TransformationStage, index: number) => (
            <Card key={index} className="p-6 border-2">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-lg">Stage {stage.order}</h4>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveStage(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => moveStage(index, 'down')}
                    disabled={index === (content.stages?.items || []).length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeStage(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label>Stage Title</Label>
                  <Input
                    value={stage.title}
                    onChange={(e) => updateStage(index, 'title', e.target.value)}
                    placeholder="Stage name"
                  />
                </div>
                <div>
                  <Label>Emotion</Label>
                  <Input
                    value={stage.emotion}
                    onChange={(e) => updateStage(index, 'emotion', e.target.value)}
                    placeholder="Associated emotion"
                  />
                </div>
              </div>

              <div className="mb-4">
                <Label>Description</Label>
                <Textarea
                  value={stage.description}
                  onChange={(e) => updateStage(index, 'description', e.target.value)}
                  placeholder="Stage description"
                  rows={3}
                />
              </div>

              <ImageUpload
                label="Stage Image"
                description="Background image for this transformation stage"
                value={stage.image}
                onChange={(url: string) => updateStage(index, 'image', url)}
              />
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action Section</CardTitle>
          <CardDescription>
            Final call to action with multiple buttons
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

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-medium mb-3">Primary Button</h4>
              <div className="space-y-3">
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={content.cta.primaryButtonText}
                    onChange={(e) => updateField('cta', 'primaryButtonText', e.target.value)}
                    placeholder="Primary button text"
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={content.cta.primaryButtonLink}
                    onChange={(e) => updateField('cta', 'primaryButtonLink', e.target.value)}
                    placeholder="/services"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-3">Secondary Button</h4>
              <div className="space-y-3">
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={content.cta.secondaryButtonText}
                    onChange={(e) => updateField('cta', 'secondaryButtonText', e.target.value)}
                    placeholder="Secondary button text"
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={content.cta.secondaryButtonLink}
                    onChange={(e) => updateField('cta', 'secondaryButtonLink', e.target.value)}
                    placeholder="/contact"
                  />
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
