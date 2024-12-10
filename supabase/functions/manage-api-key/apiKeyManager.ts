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
    // First check if user has any existing keys
    const { data: existingKeys, error: checkError } = await supabaseClient
      .from('api_keys')
      .select('id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (checkError) {
      console.error("Error checking existing keys:", checkError);
      throw new Error('Failed to check existing keys');
    }

    // Generate new API key
    const newApiKey = `sk_${crypto.randomUUID()}`;
    console.log("Generated new API key");

    // If there are existing keys, deactivate them
    if (existingKeys && existingKeys.length > 0) {
      console.log("Deactivating existing keys");
      const { error: deactivateError } = await supabaseClient
        .from('api_keys')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('is_active', true);

      if (deactivateError) {
        console.error("Error deactivating old keys:", deactivateError);
        throw new Error('Failed to deactivate old keys');
      }
      console.log("Old keys deactivated successfully");
    }

    // Insert new key
    console.log("Inserting new API key");
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

    return newApiKey;
  } catch (error) {
    console.error("Error in regenerateApiKey:", error);
    throw error;
  }
};