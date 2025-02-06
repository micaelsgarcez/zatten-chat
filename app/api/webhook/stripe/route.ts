import { stripe } from '@/lib/stripe/config'
import Stripe from 'stripe'

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
])

export async function POST(req: Request) {
  console.log(req)
  const body = await req.text()
  console.log('body :', body)
  const sig = req.headers.get('stripe-signature') as string
  console.log('sig :', sig)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  console.log('webhookSecret :', webhookSecret)
  let event: Stripe.Event

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 })
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    console.log(`🔔  Webhook received: ${event.type}`)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(event.type)) {
    try {
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          console.log('subscription event:', event)
          break
        case 'checkout.session.completed':
          console.log('subscription event:', event)
          break
        default:
          console.log(req)
          throw new Error('Unhandled relevant event!')
      }
    } catch (error) {
      console.log(error)
      return new Response(
        'Webhook handler failed. View your Next.js function logs.',
        {
          status: 400
        }
      )
    }
  } else {
    return new Response(`Unsupported event type: ${event.type}`, {
      status: 400
    })
  }
  return new Response(JSON.stringify({ received: true }))
}
