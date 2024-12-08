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

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Map live price IDs to test price IDs
    const testPriceIds: { [key: string]: string } = {
      'price_1QTZHvEeS2EtyeTMNWeSozYu': 'price_1QTZHvEeS2EtyeTMNWeSozYu_test',
      'price_1QTZHIEeS2EtyeTMIobx6y3O': 'price_1QTZHIEeS2EtyeTMIobx6y3O_test',
      'price_1QTZwZEeS2EtyeTMcYOFcClK': 'price_1QTZwZEeS2EtyeTMcYOFcClK_test'
    };

    // Determine if we're in test mode by checking the Stripe key
    const isTestMode = Deno.env.get('STRIPE_SECRET_KEY')?.startsWith('sk_test_');
    console.log('Stripe mode:', isTestMode ? 'test' : 'live');

    // Use test price ID if in test mode
    const finalPriceId = isTestMode ? (testPriceIds[priceId] || priceId) : priceId;
    console.log('Using price ID:', finalPriceId);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: finalPriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
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
    
    // Provide more specific error messages
    let errorMessage = error.message;
    if (error.message.includes('cannot currently make live charges')) {
      errorMessage = 'Stripe account is in test mode. Please use test credit card numbers for payments.';
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})