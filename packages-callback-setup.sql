-- Create or recreate the packages_callback table with the correct structure
CREATE TABLE IF NOT EXISTS packages_callback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_time TEXT,
    message TEXT,
    hotel_name TEXT,
    check_in DATE,
    check_out DATE,
    guests TEXT,
    room_type TEXT,
    total_price NUMERIC,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can create package callbacks" ON packages_callback;
DROP POLICY IF EXISTS "Admins can see all package callbacks" ON packages_callback;
DROP POLICY IF EXISTS "Admins can update package callbacks" ON packages_callback;

-- Enable Row Level Security
ALTER TABLE packages_callback ENABLE ROW LEVEL SECURITY;

-- Create a more permissive policy for development
CREATE POLICY "Allow all operations for anon" 
  ON packages_callback 
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
DROP TRIGGER IF EXISTS update_packages_callback_updated_at ON packages_callback;

-- Create the trigger
CREATE TRIGGER update_packages_callback_updated_at
    BEFORE UPDATE ON packages_callback
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
