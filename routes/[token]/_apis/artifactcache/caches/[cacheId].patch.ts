import { z } from 'zod'

import type { Buffer } from 'node:buffer'

import { useStorageDriver } from '@/plugins/storage'
import { auth } from '@/utils/auth'

const pathParamsSchema = z.object({
  cacheId: z.coerce.number(),
})

export default defineEventHandler({
  onRequest: [auth],
  handler: async (event) => {
    const parsedPathParams = pathParamsSchema.safeParse(event.context.params)
    if (!parsedPathParams.success) throw createError({ statusCode: 400 })

    const { cacheId } = parsedPathParams.data

    const stream = getRequestWebStream(event)
    if (!stream) throw createError({ statusCode: 400 })

    const contentRangeHeader = getHeader(event, 'content-range')
    if (!contentRangeHeader) throw createError({ statusCode: 400 })

    const { start, end } = parseContentRangeHeader(contentRangeHeader)

    const storage = useStorageDriver()
    await storage.uploadChunk(cacheId, stream as ReadableStream<Buffer>, start, end)
  },
})

function parseContentRangeHeader(contentRange: string) {
  const [start, end] = contentRange.replace('bytes', '').replace('/*', '').trim().split('-')
  return { start: Number.parseInt(start), end: Number.parseInt(end) }
}
