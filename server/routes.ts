import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { pool } from "./db";
import { 
  insertLearningPathSchema, 
  insertLessonSchema, 
  insertScenarioSchema, 
  insertExerciseSchema 
} from "@shared/schema";

interface QueryRequest {
  query: string;
}

interface QueryErrorResponse {
  code: string;
  message: string;
  friendlyMessage: string;
  whyItHappened: string;
  howToFix: string;
  relatedConcept?: string;
}

function translateSQLError(error: Error & { code?: string }): QueryErrorResponse {
  const errorCode = error.code || 'UNKNOWN';
  const message = error.message;
  
  if (errorCode === '42601' || message.includes('syntax error')) {
    return {
      code: 'SYNTAX_ERROR',
      message,
      friendlyMessage: "There's a syntax error in your SQL query.",
      whyItHappened: "SQL has strict grammar rules. A keyword might be misspelled or punctuation is missing.",
      howToFix: "Check for typos in keywords (SELECT, FROM, WHERE). Make sure all parentheses and quotes are matched.",
      relatedConcept: "SQL Syntax Basics"
    };
  }
  
  if (errorCode === '42P01' || message.includes('does not exist')) {
    const tableMatch = message.match(/relation "(\w+)" does not exist/);
    const tableName = tableMatch ? tableMatch[1] : 'the table';
    return {
      code: 'TABLE_NOT_FOUND',
      message,
      friendlyMessage: `The table "${tableName}" doesn't exist.`,
      whyItHappened: "You're trying to query a table that hasn't been created or the name is misspelled.",
      howToFix: "Check the spelling of your table name. Use the schema reference to see available tables.",
      relatedConcept: "Database Tables"
    };
  }
  
  if (errorCode === '42703' || message.includes('column') && message.includes('does not exist')) {
    const colMatch = message.match(/column "(\w+)" does not exist/);
    const colName = colMatch ? colMatch[1] : 'the column';
    return {
      code: 'COLUMN_NOT_FOUND',
      message,
      friendlyMessage: `The column "${colName}" doesn't exist in this table.`,
      whyItHappened: "You're trying to select or filter by a column that isn't in the table.",
      howToFix: "Check the table schema to see what columns are available. Column names are case-sensitive.",
      relatedConcept: "Table Columns"
    };
  }
  
  if (errorCode === '42P10' || message.includes('GROUP BY')) {
    return {
      code: 'GROUPBY_ERROR',
      message,
      friendlyMessage: "There's an issue with your GROUP BY clause.",
      whyItHappened: "When using GROUP BY, every column in SELECT must either be in GROUP BY or be an aggregate function.",
      howToFix: "Add all non-aggregated columns to your GROUP BY clause, or wrap them in an aggregate like MAX() or MIN().",
      relatedConcept: "GROUP BY Clause"
    };
  }
  
  if (errorCode === '22P02' || message.includes('invalid input syntax')) {
    return {
      code: 'TYPE_ERROR',
      message,
      friendlyMessage: "There's a data type mismatch in your query.",
      whyItHappened: "You're comparing or inserting values of incompatible types (like text to a number column).",
      howToFix: "Check that your values match the column types. Numbers don't need quotes, text does.",
      relatedConcept: "Data Types"
    };
  }
  
  return {
    code: 'QUERY_ERROR',
    message,
    friendlyMessage: "Something went wrong with your query.",
    whyItHappened: "The database couldn't execute your query due to an error.",
    howToFix: "Review your query syntax and try again. Check the schema reference for table and column names.",
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/learning-paths", async (_req, res) => {
    try {
      const paths = await storage.getLearningPaths();
      res.json(paths);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning paths" });
    }
  });

  app.get("/api/learning-paths/:id", async (req, res) => {
    try {
      const path = await storage.getLearningPath(req.params.id);
      if (!path) {
        return res.status(404).json({ error: "Learning path not found" });
      }
      res.json(path);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning path" });
    }
  });

  app.get("/api/learning-paths/:id/lessons", async (req, res) => {
    try {
      const lessons = await storage.getLessons(req.params.id);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch lessons" });
    }
  });

  app.get("/api/scenarios", async (_req, res) => {
    try {
      const allScenarios = await storage.getScenarios();
      res.json(allScenarios);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scenarios" });
    }
  });

  app.get("/api/scenarios/:id", async (req, res) => {
    try {
      const scenario = await storage.getScenario(req.params.id);
      if (!scenario) {
        return res.status(404).json({ error: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch scenario" });
    }
  });

  app.get("/api/scenarios/:id/exercises", async (req, res) => {
    try {
      const allExercises = await storage.getExercises(req.params.id);
      res.json(allExercises);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch exercises" });
    }
  });

  app.post("/api/query/execute", async (req, res) => {
    const startTime = Date.now();
    const { query } = req.body as QueryRequest;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ 
        error: translateSQLError(new Error("Query is required")) 
      });
    }

    const trimmedQuery = query.trim().toUpperCase();
    if (
      trimmedQuery.startsWith('DROP') ||
      trimmedQuery.startsWith('DELETE') ||
      trimmedQuery.startsWith('TRUNCATE') ||
      trimmedQuery.startsWith('ALTER') ||
      trimmedQuery.startsWith('CREATE') ||
      trimmedQuery.startsWith('INSERT') ||
      trimmedQuery.startsWith('UPDATE')
    ) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN_OPERATION',
          message: 'This operation is not allowed',
          friendlyMessage: "For safety, this playground only allows SELECT queries.",
          whyItHappened: "Modifying data (INSERT, UPDATE, DELETE) and changing structure (CREATE, ALTER, DROP) are disabled.",
          howToFix: "Practice reading data with SELECT queries. You can't accidentally break anything!",
          relatedConcept: "Query Types"
        }
      });
    }

    try {
      const client = await pool.connect();
      try {
        await client.query('SET statement_timeout = 5000');
        
        const result = await client.query(query);
        const executionTime = Date.now() - startTime;
        
        res.json({
          columns: result.fields.map(f => f.name),
          rows: result.rows,
          rowCount: result.rowCount || 0,
          executionTime
        });
      } finally {
        client.release();
      }
    } catch (error) {
      res.status(400).json({ 
        error: translateSQLError(error as Error & { code?: string }) 
      });
    }
  });

  app.post("/api/schema/validate", async (req, res) => {
    const { tables } = req.body;
    
    if (!tables || !Array.isArray(tables)) {
      return res.status(400).json({ error: "Tables array is required" });
    }

    const errors: Array<{
      type: string;
      table: string;
      message: string;
      suggestion: string;
    }> = [];
    
    const warnings: Array<{
      type: string;
      table: string;
      column?: string;
      message: string;
      suggestion: string;
    }> = [];

    tables.forEach((table: { name: string; columns: Array<{ name: string; type: string; isPrimaryKey: boolean; isForeignKey: boolean; references?: { table: string; column: string } }> }) => {
      const hasPK = table.columns.some(c => c.isPrimaryKey);
      if (!hasPK) {
        errors.push({
          type: 'missing_pk',
          table: table.name,
          message: `Table "${table.name}" has no primary key`,
          suggestion: "Every table should have a primary key to uniquely identify rows. Add an 'id' column."
        });
      }

      table.columns.forEach(col => {
        if (col.isForeignKey && !col.references) {
          errors.push({
            type: 'invalid_fk',
            table: table.name,
            message: `Foreign key "${col.name}" has no reference`,
            suggestion: "Specify which table and column this foreign key points to."
          });
        }

        if (col.name.includes(' ')) {
          warnings.push({
            type: 'naming',
            table: table.name,
            column: col.name,
            message: 'Column name contains spaces',
            suggestion: "Use snake_case (underscores) instead of spaces in column names."
          });
        }
      });

      if (table.name.includes(' ')) {
        warnings.push({
          type: 'naming',
          table: table.name,
          message: 'Table name contains spaces',
          suggestion: "Use snake_case (underscores) instead of spaces in table names."
        });
      }
    });

    res.json({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  });

  return httpServer;
}
