export const getApiKey = async (supabaseClient: any, userId: string) => {
  console.log("Fetching API key for user:", userId);
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
};

export const regenerateApiKey = async (supabaseClient: any, userId: string) => {
  console.log("Regenerating API key for user:", userId);
  const newApiKey = `sk_${crypto.randomUUID()}`;

  try {
    // Deactivate old key
    const { error: updateError } = await supabaseClient
      .from('api_keys')
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('is_active', true);

    if (updateError) {
      console.error("Error deactivating old API key:", updateError);
      throw updateError;
    }

    // Generate and insert new key
    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: userId,
        key_value: newApiKey,
        is_active: true
      });

    if (insertError) {
      console.error("Error inserting regenerated API key:", insertError);
      throw insertError;
    }

    console.log("API key regenerated successfully");
    return newApiKey;
  } catch (error) {
    console.error("Transaction error:", error);
    throw new Error('Error regenerating API key');
  }
};