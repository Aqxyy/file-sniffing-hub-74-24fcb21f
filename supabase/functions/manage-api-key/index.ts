import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user has an active subscription
    const { data: subscription, error: subError } = await supabaseClient
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single()

    if (subError || !subscription) {
      throw new Error('No active subscription found')
    }

    if (!['pro', 'lifetime'].includes(subscription.plan_type)) {
      throw new Error('Subscription plan does not include API access')
    }

    // Generate or retrieve API key
    const { data: existingKey } = await supabaseClient
      .from('api_keys')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    if (existingKey) {
      return new Response(
        JSON.stringify({ api_key: existingKey.api_key }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: newKey, error: keyError } = await supabaseClient.rpc('generate_api_key')
    if (keyError) throw keyError

    const { error: insertError } = await supabaseClient
      .from('api_keys')
      .insert([{ user_id: user.id, api_key: newKey }])

    if (insertError) throw insertError

    return new Response(
      JSON.stringify({ api_key: newKey }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})