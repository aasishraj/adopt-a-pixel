-- Create the pixels table
CREATE TABLE IF NOT EXISTS pixels (
  id INTEGER PRIMARY KEY,
  adopted BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT '#E5E7EB',
  adopter TEXT DEFAULT '',
  emoji TEXT DEFAULT '',
  adopted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on adopted status for faster queries
CREATE INDEX IF NOT EXISTS idx_pixels_adopted ON pixels(adopted);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_pixels_updated_at BEFORE UPDATE ON pixels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial 400 pixels (20x20 grid) if they don't exist
INSERT INTO pixels (id, adopted, color, adopter, emoji)
SELECT 
    generate_series(0, 399) as id,
    FALSE as adopted,
    '#E5E7EB' as color,
    '' as adopter,
    '' as emoji
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE pixels ENABLE ROW LEVEL SECURITY;

-- Create policies to allow read access to everyone
CREATE POLICY "Allow read access to pixels" ON pixels
    FOR SELECT USING (true);

-- Create policies to allow insert/update access to everyone (you might want to restrict this in production)
CREATE POLICY "Allow insert access to pixels" ON pixels
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update access to pixels" ON pixels
    FOR UPDATE USING (true);