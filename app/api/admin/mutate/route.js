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
    const type = data?._type || 'product'

    if (!token) {
      return NextResponse.json({ error: 'SANITY_WRITE_TOKEN is not configured' }, { status: 500 })
    }

    switch (action) {
      case 'create':
        const createPayload = {
          _type: type,
          ...data
        }
        // Handle slug if needed (mostly for product/category)
        if (data.name && !data.slug) {
          createPayload.slug = { _type: 'slug', current: data.name.toLowerCase().trim().replace(/\s+/g, '-') }
        } else if (data.title && !data.slug) {
          createPayload.slug = { _type: 'slug', current: data.title.toLowerCase().trim().replace(/\s+/g, '-') }
        }

        const newDoc = await writeClient.create(createPayload)
        return NextResponse.json(newDoc)

      case 'patch':
        const { id, _type, ...fields } = data
        const patchedDoc = await writeClient
          .patch(id)
          .set(fields)
          .commit()
        return NextResponse.json(patchedDoc)

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
