const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted'
])

export async function POST(req: Request) {
  console.log(req)
  const body = await req.json()
  console.log('body :', body)
  const sig = req.headers.get('stripe-signature') as string
  console.log('sig :', sig)
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  console.log('webhookSecret :', webhookSecret)

  try {
    if (!sig || !webhookSecret)
      return new Response('Webhook secret not found.', { status: 400 })
    console.log(`🔔  Webhook received: ${body.event.type}`)
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (relevantEvents.has(body.event.type)) {
    try {
      switch (body.event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
        case 'customer.subscription.deleted':
          break
        case 'checkout.session.completed':
          break
        default:
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
    return new Response(`Unsupported event type: ${body.event.type}`, {
      status: 400
    })
  }
  return new Response(JSON.stringify({ received: true }))
}
