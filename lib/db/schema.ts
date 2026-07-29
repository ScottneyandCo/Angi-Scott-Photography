import {
  pgTable,
  text,
  timestamp,
  boolean,
  serial,
  integer,
} from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------
// This is a single-admin site (the photographer). Photos and site content are
// global site content, not per-user data. Write actions are gated by requiring
// a valid Better Auth session.

export const photos = pgTable('photos', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  url: text('url').notNull(),
  title: text('title'),
  category: text('category').notNull().default('lifestyle'),
  sortOrder: integer('sortOrder').notNull().default(0),
  featured: boolean('featured').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const siteContent = pgTable('site_content', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  key: text('key').notNull(),
  value: text('value').notNull().default(''),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// Contact form submissions. Public (anyone can insert via the contact action);
// reading/managing is gated behind a valid admin session.
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  sessionType: text('sessionType'),
  preferredDate: text('preferredDate'),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  emailed: boolean('emailed').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
