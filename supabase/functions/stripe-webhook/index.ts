import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabase = createClient(supabaseUrl!, supabaseKey!)

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
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    console.log('Processing Stripe webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        console.log('Checkout session completed:', session.id)

        // Handle both subscription and one-time payments
        let subscriptionData
        if (session.mode === 'subscription') {
          const subscription = await stripe.subscriptions.retrieve(session.subscription)
          subscriptionData = {
            user_id: session.client_reference_id,
            stripe_subscription_id: subscription.id,
            plan_type: subscription.items.data[0].price.id === 'price_1QTaXfEeS2EtyeTMzMA5ts9U' ? 'pro' : 'standard',
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
        const subscription = event.data.object
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})