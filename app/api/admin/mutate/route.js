import { createClient } from 'next-sanity'
import { NextResponse } from 'next/server'

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-04-05',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
}
const writeClient = createClient(config)

export async function POST(req) {
  try {
    if (!config.projectId || !config.token) {
      return NextResponse.json({ error: "Missing Sanity config" }, { status: 500 })
    }

    const body = await req.json()
    if (!body || !body.action) {
      return NextResponse.json({ error: "No body or action provided" }, { status: 400 })
    }

    const { action, data } = body
    if (!data) return NextResponse.json({ error: "No data provided" }, { status: 400 })

    if (action === 'delete') {
      if (!data.id) return NextResponse.json({ error: "ID required for delete" }, { status: 400 })
      await writeClient.delete(data.id)
      return NextResponse.json({ success: true })
    }

    const type = data?._type || 'product'
    const payload = { ...data, _type: type }

    if (!data.slug && (data.name || data.title)) {
      payload.slug = { _type: 'slug', current: (data.name || data.title).toLowerCase().trim().replace(/\s+/g, '-') }
    }

    if (action === 'create') return NextResponse.json(await writeClient.create(payload))
    if (action === 'patch') {
      const { id, _type, ...fields } = data
      if (!id) return NextResponse.json({ error: "ID required for patch" }, { status: 400 })
      return NextResponse.json(await writeClient.patch(id).set(fields).commit())
    }
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
