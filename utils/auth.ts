export const auth = defineEventHandler((event) => {
  // /download handles authentication differently
  if (event.path.startsWith('/download')) return

  const token = event.context.params?.token
  if (typeof token !== 'string' || token !== ENV.CACHE_SERVER_TOKEN)
    throw createError({ statusCode: 401 })
})
