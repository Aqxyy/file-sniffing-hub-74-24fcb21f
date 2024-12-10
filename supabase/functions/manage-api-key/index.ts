import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        ...corsHeaders,
        'Access-Control-Max-Age': '86400',
      }
    });
  }

  try {
    // Initialize Supabase client with proper error handling
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing environment variables");
      throw new Error('Server configuration error');
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Validate authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      );
    }

    // Check if user is admin
    const isAdmin = user.email === "williamguerif@gmail.com";
    
    if (!isAdmin) {
      // For non-admin users, check subscription status
      const { data: subscription, error: subError } = await supabaseClient
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (subError) {
        console.error("Subscription fetch error:", subError);
        return new Response(
          JSON.stringify({ error: 'Error fetching subscription' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      if (!subscription || !['pro', 'lifetime'].includes(subscription.plan_type)) {
        return new Response(
          JSON.stringify({ error: 'No valid subscription found' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 403
          }
        );
      }
    }

    // Check global API status
    const { data: siteSettings, error: settingsError } = await supabaseClient
      .from('site_settings')
      .select('api_enabled')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (settingsError) {
      console.error("Error fetching site settings:", settingsError);
      return new Response(
        JSON.stringify({ error: 'Error fetching site settings' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      );
    }

    if (!siteSettings?.api_enabled && !isAdmin) {
      return new Response(
        JSON.stringify({ error: 'API access is currently disabled' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      );
    }

    // Handle GET request - fetch existing API key
    if (req.method === 'GET') {
      console.log("Fetching API key for user:", user.id);
      const { data: existingKey, error: keyError } = await supabaseClient
        .from('api_keys')
        .select('key_value')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();

      if (keyError) {
        console.error("Error fetching API key:", keyError);
        return new Response(
          JSON.stringify({ error: 'Error fetching API key' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      // If a key exists, return it
      if (existingKey) {
        console.log("Existing API key found");
        return new Response(
          JSON.stringify({ api_key: existingKey.key_value }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If no key exists, generate a new one
      console.log("No existing API key found, generating new one");
      const newApiKey = `sk_${crypto.randomUUID()}`;
      const { error: insertError } = await supabaseClient
        .from('api_keys')
        .insert({
          user_id: user.id,
          key_value: newApiKey,
          is_active: true
        });

      if (insertError) {
        console.error("Error inserting new API key:", insertError);
        return new Response(
          JSON.stringify({ error: 'Error creating API key' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }

      console.log("New API key generated and stored");
      return new Response(
        JSON.stringify({ api_key: newApiKey }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle POST request - regenerate API key
    if (req.method === 'POST') {
      console.log("Regenerating API key for user:", user.id);
      
      try {
        // Start a transaction
        const newApiKey = `sk_${crypto.randomUUID()}`;
        
        // Deactivate old key
        const { error: updateError } = await supabaseClient
          .from('api_keys')
          .update({ is_active: false })
          .eq('user_id', user.id)
          .eq('is_active', true);

        if (updateError) {
          console.error("Error deactivating old API key:", updateError);
          throw updateError;
        }

        // Generate and insert new key
        const { error: insertError } = await supabaseClient
          .from('api_keys')
          .insert({
            user_id: user.id,
            key_value: newApiKey,
            is_active: true
          });

        if (insertError) {
          console.error("Error inserting regenerated API key:", insertError);
          throw insertError;
        }

        console.log("API key regenerated successfully");
        return new Response(
          JSON.stringify({ api_key: newApiKey }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error("Transaction error:", error);
        return new Response(
          JSON.stringify({ error: 'Error regenerating API key' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
})