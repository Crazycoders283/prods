-- Function to add a column if it doesn't exist
CREATE OR REPLACE FUNCTION add_column_if_not_exists(
    table_name text,
    column_name text,
    column_type text
)
RETURNS void AS $$
BEGIN
    -- Check if the column already exists
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = $1
        AND column_name = $2
    ) THEN
        -- Add the column
        EXECUTE format('ALTER TABLE %I ADD COLUMN %I %s', $1, $2, $3);
    END IF;
END;
$$ LANGUAGE plpgsql; 