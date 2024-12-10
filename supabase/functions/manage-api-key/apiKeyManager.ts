export const getApiKey = async (supabaseClient: any, userId: string) => {
  console.log("Fetching API key for user:", userId);
  try {
    const { data: existingKey, error: keyError } = await supabaseClient
      .from('api_keys')
      .select('key_value')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle();

    if (keyError) {
      console.error("Error fetching API key:", keyError);
      throw new Error('Error fetching API key');
    }

    if (existingKey) {
      console.log("Existing API key found");
      return existingKey.key_value;
    }

    console.log("No existing API key found, generating new one");
    const newApiKey = `sk_${crypto.randomUUID()}`;
    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: userId,
        key_value: newApiKey,
        is_active: true
      });

    if (insertError) {
      console.error("Error inserting new API key:", insertError);
      throw new Error('Error creating API key');
    }

    console.log("New API key generated and stored");
    return newApiKey;
  } catch (error) {
    console.error("Error in getApiKey:", error);
    throw error;
  }
};

export const regenerateApiKey = async (supabaseClient: any, userId: string) => {
  console.log("Starting API key regeneration for user:", userId);
  
  try {
    // Generate new API key
    const newApiKey = `sk_${crypto.randomUUID()}`;
    
    // First, insert the new key as inactive
    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: userId,
        key_value: newApiKey,
        is_active: false
      });

    if (insertError) {
      console.error("Error inserting new API key:", insertError);
      throw new Error('Failed to create new API key');
    }

    // Then deactivate all existing active keys
    const { error: updateError } = await supabaseClient
      .from('api_keys')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (updateError) {
      console.error("Error deactivating existing keys:", updateError);
      // Clean up the newly inserted key if we fail to deactivate old ones
      await supabaseClient
        .from('api_keys')
        .delete()
        .eq('key_value', newApiKey);
      throw new Error('Failed to deactivate existing keys');
    }

    // Finally, activate the new key
    const { error: activateError } = await supabaseClient
      .from('api_keys')
      .update({ is_active: true })
      .eq('key_value', newApiKey);

    if (activateError) {
      console.error("Error activating new key:", activateError);
      // Clean up on failure
      await supabaseClient
        .from('api_keys')
        .delete()
        .eq('key_value', newApiKey);
      throw new Error('Failed to activate new key');
    }

    console.log("Successfully regenerated API key");
    return newApiKey;
  } catch (error) {
    console.error("Error in regenerateApiKey:", error);
    throw error;
  }
};