import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { validateUser } from "./auth.ts"
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
    const { user, supabaseClient } = await validateUser(req.headers.get('Authorization'));

    let result;
    if (req.method === 'GET') {
      result = await getApiKey(supabaseClient, user.id);
    } else if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      if (body.action === 'regenerate') {
        result = await regenerateApiKey(supabaseClient, user.id);
      } else {
        throw new Error('Invalid action');
      }
    } else {
      throw new Error('Method not allowed');
    }

    return new Response(
      JSON.stringify({ api_key: result }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
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