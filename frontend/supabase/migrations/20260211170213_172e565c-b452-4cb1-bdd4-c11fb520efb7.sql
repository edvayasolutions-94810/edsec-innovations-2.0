
-- Create student enrollments table
CREATE TABLE public.student_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  course TEXT NOT NULL,
  qualification TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.student_enrollments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public enrollment form)
CREATE POLICY "Anyone can submit enrollment"
  ON public.student_enrollments
  FOR INSERT
  WITH CHECK (true);

-- No public SELECT - only accessible via service role / dashboard
CREATE POLICY "No public read access"
  ON public.student_enrollments
  FOR SELECT
  USING (false);
