import { pgTable, serial, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
  id: serial('id').primaryKey(),
  formData: varchar('formData').notNull(),
  aiResponse: text('aiResponse'),
  templateSlug: varchar('template-slug').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
  userId: varchar('userId').notNull(),  // Set a default value for userId
});


// New Notes Table
export const Notes = pgTable('notes', {
  id: serial('id').primaryKey(),       // Unique identifier for each note
  userId: varchar('userId').notNull(), // User ID to associate the note with a specific user
  title: varchar('title', { length: 255 }).notNull(), // Title of the note
  content: text('content').notNull(), // Content of the note
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(), // Creation timestamp
  bookmarked: boolean('bookmarked').default(false), 
  pinned: boolean("pinned").default(false), 
});


