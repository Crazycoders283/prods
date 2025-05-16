-- Create a stored procedure for callback request insertion
-- This helps bypass schema cache issues and provides more flexibility

CREATE OR REPLACE FUNCTION insert_callback_request(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_preferred_time TEXT,
  p_message TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
  v_result JSONB;
BEGIN
  -- Insert the callback request
  INSERT INTO callback_requests (
    name,
    email,
    phone,
    preferred_time,
    message,
    status,
    created_at,
    updated_at
  ) VALUES (
    p_name,
    p_email,
    p_phone,
    p_preferred_time,
    p_message,
    'pending',
    NOW(),
    NOW()
  ) RETURNING id INTO v_id;

  -- Return the created record as JSON
  SELECT jsonb_build_object(
    'id', id,
    'name', name,
    'email', email,
    'phone', phone,
    'preferred_time', preferred_time,
    'message', message,
    'status', status,
    'created_at', created_at
  ) INTO v_result
  FROM callback_requests
  WHERE id = v_id;

  RETURN v_result;
END;
$$;
