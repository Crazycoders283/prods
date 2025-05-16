-- Create or recreate the packagescallback table with the correct structure
CREATE TABLE IF NOT EXISTS packagescallback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    travel_date DATE,
    guests TEXT,
    budget TEXT,
    request TEXT,
    package_name TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create package callback requests" ON packagescallback;
DROP POLICY IF EXISTS "Admins can see all package callback requests" ON packagescallback;
DROP POLICY IF EXISTS "Admins can update package callback requests" ON packagescallback;

-- Enable Row Level Security
ALTER TABLE packagescallback ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for development
CREATE POLICY "Allow all operations for anon" 
  ON packagescallback 
  FOR ALL 
  TO anon
  USING (true) 
  WITH CHECK (true);

-- Make sure the updated_at trigger exists and is applied
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists to avoid errors
DROP TRIGGER IF EXISTS update_packagescallback_updated_at ON packagescallback;

-- Create the trigger
CREATE TRIGGER update_packagescallback_updated_at
    BEFORE UPDATE ON packagescallback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
