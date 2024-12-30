import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const AIOutput = pgTable('aiOutput', {
  id: serial('id').primaryKey(),
  formData: varchar('formData').notNull(),
  aiResponse: text('aiResponse'),
  templateSlug: varchar('template-slug').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: timestamp('createdAt').defaultNow(), // Changed to timestamp with defaultNow()
  userId: varchar('userId').notNull(),
});

export const Notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  noteContent: text('noteContent').notNull(),
  organizationId: varchar('organizationId').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  createdBy: varchar('createdBy').notNull(),
  userId: varchar('userId').notNull(),
  
});
