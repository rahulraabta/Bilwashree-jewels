import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-05'
const token = process.env.SANITY_WRITE_TOKEN

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

export async function POST(req) {
  try {
    const { action, data } = await req.json()

    if (!token) {
      return NextResponse.json({ error: 'SANITY_WRITE_TOKEN is not configured' }, { status: 500 })
    }

    switch (action) {
      case 'create':
        const newProduct = await writeClient.create({
          _type: 'product',
          ...data,
          slug: { _type: 'slug', current: data.name.toLowerCase().replace(/\s+/g, '-') }
        })
        return NextResponse.json(newProduct)

      case 'patch':
        const { id, ...fields } = data
        const patchedProduct = await writeClient
          .patch(id)
          .set(fields)
          .commit()
        return NextResponse.json(patchedProduct)

      case 'delete':
        await writeClient.delete(data.id)
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Mutation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
