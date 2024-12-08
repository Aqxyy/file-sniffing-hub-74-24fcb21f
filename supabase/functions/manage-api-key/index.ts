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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error("No authorization header")
      throw new Error('No authorization header')
    }

    // Get user from token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    console.log("Checking user:", user?.email)

    if (userError || !user) {
      console.error("Auth error:", userError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 401
        }
      )
    }

    // Check if user is admin first
    if (user.email === "williamguerif@gmail.com") {
      console.log("Admin user detected, generating API key")
      const apiKey = `sk_${crypto.randomUUID()}`
      return new Response(
        JSON.stringify({ api_key: apiKey }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // For non-admin users, check subscription status
    console.log("Checking subscription for user:", user.id)
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle()

    console.log("Subscription data:", subscription)
    
    if (subError) {
      console.error("Subscription fetch error:", subError)
      return new Response(
        JSON.stringify({ error: 'Error fetching subscription' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    if (!subscription) {
      console.error("No active subscription found for user:", user.id)
      return new Response(
        JSON.stringify({ error: 'No active subscription found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      )
    }

    if (!['pro', 'lifetime'].includes(subscription.plan_type)) {
      console.error("Invalid plan type:", subscription.plan_type)
      return new Response(
        JSON.stringify({ error: 'Subscription plan does not include API access' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      )
    }

    // Check global API status
    const { data: siteSettings, error: settingsError } = await supabaseClient
      .from('site_settings')
      .select('api_enabled')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (settingsError) {
      console.error("Site settings error:", settingsError)
      return new Response(
        JSON.stringify({ error: 'Error checking API status' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    if (!siteSettings?.api_enabled) {
      console.error("Global API access is disabled")
      return new Response(
        JSON.stringify({ error: 'API access is currently disabled' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      )
    }

    // Generate API key
    const apiKey = `sk_${crypto.randomUUID()}`

    return new Response(
      JSON.stringify({ api_key: apiKey }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error("Function error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})