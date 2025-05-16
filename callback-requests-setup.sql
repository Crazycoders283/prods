-- Drop existing table if it exists (BE CAREFUL - only use in development if you want to start fresh)
-- DROP TABLE IF EXISTS callback_requests;

-- Create or recreate the callback_requests table with the correct structure
CREATE TABLE IF NOT EXISTS callback_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    preferred_time TEXT, -- Changed to TEXT since we're storing it as a string
    message TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create callback requests" ON callback_requests;
DROP POLICY IF EXISTS "Admins can see all callback requests" ON callback_requests;
DROP POLICY IF EXISTS "Admins can update callback requests" ON callback_requests;

-- Enable Row Level Security
ALTER TABLE callback_requests ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for development
CREATE POLICY "Allow all operations for anon" 
  ON callback_requests 
  FOR ALL 
  TO anon
  USING (true) 
  WITH CHECK (true);

-- For production, you might want to use more restrictive policies like these:
-- CREATE POLICY "Anyone can create callback requests"
--   ON callback_requests FOR INSERT
--   TO anon
--   WITH CHECK (true);
-- 
-- CREATE POLICY "Admins can see all callback requests"
--   ON callback_requests FOR SELECT
--   TO authenticated
--   USING (auth.role() = 'admin');
--
-- CREATE POLICY "Admins can update callback requests"
--   ON callback_requests FOR UPDATE
--   TO authenticated
--   USING (auth.role() = 'admin');

-- Make sure the updated_at trigger exists and is applied
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists to avoid errors
DROP TRIGGER IF EXISTS update_callback_requests_updated_at ON callback_requests;

-- Create the trigger
CREATE TRIGGER update_callback_requests_updated_at
    BEFORE UPDATE ON callback_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
