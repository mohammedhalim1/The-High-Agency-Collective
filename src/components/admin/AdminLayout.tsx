import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Home, 
  User, 
  Briefcase, 
  MessageSquare, 
  Sparkles,
  LogOut 
} from 'lucide-react'

const adminRoutes = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/admin/home', label: 'Home Page', icon: Home },
  { path: '/admin/about', label: 'About Page', icon: User },
  { path: '/admin/services', label: 'Services Page', icon: Briefcase },
  { path: '/admin/contact', label: 'Contact Page', icon: MessageSquare },
  { path: '/admin/transform', label: 'Transform Page', icon: Sparkles },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Admin Panel - Awaken Her Power
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm h-[calc(100vh-64px)] border-r">
          <div className="p-4">
            <ul className="space-y-2">
              {adminRoutes.map((route) => {
                const Icon = route.icon
                const isActive = location.pathname === route.path
                
                return (
                  <li key={route.path}>
                    <Link
                      to={route.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {route.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
