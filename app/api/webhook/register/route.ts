import { createUser } from '@/lib/db/queries'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  try {
    const headersList = headers()
    // const teste = (await headersList).forEach((value, key) => {
    //   console.log('KEY:', key)
    //   console.log('VALUE:', value)
    // })
    const clerkData = await request.json()
    // console.log('data :', clerkData)

    console.log('emails :', clerkData.data.email_addresses[0].email_address)
    console.log('id :', clerkData.data.id)
    const data = await createUser(
      clerkData.data.email_addresses[0].email_address,
      clerkData.data.id
    )

    const responseExternalId = await fetch(
      `https://api.clerk.com/v1/users/${clerkData.data.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          external_id: data[0].userId
        })
      }
    )
    console.log('responseExternalId :', responseExternalId)
    console.log('data :', await responseExternalId.json())

    return new Response('User created', { status: 200 })
  } catch (error) {
    console.log('error :', error)
    if (
      `${error}`.indexOf('duplicate key value violates unique constrain') > -1
    ) {
      return new Response('Já existe um usuário com os dados enviados.', {
        status: 409
      })
    }
    return new Response('Ocorreu um erro no processamento do servidor', {
      status: 500
    })
  }
}
