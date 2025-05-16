-- Create a stored procedure to insert users without relying on schema cache
CREATE OR REPLACE FUNCTION insert_user(
  user_email TEXT,
  user_first_name TEXT,
  user_last_name TEXT,
  user_password TEXT,
  user_role TEXT DEFAULT 'user'
) RETURNS JSONB AS $$
DECLARE
  new_user_id UUID;
  result JSONB;
BEGIN
  -- Insert the user
  INSERT INTO users (
    email,
    first_name,
    last_name,
    password,
    role
  ) VALUES (
    user_email,
    user_first_name,
    user_last_name,
    user_password,
    user_role
  )
  RETURNING id INTO new_user_id;
  
  -- Get the inserted data
  SELECT jsonb_build_object(
    'id', id,
    'email', email,
    'first_name', first_name,
    'last_name', last_name,
    'role', role
  ) INTO result
  FROM users
  WHERE id = new_user_id;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
