import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { priceId, userId } = await req.json()
    
    console.log('Creating checkout session for price:', priceId, 'and user:', userId)

    // Get the price to determine if it's a one-time payment or subscription
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Get the price details first
    const price = await stripe.prices.retrieve(priceId);
    console.log('Retrieved price details:', price);

    // Use test price IDs for development
    const testPriceIds = {
      'price_1QTZHvEeS2EtyeTMNWeSozYu': 'price_1QTZHvEeS2EtyeTMNWeSozYu_test',
      'price_1QTZHIEeS2EtyeTMIobx6y3O': 'price_1QTZHIEeS2EtyeTMIobx6y3O_test',
      'price_1QTZwZEeS2EtyeTMcYOFcClK': 'price_1QTZwZEeS2EtyeTMcYOFcClK_test'
    };

    // Use test price ID if in development
    const finalPriceId = process.env.NODE_ENV === 'development' ? testPriceIds[priceId] || priceId : priceId;

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: price.type === 'recurring' ? 'subscription' : 'payment',
      success_url: `${req.headers.get('origin')}/`,
      cancel_url: `${req.headers.get('origin')}/product`,
      client_reference_id: userId,
      payment_method_types: ['card'],
    })

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})