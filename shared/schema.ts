import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Learning Paths
export const learningPaths = pgTable("learning_paths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  totalLessons: integer("total_lessons").notNull().default(0),
  estimatedHours: integer("estimated_hours").notNull().default(0),
  orderIndex: integer("order_index").notNull().default(0),
});

// Lessons within paths
export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pathId: varchar("path_id").notNull().references(() => learningPaths.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
  type: text("type").notNull(), // concept, practice, challenge
});

// Industry Scenarios
export const scenarios = pgTable("scenarios", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  category: text("category").notNull(), // ecommerce, hospital, college, banking, social
  schema: jsonb("schema").notNull(), // ER diagram data
  sampleData: jsonb("sample_data").notNull(),
});

// Scenario Exercises
export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  scenarioId: varchar("scenario_id").notNull().references(() => scenarios.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(),
  hint: text("hint"),
  expectedQuery: text("expected_query").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

// User Progress (for future auth)
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").references(() => lessons.id),
  scenarioId: varchar("scenario_id").references(() => scenarios.id),
  exerciseId: varchar("exercise_id").references(() => exercises.id),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Relations
export const learningPathsRelations = relations(learningPaths, ({ many }) => ({
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one }) => ({
  path: one(learningPaths, {
    fields: [lessons.pathId],
    references: [learningPaths.id],
  }),
}));

export const scenariosRelations = relations(scenarios, ({ many }) => ({
  exercises: many(exercises),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  scenario: one(scenarios, {
    fields: [exercises.scenarioId],
    references: [scenarios.id],
  }),
}));

// Insert schemas
export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({ id: true });
export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertScenarioSchema = createInsertSchema(scenarios).omit({ id: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Types
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Exercise = typeof exercises.$inferSelect;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Frontend-only types for interactive features
export interface TableColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  references?: { table: string; column: string };
  isNullable: boolean;
}

export interface TableDefinition {
  name: string;
  columns: TableColumn[];
}

export interface SchemaValidationResult {
  isValid: boolean;
  errors: SchemaError[];
  warnings: SchemaWarning[];
}

export interface SchemaError {
  type: 'missing_pk' | 'invalid_fk' | 'redundant_data' | 'normalization';
  table: string;
  message: string;
  suggestion: string;
}

export interface SchemaWarning {
  type: 'naming' | 'type_choice' | 'nullable';
  table: string;
  column?: string;
  message: string;
  suggestion: string;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
}

export interface QueryError {
  code: string;
  message: string;
  friendlyMessage: string;
  whyItHappened: string;
  howToFix: string;
  relatedConcept?: string;
}

export interface ExecutionStep {
  step: number;
  clause: 'FROM' | 'JOIN' | 'WHERE' | 'GROUP BY' | 'HAVING' | 'SELECT' | 'ORDER BY' | 'LIMIT';
  description: string;
  resultPreview?: string[];
}

export interface JoinVisualization {
  leftTable: { name: string; rows: Record<string, unknown>[] };
  rightTable: { name: string; rows: Record<string, unknown>[] };
  joinType: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
  joinCondition: { leftColumn: string; rightColumn: string };
  matchedRows: number[];
  unmatchedLeftRows: number[];
  unmatchedRightRows: number[];
  resultRows: Record<string, unknown>[];
}
