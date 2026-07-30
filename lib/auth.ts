import { betterAuth } from 'better-auth'
import { pool } from '@/lib/db'

// Only pin a fixed base URL when we have a real deployment host.
// In the v0 preview / local dev, leaving baseURL undefined lets Better Auth
// infer the origin from the incoming request, which avoids "Invalid origin"
// errors when the browser is on http://localhost:3000 but an env var points
// at a different https preview host.
const deploymentBaseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : undefined)

export const auth = betterAuth({
  database: pool,
  ...(deploymentBaseURL ? { baseURL: deploymentBaseURL } : {}),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  // The v0 preview runs inside an iframe served from a rotating host
  // (e.g. https://sb-xxxx.vercel.run or https://*.vusercontent.net), so a
  // fixed URL can't keep up. Better Auth supports wildcard origin patterns,
  // which we use to trust the v0 preview/sandbox domains, plus localhost and
  // the real deployment host for production.
  trustedOrigins: [
    'http://localhost:3000',
    'https://localhost:3000',
    'https://*.vercel.run',
    'https://*.vusercontent.net',
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  ...(process.env.NODE_ENV === 'development'
    ? {
        advanced: {
          // In dev (v0 preview iframe), force cross-site cookies so the
          // session cookie is stored by the browser.
          defaultCookieAttributes: {
            sameSite: 'none' as const,
            secure: true,
          },
        },
      }
    : {}),
})
