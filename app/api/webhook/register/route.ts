import { createUser } from '@/lib/db/queries'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const headersList = await headers()
  console.log('headersList :', headersList)
  const clerkData = await request.json()
  console.log('data :', clerkData)

  const user = await createUser(
    clerkData.data.email_addresses[0].email_address,
    clerkData.data.id
  )
  console.log('user :', user)

  // const responseExternalId = await fetch(`https://api.clerk.com/v1/users/${clerkData.data.id}`, {
  //   method: 'PATCH',
  //   body: JSON.stringify({
  //     external_id:
  //   }),
  //   headers: {
  //     'authorization': `bearer ${process.env.CLERK_SECRET_KEY}`
  //   }
  // })

  return new Response('User created', { status: 200 })
}
