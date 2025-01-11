import { pgTable, serial, text, varchar, timestamp, boolean, numeric, date } from "drizzle-orm/pg-core";

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

// Expenses Table
export const Expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),       // Unique identifier for each expense
  userId: varchar('userId').notNull(), // User ID to associate the expense with a specific user
  name: varchar('name', { length: 255 }).notNull(), // Name or description of the expense
  amount: numeric('amount').notNull(),  // Amount spent on the expense
  category: varchar('category', { length: 255 }), // Category of the expense (e.g., "Food", "Transport")
  createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow(), // Creation timestamp
  updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow(), // Last updated timestamp
  date: date('date').notNull(), // Date of the expense (without time)
  day: varchar('day', { length: 10 }).notNull(), // Day of the week (e.g., "Monday")
});

