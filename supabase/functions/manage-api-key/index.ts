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

    // Vérifier si l'utilisateur a un abonnement actif et valide
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

    // Vérifier si l'API est activée globalement
    const { data: siteSettings, error: settingsError } = await supabaseClient
      .from('site_settings')
      .select('api_enabled')
      .single()

    if (settingsError) throw settingsError
    if (!siteSettings?.api_enabled) {
      throw new Error('API access is currently disabled')
    }

    // Générer une clé API simple (à améliorer en production)
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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})