import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { validateUser, checkAccess } from "./auth.ts"
import { getApiKey, regenerateApiKey } from "./apiKeyManager.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

serve(async (req) => {
  console.log("Received request:", req.method);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate user and get Supabase client
    const { user, supabaseClient } = await validateUser(req.headers.get('Authorization'));
    console.log("User validated:", user.id);
    
    // Check access permissions
    await checkAccess(supabaseClient, user);
    console.log("Access checked and validated");

    // Handle GET request - fetch existing API key
    if (req.method === 'GET') {
      console.log("Processing GET request for API key");
      const apiKey = await getApiKey(supabaseClient, user.id);
      return new Response(
        JSON.stringify({ api_key: apiKey }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle POST request - regenerate API key
    if (req.method === 'POST') {
      console.log("Processing POST request to regenerate API key");
      const apiKey = await regenerateApiKey(supabaseClient, user.id);
      return new Response(
        JSON.stringify({ api_key: apiKey }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        details: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 500
      }
    );
  }
})