import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
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
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature provided', { status: 400 })
    }

    const body = await req.text()
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    console.log('Processing Stripe webhook event:', event.type)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        console.log('Checkout session completed:', session.id)

        // Get the price ID from the session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        const priceId = lineItems.data[0]?.price?.id

        // Determine plan type based on price ID
        let planType = 'standard'
        if (priceId === 'price_1QTZHIEeS2EtyeTMIobx6y3O') {
          planType = 'pro'
        } else if (priceId === 'price_1QTZwZEeS2EtyeTMcYOFcClK') {
          planType = 'lifetime'
        }

        // Handle both subscription and one-time payments
        let subscriptionData
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
          subscriptionData = {
            user_id: session.client_reference_id,
            stripe_subscription_id: subscription.id,
            plan_type: planType,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }
        } else if (session.mode === 'payment') {
          // Handle lifetime subscription (one-time payment)
          subscriptionData = {
            user_id: session.client_reference_id,
            stripe_subscription_id: session.payment_intent,
            plan_type: 'lifetime',
            status: 'active',
            current_period_end: null, // Lifetime subscription never expires
          }
        }

        if (subscriptionData) {
          console.log('Updating subscription data:', subscriptionData)
          const { error } = await supabase
            .from('subscriptions')
            .upsert(subscriptionData)

          if (error) {
            console.error('Error updating subscription:', error)
            throw error
          }
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('Subscription updated:', subscription.id)

        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)

        if (error) {
          console.error('Error updating subscription:', error)
          throw error
        }
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})