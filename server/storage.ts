import { 
  users, learningPaths, lessons, scenarios, exercises, userProgress,
  type User, type InsertUser, 
  type LearningPath, type InsertLearningPath,
  type Lesson, type InsertLesson,
  type Scenario, type InsertScenario,
  type Exercise, type InsertExercise,
  type UserProgress, type InsertUserProgress
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getLearningPaths(): Promise<LearningPath[]>;
  getLearningPath(id: string): Promise<LearningPath | undefined>;
  createLearningPath(path: InsertLearningPath): Promise<LearningPath>;
  
  getLessons(pathId: string): Promise<Lesson[]>;
  getLesson(id: string): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  getScenarios(): Promise<Scenario[]>;
  getScenario(id: string): Promise<Scenario | undefined>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;
  
  getExercises(scenarioId: string): Promise<Exercise[]>;
  getExercise(id: string): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  
  getUserProgress(lessonId?: string, exerciseId?: string): Promise<UserProgress[]>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getLearningPaths(): Promise<LearningPath[]> {
    return db.select().from(learningPaths).orderBy(learningPaths.orderIndex);
  }

  async getLearningPath(id: string): Promise<LearningPath | undefined> {
    const [path] = await db.select().from(learningPaths).where(eq(learningPaths.id, id));
    return path || undefined;
  }

  async createLearningPath(path: InsertLearningPath): Promise<LearningPath> {
    const [created] = await db.insert(learningPaths).values(path).returning();
    return created;
  }

  async getLessons(pathId: string): Promise<Lesson[]> {
    return db.select().from(lessons).where(eq(lessons.pathId, pathId)).orderBy(lessons.orderIndex);
  }

  async getLesson(id: string): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson || undefined;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [created] = await db.insert(lessons).values(lesson).returning();
    return created;
  }

  async getScenarios(): Promise<Scenario[]> {
    return db.select().from(scenarios);
  }

  async getScenario(id: string): Promise<Scenario | undefined> {
    const [scenario] = await db.select().from(scenarios).where(eq(scenarios.id, id));
    return scenario || undefined;
  }

  async createScenario(scenario: InsertScenario): Promise<Scenario> {
    const [created] = await db.insert(scenarios).values(scenario).returning();
    return created;
  }

  async getExercises(scenarioId: string): Promise<Exercise[]> {
    return db.select().from(exercises).where(eq(exercises.scenarioId, scenarioId)).orderBy(exercises.orderIndex);
  }

  async getExercise(id: string): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise || undefined;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [created] = await db.insert(exercises).values(exercise).returning();
    return created;
  }

  async getUserProgress(lessonId?: string, exerciseId?: string): Promise<UserProgress[]> {
    if (lessonId) {
      return db.select().from(userProgress).where(eq(userProgress.lessonId, lessonId));
    }
    if (exerciseId) {
      return db.select().from(userProgress).where(eq(userProgress.exerciseId, exerciseId));
    }
    return db.select().from(userProgress);
  }

  async updateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const [created] = await db.insert(userProgress).values(progress).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
