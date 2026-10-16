import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { getCloudflareContext } from '@opennextjs/cloudflare'

const isWorkers = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers'

function createClient(connectionString: string | undefined, maxUses?: number) {
  return new PrismaClient({ adapter: new PrismaPg({ connectionString, maxUses }) })
}

// Node (Vercel, next dev, next build): one client per process, as before
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function getNodeClient() {
  if (!globalForPrisma.prisma) globalForPrisma.prisma = createClient(process.env.DATABASE_URL)
  return globalForPrisma.prisma
}

// Cloudflare Workers can't share sockets between requests, so each request
// gets its own client. Hyperdrive is used when bound, else DATABASE_URL.
const requestClients = new WeakMap<object, PrismaClient>()

function getWorkersClient() {
  const { env, ctx } = getCloudflareContext()
  let client = requestClients.get(ctx)
  if (!client) {
    const hyperdrive = (env as { HYPERDRIVE?: { connectionString: string } }).HYPERDRIVE
    client = createClient(hyperdrive?.connectionString ?? process.env.DATABASE_URL, 1)
    requestClients.set(ctx, client)
  }
  return client
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = isWorkers ? getWorkersClient() : getNodeClient()
    const value = Reflect.get(client, prop)
    return typeof value === 'function' ? value.bind(client) : value
  },
})
