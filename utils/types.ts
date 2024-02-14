import type { Buffer } from 'node:buffer'

export interface StorageDriver {
  reserveCache: (cacheId: number, cacheSize: number) => Promise<boolean> | boolean
  commitCache: (cacheId: number) => Promise<void> | void
  download: (cacheId: number) => Promise<ReadableStream> | ReadableStream
  uploadChunk: (
    cacheId: number,
    chunkStream: ReadableStream<Buffer>,
    chunkStart: number,
    chunkEnd: number,
  ) => Promise<void> | void
}

export interface StorageAdapter {
  getCacheEntry: (keys: string[], version: string) => Promise<ArtifactCacheEntry | null>
  download: (cacheId: number) => Promise<ReadableStream>
  uploadChunk: (
    cacheId: number,
    chunkStream: ReadableStream<Buffer>,
    chunkStart: number,
    chunkEnd: number,
  ) => Promise<void>
  commitCache: (cacheId: number, size: number) => Promise<void>
  reserveCache: (key: string, cacheSize: number, version?: string) => Promise<ReserveCacheResponse>
}

export interface ArtifactCacheEntry {
  cacheKey?: string
  archiveLocation: string
}

export interface ReserveCacheResponse {
  cacheId: number | null
}
