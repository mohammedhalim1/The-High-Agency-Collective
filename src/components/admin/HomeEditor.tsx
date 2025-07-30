import React, { useState, useEffect } from 'react'
import { usePageContent, useUpdatePageContent, useRealtimeContent } from '@/hooks/useContent'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, Loader2, Clock } from 'lucide-react'
import ImageUpload from './ImageUpload'
import {
  HomePageContent,
  Pillar,
  Testimonial,
  ContentSection,
  ContentFieldValue,
  PillarField,
  TestimonialField,
  createDefaultHomePageContent
} from '@/types/homeContent'

const defaultContent: HomePageContent = createDefaultHomePageContent()

export default function HomeEditor(): JSX.Element {
  const { data: pageData, isLoading } = usePageContent('home')
  const updateMutation = useUpdatePageContent()
  const [content, setContent] = useState<HomePageContent>(defaultContent)
  const [hasChanges, setHasChanges] = useState<boolean>(false)

  // Enable real-time updates
  useRealtimeContent('home')

  useEffect(() => {
    if (pageData?.content) {
      // Merge pageData with defaultContent to ensure all required properties exist
      const mergedContent: HomePageContent = {
        ...defaultContent,
        ...pageData.content,
        pillars: {
          ...defaultContent.pillars,
          ...(pageData.content.pillars || {}),
          items: pageData.content.pillars?.items || defaultContent.pillars.items
        },
        testimonials: {
          ...defaultContent.testimonials,
          ...(pageData.content.testimonials || {}),
          items: pageData.content.testimonials?.items || defaultContent.testimonials.items
        }
      }
      setContent(mergedContent)
    }
  }, [pageData])

  const handleSave = async (): Promise<void> => {
    try {
      await updateMutation.mutateAsync({ slug: 'home', content })
      setHasChanges(false)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  const updateContentField = (section: ContentSection, field: string, value: ContentFieldValue): void => {
    setContent((prev: HomePageContent) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const updatePillar = (index: number, field: PillarField, value: string): void => {
    setContent((prev: HomePageContent) => {
      if (!prev.pillars?.items || !Array.isArray(prev.pillars.items)) {
        return prev
      }
      return {
        ...prev,
        pillars: {
          ...prev.pillars,
          items: prev.pillars.items.map((item: Pillar, i: number) =>
            i === index ? { ...item, [field]: value } : item
          )
        }
      }
    })
    setHasChanges(true)
  }

  const updateTestimonial = (index: number, field: TestimonialField, value: string): void => {
    setContent((prev: HomePageContent) => {
      // Ensure we always have exactly 3 testimonials
      const currentItems = prev.testimonials?.items || []
      const extendedItems: Testimonial[] = Array.from({ length: 3 }, (_, i) =>
        currentItems[i] || {
          name: '',
          role: '',
          testimonialText: '',
          image: ''
        }
      )

      return {
        ...prev,
        testimonials: {
          ...prev.testimonials,
          items: extendedItems.map((item: Testimonial, i: number) =>
            i === index ? { ...item, [field]: value } : item
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

  // Ensure content is properly initialized
  if (!content || !content.pillars || !content.testimonials) {
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
          <h2 className="text-3xl font-bold text-gray-900">Edit Home Page</h2>
          <p className="text-gray-600 mt-2">
            Manage your home page content including hero section, pillars, testimonials, and more.
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
            The main banner that visitors see first
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={content.hero.title}
                onChange={(e) => updateContentField('hero', 'title', e.target.value)}
                placeholder="Main title"
              />
            </div>
            <div>
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={content.hero.subtitle}
                onChange={(e) => updateContentField('hero', 'subtitle', e.target.value)}
                placeholder="Subtitle"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="hero-description">Description</Label>
            <Textarea
              id="hero-description"
              value={content.hero.description}
              onChange={(e) => updateContentField('hero', 'description', e.target.value)}
              placeholder="Hero description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="hero-cta-text">Button Text</Label>
              <Input
                id="hero-cta-text"
                value={content.hero.ctaText}
                onChange={(e) => updateContentField('hero', 'ctaText', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="hero-cta-link">Button Link</Label>
              <Input
                id="hero-cta-link"
                value={content.hero.ctaLink}
                onChange={(e) => updateContentField('hero', 'ctaLink', e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>

          <ImageUpload
            label="Background Image"
            description="Hero section background image"
            value={content.hero.backgroundImage}
            onChange={(url: string) => updateContentField('hero', 'backgroundImage', url)}
          />
        </CardContent>
      </Card>

      {/* Three Pillars Section */}
      <Card>
        <CardHeader>
          <CardTitle>Three Pillars Section</CardTitle>
          <CardDescription>
            The core pillars of your methodology
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="pillars-title">Section Title</Label>
            <Input
              id="pillars-title"
              value={content.pillars.title}
              onChange={(e) => updateContentField('pillars', 'title', e.target.value)}
              placeholder="Section title"
            />
          </div>
          
          <div>
            <Label htmlFor="pillars-description">Section Description</Label>
            <Textarea
              id="pillars-description"
              value={content.pillars.description}
              onChange={(e) => updateContentField('pillars', 'description', e.target.value)}
              placeholder="Section description"
              rows={2}
            />
          </div>

          <Separator />

          {(content.pillars?.items || []).map((pillar: Pillar, index: number) => (
            <Card key={index} className="p-4">
              <h4 className="font-medium mb-3">Pillar {index + 1}</h4>
              <div className="space-y-3">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={pillar.title}
                    onChange={(e) => updatePillar(index, 'title', e.target.value)}
                    placeholder="Pillar title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={pillar.description}
                    onChange={(e) => updatePillar(index, 'description', e.target.value)}
                    placeholder="Pillar description"
                    rows={2}
                  />
                </div>
                <ImageUpload
                  label="Pillar Image"
                  value={pillar.image}
                  onChange={(url: string) => updatePillar(index, 'image', url)}
                />
              </div>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Quote Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quote Section</CardTitle>
          <CardDescription>
            Inspirational quote with background image
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="quote-text">Quote Text</Label>
            <Textarea
              id="quote-text"
              value={content.quote.text}
              onChange={(e) => updateContentField('quote', 'text', e.target.value)}
              placeholder="Inspirational quote"
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="quote-author">Author/Attribution</Label>
            <Input
              id="quote-author"
              value={content.quote.author}
              onChange={(e) => updateContentField('quote', 'author', e.target.value)}
              placeholder="Quote attribution"
            />
          </div>

          <ImageUpload
            label="Background Image"
            description="Quote section background image"
            value={content.quote.backgroundImage}
            onChange={(url: string) => updateContentField('quote', 'backgroundImage', url)}
          />
        </CardContent>
      </Card>

      {/* Testimonials Section */}
      <Card>
        <CardHeader>
          <CardTitle>Testimonials Section</CardTitle>
          <CardDescription>
            Client testimonials and success stories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testimonials-title">Title</Label>
            <Input
              id="testimonials-title"
              value={content.testimonials.title ?? ''}
              onChange={(e) => updateContentField('testimonials', 'title', e.target.value)}
              placeholder="Section title"
            />
          </div>
          
          <div>
            <Label htmlFor="testimonials-subtitle">Subtitle</Label>
            <Input
              id="testimonials-subtitle"
              value={content.testimonials.subtitle ?? ''}
              onChange={(e) => updateContentField('testimonials', 'subtitle', e.target.value)}
              placeholder="Section subtitle"
            />
          </div>

          <Separator />

          {/* Exactly 3 testimonials */}
          {Array.from({ length: 3 }, (_, index) => {
            const testimonial = content.testimonials?.items?.[index] || {
              name: '',
              role: '',
              testimonialText: '',
              image: ''
            };

            return (
              <Card key={index} className="p-4 border-2 border-gray-200">
                <h4 className="font-medium mb-3 text-gray-800">Testimonial {index + 1}</h4>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor={`testimonial-${index}-name`}>Name</Label>
                    <Input
                      id={`testimonial-${index}-name`}
                      value={testimonial.name ?? ''}
                      onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                      placeholder="Client name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`testimonial-${index}-role`}>Role/Title</Label>
                    <Input
                      id={`testimonial-${index}-role`}
                      value={testimonial.role ?? ''}
                      onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
                      placeholder="Client role or title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`testimonial-${index}-testimonialText`}>Testimonial Text</Label>
                    <Textarea
                      id={`testimonial-${index}-testimonialText`}
                      value={testimonial.testimonialText ?? ''}
                      onChange={(e) => updateTestimonial(index, 'testimonialText', e.target.value)}
                      placeholder="Testimonial content"
                      rows={3}
                    />
                  </div>
                  <div>
                    <ImageUpload
                      label="Image"
                      description="Testimonial image"
                      value={testimonial.image ?? ''}
                      onChange={(url: string) => updateTestimonial(index, 'image', url)}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      {/* Call to Action Section */}
      <Card>
        <CardHeader>
          <CardTitle>Call to Action Section</CardTitle>
          <CardDescription>
            Final call to action to encourage engagement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cta-title">Title</Label>
            <Input
              id="cta-title"
              value={content.cta.title}
              onChange={(e) => updateContentField('cta', 'title', e.target.value)}
              placeholder="CTA title"
            />
          </div>
          
          <div>
            <Label htmlFor="cta-description">Description</Label>
            <Textarea
              id="cta-description"
              value={content.cta.description}
              onChange={(e) => updateContentField('cta', 'description', e.target.value)}
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
                onChange={(e) => updateContentField('cta', 'buttonText', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="cta-button-link">Button Link</Label>
              <Input
                id="cta-button-link"
                value={content.cta.buttonLink}
                onChange={(e) => updateContentField('cta', 'buttonLink', e.target.value)}
                placeholder="/contact"
              />
            </div>
          </div>

          <ImageUpload
            label="Background Image"
            description="CTA section background image"
            value={content.cta.backgroundImage}
            onChange={(url: string) => updateContentField('cta', 'backgroundImage', url)}
          />
        </CardContent>
      </Card>
    </div>
  )
}