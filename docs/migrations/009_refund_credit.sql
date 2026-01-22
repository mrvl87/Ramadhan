-- Refund credit function to handle failed AI generations
-- This function should be added to your Supabase database

CREATE OR REPLACE FUNCTION refund_credit(
    target_user_id UUID,
    feature_name TEXT
)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    credit_cost INTEGER;
    user_exists BOOLEAN;
BEGIN
    -- Check if user exists
    SELECT EXISTS(SELECT 1 FROM credits WHERE user_id = target_user_id) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN QUERY SELECT FALSE, 'User not found'::TEXT;
        RETURN;
    END IF;
    
    -- Get credit cost based on feature
    CASE 
        WHEN feature_name = 'family-photo' THEN
            credit_cost := 5;
        WHEN feature_name IN ('ramadan-menu', 'gift-recommendation') THEN
            credit_cost := 1;
        ELSE
            credit_cost := 1; -- Default cost
    END CASE;
    
    -- Add credits back to user
    UPDATE credits 
    SET 
        credits = credits + credit_cost,
        updated_at = NOW()
    WHERE user_id = target_user_id;
    
    -- Log the refund
    INSERT INTO credit_transactions (
        user_id, 
        amount, 
        transaction_type, 
        description, 
        feature_name,
        created_at
    ) VALUES (
        target_user_id,
        credit_cost,
        'refund',
        'Refund for failed ' || feature_name || ' generation',
        feature_name,
        NOW()
    );
    
    RETURN QUERY SELECT TRUE, 'Credit refunded successfully'::TEXT;
END;
$$;