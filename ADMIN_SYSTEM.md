# Admin Panel Management System

## Overview

This is a complete backend management interface (Admin Panel) that allows **only the website owner (admin)** to securely change all texts and images across the entire site. Changes appear immediately on the published website without needing to rebuild or redeploy.

## 🔧 Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (Database, Authentication, File Storage, Realtime)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Image Upload**: react-dropzone + Supabase Storage
- **Real-time Updates**: Supabase Realtime

## 🎯 Features

### ✅ Admin Panel (Backoffice)
- **Secure Login**: Email + password authentication via Supabase Auth
- **Protected Routes**: Only authenticated admin can access the panel
- **Pages Management**:
  - Home Page (Full featured editor with Hero, Pillars, Quote, Testimonials, CTA)
  - About, Services, Contact, Transform Pages (Generic content editors)
- **Content Features**:
  - Dynamic input fields for editing text content
  - Image upload with preview (Supabase Storage)
  - Live save functionality
  - Auto-save capabilities (optional)
  - Form validation and user feedback
  - Real-time content updates

### ✅ Live Site Integration
- **Dynamic Content**: Public website fetches all content from Supabase Database
- **Real-time Updates**: Content changes appear instantly using Supabase Realtime
- **Fallback Content**: Default content displays if Supabase is unreachable
- **Optimized Images**: Images served from Supabase Storage CDN
- **Performance**: React Query caching and optimistic updates

### ✅ Security
- **Authentication**: JWT-based authentication via Supabase Auth
- **Row-Level Security (RLS)**: Database policies restrict admin-only access
- **Public Read Access**: Visitors can view content, only admin can modify
- **Secure File Upload**: Images stored in Supabase Storage with proper permissions

## 🗂 Database Structure

### Tables

#### `pages` Table
```sql
CREATE TABLE pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

#### Storage Buckets
- **`images`** bucket: Stores all uploaded images with public read access

### Row-Level Security Policies
- **Public read access**: Anyone can view page content
- **Admin-only write access**: Only authenticated admin can create/update content
- **Image upload**: Only admin can upload/manage images

## 🚀 Getting Started

### 1. Supabase Setup

1. **Create Supabase Project**
   - Go to [https://supabase.com](https://supabase.com)
   - Create a new project
   - Note your Project URL and anon key

2. **Database Setup**
   - Run the SQL commands from `supabase-setup.md`
   - Create the `pages` table
   - Set up Row-Level Security policies
   - Create the `images` storage bucket

3. **Authentication Setup**
   - Go to Authentication > Users in Supabase dashboard
   - Create your admin user account
   - Update RLS policies with your admin email

### 2. Environment Configuration

Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

## 📱 Usage

### Admin Panel Access

1. **Login**: Navigate to `/admin` and login with admin credentials
2. **Dashboard**: Overview of all manageable pages
3. **Page Editors**: Click on any page to edit its content

### Content Management

#### Home Page Editor
- **Hero Section**: Title, subtitle, description, background image, CTA button
- **Three Pillars**: Each pillar has title, description, and image
- **Quote Section**: Inspirational quote with background image
- **Testimonials**: Client testimonials with name, role, and text
- **Call-to-Action**: Final CTA section with title, description, button

#### Generic Page Editors (About, Services, Contact, Transform)
- **Page Header**: Title, subtitle, description
- **Dynamic Sections**: Add/remove content sections with title, content, and optional images

### Image Management
- **Upload Methods**: Drag & drop or click to select files
- **URL Input**: Alternative option to enter image URLs
- **Supported Formats**: JPEG, PNG, GIF, WebP
- **Storage**: Images stored in Supabase Storage with CDN delivery
- **Preview**: Live preview of uploaded images

## 🔒 Security Best Practices

### Database Security
- **RLS Enabled**: Row-Level Security prevents unauthorized access
- **Admin-Only Policies**: Only authenticated admin can modify content
- **Public Read Access**: Visitors can view content but not modify

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Automatic session handling and refresh
- **Protected Routes**: Admin panel requires authentication

### File Upload Security
- **Bucket Policies**: Secure file upload and access policies
- **File Type Validation**: Only image files allowed
- **CDN Delivery**: Images served through Supabase CDN

## 🎨 Customization

### Adding New Pages
1. Add route to admin panel (`AdminLayout.tsx`)
2. Create page editor component (use `GenericPageEditor` as template)
3. Add route to main app (`App.tsx`)
4. Insert default content into `pages` table

### Custom Content Types
1. Extend content interfaces in `src/lib/supabase.ts`
2. Update editor components with new fields
3. Modify page components to display new content

### Styling Customization
- Tailwind CSS classes can be modified
- shadcn/ui components can be customized
- CSS variables for theming in `index.css`

## 🛠 Development

### File Structure
```
src/
├── components/
│   ├── admin/
│   │   ├── AdminLayout.tsx      # Admin panel layout
│   │   ├── Dashboard.tsx        # Admin dashboard
│   │   ├── HomeEditor.tsx       # Home page content editor
│   │   ├── GenericPageEditor.tsx # Generic page editor
│   │   ├── ImageUpload.tsx      # Image upload component
│   │   ├── Login.tsx            # Admin login form
│   │   └── ProtectedRoute.tsx   # Route protection
│   └── ui/                      # shadcn/ui components
├── hooks/
│   └── useContent.ts            # Content management hooks
├── lib/
│   ├── auth.tsx                 # Authentication context
│   ├── supabase.ts              # Supabase client config
│   └── utils.ts                 # Utilities
└── pages/                       # Public pages
```

### Key Hooks
- **`usePageContent(slug)`**: Fetch page content by slug
- **`useUpdatePageContent()`**: Update page content
- **`useRealtimeContent(slug)`**: Enable real-time updates
- **`useAuth()`**: Authentication state management

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy with build command: `npm run build`

### Supabase Configuration
1. Ensure database is properly configured
2. Set up custom domain (optional)
3. Configure CORS if needed

## 🔧 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Check Supabase project URL and keys
   - Verify admin user exists in Supabase Auth
   - Check RLS policies

2. **Content Not Loading**
   - Verify `pages` table exists
   - Check if content exists for the slug
   - Ensure RLS policies allow public read access

3. **Image Upload Fails**
   - Check `images` bucket exists and is public
   - Verify storage policies allow admin upload
   - Check file size and type restrictions

4. **Real-time Updates Not Working**
   - Ensure Supabase Realtime is enabled
   - Check if `useRealtimeContent` hook is being used
   - Verify network connectivity

### Debug Mode
Enable debug logging by adding to your environment:
```env
VITE_DEBUG=true
```

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Supabase documentation
3. Check React Query documentation for data fetching issues
4. Verify all environment variables are correctly set

## 🔄 Updates and Maintenance

### Regular Maintenance
1. **Backup Database**: Regular Supabase database backups
2. **Update Dependencies**: Keep packages up to date
3. **Monitor Storage**: Check image storage usage
4. **Security Updates**: Keep Supabase and dependencies updated

### Adding Features
1. Extend content schemas as needed
2. Add new editor components
3. Update RLS policies for new content types
4. Test thoroughly before deploying

---

**Note**: This admin system provides a complete content management solution for your website. All changes are immediately reflected on the live site without requiring rebuilds or redeployments.
