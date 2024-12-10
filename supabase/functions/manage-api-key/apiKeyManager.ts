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
    // Generate new API key first
    const newApiKey = `sk_${crypto.randomUUID()}`;
    console.log("Generated new API key");

    // Insert the new key
    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: userId,
        key_value: newApiKey,
        is_active: true
      });

    if (insertError) {
      console.error("Error inserting new API key:", insertError);
      throw new Error('Failed to insert new API key');
    }

    console.log("New API key inserted successfully");

    // Now deactivate all other keys
    const { error: deactivateError } = await supabaseClient
      .from('api_keys')
      .update({ is_active: false })
      .eq('user_id', userId)
      .neq('key_value', newApiKey);

    if (deactivateError) {
      console.error("Error deactivating old keys:", deactivateError);
      // If we fail to deactivate old keys, we should remove the new key to maintain consistency
      await supabaseClient
        .from('api_keys')
        .delete()
        .eq('key_value', newApiKey);
      throw new Error('Failed to deactivate old keys');
    }

    console.log("Successfully regenerated API key");
    return newApiKey;
  } catch (error) {
    console.error("Error in regenerateApiKey:", error);
    throw error;
  }
};