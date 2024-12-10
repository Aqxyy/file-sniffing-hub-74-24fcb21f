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
    // First, deactivate all existing keys
    console.log("Deactivating existing keys");
    const { error: deactivateError } = await supabaseClient
      .from('api_keys')
      .update({ is_active: false })
      .eq('user_id', userId);

    if (deactivateError) {
      console.error("Error deactivating existing keys:", deactivateError);
      throw new Error('Failed to deactivate existing keys');
    }

    // Generate and insert new key
    const newApiKey = `sk_${crypto.randomUUID()}`;
    console.log("Generated new API key, attempting to insert");

    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: userId,
        key_value: newApiKey,
        is_active: true
      });

    if (insertError) {
      console.error("Error inserting new API key:", insertError);
      // If insertion fails, reactivate the old keys
      await supabaseClient
        .from('api_keys')
        .update({ is_active: true })
        .eq('user_id', userId);
      throw new Error('Failed to insert new API key');
    }

    console.log("Successfully regenerated API key");
    return newApiKey;
  } catch (error) {
    console.error("Error in regenerateApiKey:", error);
    throw error;
  }
};