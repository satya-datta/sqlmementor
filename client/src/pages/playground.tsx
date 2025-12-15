import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "@monaco-editor/react";
import { format } from "sql-formatter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Play,
  RotateCcw,
  Wand2,
  Copy,
  Check,
  Table2,
  Database,
  Clock,
  AlertCircle,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { QueryResult, QueryError, ExecutionStep } from "@shared/schema";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const defaultQuery = `-- Try writing a SQL query!
-- Example: Get all customers who made orders over $100

SELECT customers.name, orders.total
FROM customers
INNER JOIN orders ON customers.id = orders.customer_id
WHERE orders.total > 100
ORDER BY orders.total DESC;`;

const sampleSchema = [
  {
    name: "customers",
    columns: [
      { name: "id", type: "INTEGER", pk: true },
      { name: "name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(255)" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "INTEGER", pk: true },
      { name: "customer_id", type: "INTEGER", fk: "customers.id" },
      { name: "total", type: "DECIMAL(10,2)" },
      { name: "status", type: "VARCHAR(50)" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "id", type: "INTEGER", pk: true },
      { name: "name", type: "VARCHAR(200)" },
      { name: "price", type: "DECIMAL(10,2)" },
      { name: "category", type: "VARCHAR(100)" },
    ],
  },
];

const sampleResults: QueryResult = {
  columns: ["name", "total"],
  rows: [
    { name: "Alice Johnson", total: 299.99 },
    { name: "Bob Smith", total: 189.50 },
    { name: "Carol Williams", total: 156.00 },
    { name: "David Brown", total: 124.75 },
    { name: "Emma Davis", total: 115.25 },
  ],
  rowCount: 5,
  executionTime: 12,
};

const executionSteps: ExecutionStep[] = [
  { step: 1, clause: "FROM", description: "Start with the customers table" },
  { step: 2, clause: "JOIN", description: "Join orders table on customer_id" },
  { step: 3, clause: "WHERE", description: "Filter orders where total > 100" },
  { step: 4, clause: "SELECT", description: "Pick name and total columns" },
  { step: 5, clause: "ORDER BY", description: "Sort by total in descending order" },
];

export default function Playground() {
  const [query, setQuery] = useState(defaultQuery);
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<QueryError | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showExecution, setShowExecution] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(true);

  const handleRunQuery = useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setResults(null);
    
    try {
      const response = await fetch('/api/query/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        setError(data.error);
        setShowExecution(false);
      } else {
        setResults(data);
        setShowExecution(true);
      }
    } catch (err) {
      setError({
        code: "NETWORK_ERROR",
        message: "Failed to connect to server",
        friendlyMessage: "Couldn't reach the server.",
        whyItHappened: "There may be a network issue or the server is temporarily unavailable.",
        howToFix: "Check your connection and try again.",
      });
    }
    
    setIsRunning(false);
  }, [query]);

  const handleFormat = useCallback(() => {
    try {
      const formatted = format(query, { language: "postgresql" });
      setQuery(formatted);
    } catch {
      // Silently fail if formatting fails
    }
  }, [query]);

  const handleReset = useCallback(() => {
    setQuery(defaultQuery);
    setResults(null);
    setError(null);
    setShowExecution(false);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight">SQL Playground</h1>
          <p className="text-muted-foreground">
            Write, run, and learn from your SQL queries in a safe environment.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Collapsible open={schemaOpen} onOpenChange={setSchemaOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer pb-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">Schema Reference</CardTitle>
                      </div>
                      {schemaOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-4">
                        {sampleSchema.map((table) => (
                          <div key={table.name} className="rounded-lg border p-3">
                            <div className="mb-2 flex items-center gap-2">
                              <Table2 className="h-4 w-4 text-primary" />
                              <span className="font-mono text-sm font-semibold">
                                {table.name}
                              </span>
                            </div>
                            <div className="space-y-1">
                              {table.columns.map((col) => (
                                <div
                                  key={col.name}
                                  className="flex items-center justify-between text-xs"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono">{col.name}</span>
                                    {col.pk && (
                                      <Badge variant="secondary" size="sm" className="text-[10px]">
                                        PK
                                      </Badge>
                                    )}
                                    {col.fk && (
                                      <Badge variant="outline" size="sm" className="text-[10px]">
                                        FK
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-muted-foreground">{col.type}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 lg:col-span-3"
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b bg-muted/30 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle className="text-base">Query Editor</CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleFormat}
                      data-testid="button-format"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Format
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopy}
                      data-testid="button-copy"
                    >
                      {copied ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <Copy className="mr-2 h-4 w-4" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleReset}
                      data-testid="button-reset"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRunQuery}
                      disabled={isRunning}
                      data-testid="button-run"
                    >
                      {isRunning ? (
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <Play className="mr-2 h-4 w-4" />
                      )}
                      Run Query
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[280px]">
                  <Editor
                    height="100%"
                    language="sql"
                    theme="vs-light"
                    value={query}
                    onChange={(value) => setQuery(value || "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                      lineNumbers: "on",
                      padding: { top: 16, bottom: 16 },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: "on",
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-l-4 border-l-destructive">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-lg">
                          {error.friendlyMessage}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="mb-1 font-semibold">Why this happened</h4>
                        <p className="text-sm text-muted-foreground">
                          {error.whyItHappened}
                        </p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold">How to fix it</h4>
                        <p className="text-sm text-muted-foreground">{error.howToFix}</p>
                      </div>
                      {error.relatedConcept && (
                        <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-3">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            Learn more:{" "}
                            <span className="font-medium text-primary">
                              {error.relatedConcept}
                            </span>
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {results && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tabs defaultValue="results" className="space-y-4">
                    <TabsList>
                      <TabsTrigger value="results" data-testid="tab-results">
                        Results
                      </TabsTrigger>
                      <TabsTrigger value="execution" data-testid="tab-execution">
                        Execution Steps
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="results">
                      <Card>
                        <CardHeader className="border-b py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-4">
                              <Badge variant="secondary">
                                {results.rowCount} rows
                              </Badge>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{results.executionTime}ms</span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <ScrollArea className="max-h-[300px]">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b bg-muted/30">
                                  {results.columns.map((col) => (
                                    <th
                                      key={col}
                                      className="px-4 py-3 text-left text-sm font-semibold"
                                    >
                                      {col}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {results.rows.map((row, i) => (
                                  <tr
                                    key={i}
                                    className="border-b transition-colors hover:bg-muted/30"
                                  >
                                    {results.columns.map((col) => (
                                      <td
                                        key={col}
                                        className="px-4 py-3 text-sm"
                                      >
                                        {String(row[col])}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="execution">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base">
                            Query Execution Order
                          </CardTitle>
                          <CardDescription>
                            SQL doesn't execute top-to-bottom. Here's how your
                            query actually runs.
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {executionSteps.map((step, index) => (
                              <motion.div
                                key={step.step}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-4"
                              >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                                  {step.step}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <Badge className="font-mono">
                                      {step.clause}
                                    </Badge>
                                  </div>
                                  <p className="mt-1 text-sm text-muted-foreground">
                                    {step.description}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
