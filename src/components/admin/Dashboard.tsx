import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Home,
  User,
  Briefcase,
  MessageSquare,
  Sparkles,
  Edit,
  Globe
} from 'lucide-react'
import SupabaseDebug from '@/components/SupabaseDebug'
import ErrorTest from '@/components/ErrorTest'
import SupabaseFetchVerification from '@/components/SupabaseFetchVerification'
import EnvVerification from '@/components/EnvVerification'
import SupabaseConnectionTest from '@/components/SupabaseConnectionTest'


const pages = [
  {
    title: 'Home Page',
    description: 'Manage hero section, pillars, testimonials, and call-to-action',
    icon: Home,
    path: '/admin/home',
    color: 'text-blue-600'
  },
  {
    title: 'About Page',
    description: 'Edit about page content and story',
    icon: User,
    path: '/admin/about',
    color: 'text-green-600'
  },
  {
    title: 'Services Page',
    description: 'Manage services offerings and descriptions',
    icon: Briefcase,
    path: '/admin/services',
    color: 'text-purple-600'
  },
  {
    title: 'Contact Page',
    description: 'Update contact information and form settings',
    icon: MessageSquare,
    path: '/admin/contact',
    color: 'text-orange-600'
  },
  {
    title: 'Transform Page',
    description: 'Edit transformation program content',
    icon: Sparkles,
    path: '/admin/transform',
    color: 'text-pink-600'
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-2">
            Manage your website content and settings
          </p>
        </div>
        <Button asChild>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4 mr-2" />
            View Live Site
          </a>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pages.map((page) => {
          const Icon = page.icon
          return (
            <Card key={page.path} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Icon className={`h-6 w-6 ${page.color}`} />
                  <CardTitle className="text-lg">{page.title}</CardTitle>
                </div>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={page.path}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Content
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 space-y-6">
        <EnvVerification />
        <SupabaseConnectionTest />
        <SupabaseFetchVerification />
        <ErrorTest />
        <SupabaseDebug />

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and useful links
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" asChild>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Supabase Dashboard
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/home">
                Edit Home Page
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
