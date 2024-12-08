import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    
    // Get user data
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    console.log("User data:", user?.id)

    if (userError || !user) {
      console.error("Auth error:", userError)
      throw new Error('Unauthorized')
    }

    // Check subscription status with detailed logging
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle() // Use maybeSingle instead of single

    console.log("Subscription data:", subscription)
    
    if (subError) {
      console.error("Subscription fetch error:", subError)
      throw new Error('Error fetching subscription')
    }

    if (!subscription) {
      console.error("No active subscription found for user:", user.id)
      throw new Error('No active subscription found')
    }

    if (!['pro', 'lifetime'].includes(subscription.plan_type)) {
      console.error("Invalid plan type:", subscription.plan_type)
      throw new Error('Subscription plan does not include API access')
    }

    // Check if API access is enabled for this subscription
    if (!subscription.api_access) {
      console.error("API access not enabled for subscription:", subscription.id)
      throw new Error('API access not enabled for this subscription')
    }

    // Check global API status
    const { data: siteSettings, error: settingsError } = await supabaseClient
      .from('site_settings')
      .select('api_enabled')
      .maybeSingle() // Use maybeSingle here too

    if (settingsError) {
      console.error("Site settings error:", settingsError)
      throw settingsError
    }

    if (!siteSettings?.api_enabled) {
      console.error("Global API access is disabled")
      throw new Error('API access is currently disabled')
    }

    // Generate API key
    const apiKey = `sk_${crypto.randomUUID()}`

    return new Response(
      JSON.stringify({ api_key: apiKey }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error("Function error:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})