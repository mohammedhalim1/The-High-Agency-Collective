# Supabase Setup Instructions

## 1. Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Copy your Project URL and anon key to `.env.local`

## 2. Database Schema Setup

Run these SQL commands in your Supabase SQL Editor:

### Create Pages Table
```sql
-- Create the pages table for content management
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on the slug for faster lookups
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Row Level Security (RLS) Setup
```sql
-- Enable RLS on the pages table
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for the website)
CREATE POLICY "Allow public read access" ON pages
    FOR SELECT USING (true);

-- Allow authenticated users to insert/update (admin only)
-- You should replace 'your-admin-email@example.com' with your actual admin email
CREATE POLICY "Allow admin full access" ON pages
    FOR ALL USING (auth.email() = 'your-admin-email@example.com');
```

## 3. Storage Setup

### Create Images Bucket
```sql
-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Allow public read access to images
CREATE POLICY "Allow public read access on images" ON storage.objects
    FOR SELECT USING (bucket_id = 'images');

-- Allow authenticated users to upload images (admin only)
CREATE POLICY "Allow admin upload images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'images' AND 
        auth.email() = 'your-admin-email@example.com'
    );

-- Allow authenticated users to update images (admin only)
CREATE POLICY "Allow admin update images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'images' AND 
        auth.email() = 'your-admin-email@example.com'
    );

-- Allow authenticated users to delete images (admin only)
CREATE POLICY "Allow admin delete images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'images' AND 
        auth.email() = 'your-admin-email@example.com'
    );
```

## 4. Authentication Setup

### Create Admin User
1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Enter your email and a secure password
4. Confirm the user (if email confirmation is enabled)

## 5. Initial Data Setup

### Insert Default Pages
```sql
-- Insert default page content
INSERT INTO pages (slug, content) VALUES 
('home', '{
  "hero": {
    "title": "Awaken Her Power",
    "subtitle": "Within",
    "description": "Embrace your feminine strength, align with your deepest truth, and create a life that flows with purpose and joy.",
    "backgroundImage": "/assets/hero_woman_spa.jpg",
    "ctaText": "Start Your Journey",
    "ctaLink": "/contact"
  },
  "pillars": {
    "title": "The Three Pillars",
    "description": "A holistic approach to awakening your feminine power through emotional wellness, career alignment, and authentic self-expression.",
    "items": [
      {
        "title": "Emotional Wellness",
        "description": "Heal deep wounds, release limiting beliefs, and cultivate emotional intelligence that serves your highest self.",
        "image": "/assets/pillar_emotion.jpg"
      },
      {
        "title": "Career Alignment", 
        "description": "Discover your soul''s calling and create a career path that honors both your ambitions and your values.",
        "image": "/assets/pillar_career.jpg"
      },
      {
        "title": "Feminine Power Activation",
        "description": "Embrace your intuition, creativity, and natural cycles to live in harmony with your feminine essence.",
        "image": "/assets/pillar_feminine.jpg"
      }
    ]
  },
  "quote": {
    "text": "The most powerful thing you can do is to begin to honor the woman you''re becoming while loving the woman you''ve been.",
    "author": "Your journey starts with self-compassion",
    "backgroundImage": "/assets/bubblebath_reflection.jpg"
  },
  "testimonials": {
    "title": "Transformation Stories",
    "description": "Real women, real breakthroughs, real power awakened.",
    "items": [
      {
        "name": "Sarah Martinez",
        "text": "Working with this coach transformed how I see myself. I finally feel aligned with my true purpose and confident in my feminine power.",
        "role": "Marketing Director"
      },
      {
        "name": "Amara Johnson", 
        "text": "The deep inner work we did together helped me break through patterns that were holding me back. I''m living authentically now.",
        "role": "Entrepreneur"
      },
      {
        "name": "Elena Rodriguez",
        "text": "I discovered strength I didn''t know I had. This journey awakened something beautiful within me that I''m still exploring.",
        "role": "Creative Director"
      }
    ]
  },
  "cta": {
    "title": "Take the First Step",
    "description": "Your transformation begins with a single conversation. Let''s talk about where you are and where you want to be.",
    "buttonText": "Book Your Clarity Session",
    "buttonLink": "/contact",
    "backgroundImage": "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1920&q=80"
  }
}'),
('about', '{}'),
('services', '{}'),
('contact', '{}'),
('transform', '{}');
```

## 6. Environment Variables

Update your `.env.local` file with your actual Supabase credentials:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Important Security Notes

1. **Replace the admin email** in the RLS policies with your actual admin email
2. **Use a strong password** for your admin account  
3. **Enable email confirmation** in Supabase Auth settings for additional security
4. **Consider adding 2FA** for your admin account
5. **Regularly backup your database** especially before making schema changes
