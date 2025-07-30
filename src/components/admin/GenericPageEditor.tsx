import React, { useState, useEffect } from 'react'
import { usePageContent, useUpdatePageContent, useRealtimeContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, Loader2, Clock, Plus, Trash2 } from 'lucide-react'
import ImageUpload from './ImageUpload'

interface GenericPageEditorProps {
  slug: string
  title: string
  description: string
}

export default function GenericPageEditor({ slug, title, description }: GenericPageEditorProps) {
  const { data: pageData, isLoading } = usePageContent(slug)
  const updateMutation = useUpdatePageContent()
  const [content, setContent] = useState<any>({
    title: '',
    subtitle: '',
    description: '',
    sections: []
  })
  const [hasChanges, setHasChanges] = useState(false)

  // Enable real-time updates
  useRealtimeContent(slug)

  useEffect(() => {
    if (pageData?.content) {
      setContent(pageData.content)
    }
  }, [pageData])

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({ slug, content })
      setHasChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const updateField = (field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  const addSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      image: ''
    }
    setContent((prev: any) => ({
      ...prev,
      sections: [...(prev.sections || []), newSection]
    }))
    setHasChanges(true)
  }

  const updateSection = (index: number, field: string, value: any) => {
    setContent((prev: any) => ({
      ...prev,
      sections: prev.sections.map((section: any, i: number) =>
        i === index ? { ...section, [field]: value } : section
      )
    }))
    setHasChanges(true)
  }

  const removeSection = (index: number) => {
    setContent((prev: any) => ({
      ...prev,
      sections: prev.sections.filter((_: any, i: number) => i !== index)
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-2">{description}</p>
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

      {/* Page Header */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
          <CardDescription>Main page title and description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="page-title">Page Title</Label>
            <Input
              id="page-title"
              value={content.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter page title"
            />
          </div>
          
          <div>
            <Label htmlFor="page-subtitle">Subtitle (Optional)</Label>
            <Input
              id="page-subtitle"
              value={content.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div>
            <Label htmlFor="page-description">Description</Label>
            <Textarea
              id="page-description"
              value={content.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter page description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Page Sections */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Page Sections</CardTitle>
              <CardDescription>Add and manage content sections</CardDescription>
            </div>
            <Button onClick={addSection} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {content.sections && content.sections.length > 0 ? (
            content.sections.map((section: any, index: number) => (
              <Card key={section.id || index} className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Section {index + 1}</h4>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Section Title</Label>
                    <Input
                      value={section.title || ''}
                      onChange={(e) => updateSection(index, 'title', e.target.value)}
                      placeholder="Section title"
                    />
                  </div>
                  <div>
                    <Label>Section Content</Label>
                    <Textarea
                      value={section.content || ''}
                      onChange={(e) => updateSection(index, 'content', e.target.value)}
                      placeholder="Section content"
                      rows={4}
                    />
                  </div>
                  <ImageUpload
                    label="Section Image (Optional)"
                    value={section.image || ''}
                    onChange={(url) => updateSection(index, 'image', url)}
                  />
                </div>
              </Card>
            ))
          ) : (
            <Alert>
              <AlertDescription>
                No sections added yet. Click "Add Section" to create your first content section.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
