import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Trash2,
  Table2,
  Key,
  Link2,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  ChevronRight,
  Database,
} from "lucide-react";
import type { TableColumn, TableDefinition, SchemaValidationResult, SchemaError, SchemaWarning } from "@shared/schema";

const dataTypes = [
  "INTEGER",
  "BIGINT",
  "SERIAL",
  "VARCHAR(255)",
  "TEXT",
  "BOOLEAN",
  "DATE",
  "TIMESTAMP",
  "DECIMAL(10,2)",
  "JSON",
];

const initialTables: TableDefinition[] = [
  {
    name: "users",
    columns: [
      { name: "id", type: "SERIAL", isPrimaryKey: true, isForeignKey: false, isNullable: false },
      { name: "email", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: "name", type: "VARCHAR(255)", isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: "created_at", type: "TIMESTAMP", isPrimaryKey: false, isForeignKey: false, isNullable: false },
    ],
  },
];

function validateSchema(tables: TableDefinition[]): SchemaValidationResult {
  const errors: SchemaError[] = [];
  const warnings: SchemaWarning[] = [];

  tables.forEach((table) => {
    const hasPK = table.columns.some((c) => c.isPrimaryKey);
    if (!hasPK) {
      errors.push({
        type: "missing_pk",
        table: table.name,
        message: `Table "${table.name}" has no primary key`,
        suggestion: "Add a primary key column (usually 'id') to uniquely identify each row.",
      });
    }

    table.columns.forEach((col) => {
      if (col.isForeignKey && !col.references) {
        errors.push({
          type: "invalid_fk",
          table: table.name,
          message: `Foreign key "${col.name}" has no reference defined`,
          suggestion: "Specify which table and column this foreign key references.",
        });
      }

      if (col.name.toLowerCase() === "email" && col.type !== "VARCHAR(255)") {
        warnings.push({
          type: "type_choice",
          table: table.name,
          column: col.name,
          message: `Consider using VARCHAR(255) for email fields`,
          suggestion: "Emails have a maximum length of 254 characters, VARCHAR(255) is standard.",
        });
      }

      if (col.name.includes(" ")) {
        warnings.push({
          type: "naming",
          table: table.name,
          column: col.name,
          message: `Column name contains spaces`,
          suggestion: "Use snake_case for column names (e.g., 'user_email' instead of 'user email').",
        });
      }
    });

    if (table.name.includes(" ")) {
      warnings.push({
        type: "naming",
        table: table.name,
        message: `Table name contains spaces`,
        suggestion: "Use snake_case for table names (e.g., 'user_orders' instead of 'user orders').",
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

export default function SchemaDesigner() {
  const [tables, setTables] = useState<TableDefinition[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<string | null>(tables[0]?.name || null);
  const [newTableName, setNewTableName] = useState("");
  const [validation, setValidation] = useState<SchemaValidationResult | null>(null);

  const currentTable = tables.find((t) => t.name === selectedTable);

  const addTable = useCallback(() => {
    if (!newTableName.trim()) return;
    const name = newTableName.trim().toLowerCase().replace(/\s+/g, "_");
    if (tables.some((t) => t.name === name)) return;

    setTables([
      ...tables,
      {
        name,
        columns: [
          { name: "id", type: "SERIAL", isPrimaryKey: true, isForeignKey: false, isNullable: false },
        ],
      },
    ]);
    setSelectedTable(name);
    setNewTableName("");
  }, [newTableName, tables]);

  const deleteTable = useCallback((tableName: string) => {
    setTables(tables.filter((t) => t.name !== tableName));
    if (selectedTable === tableName) {
      setSelectedTable(tables[0]?.name || null);
    }
  }, [tables, selectedTable]);

  const addColumn = useCallback(() => {
    if (!currentTable) return;
    setTables(
      tables.map((t) =>
        t.name === currentTable.name
          ? {
            ...t,
            columns: [
              ...t.columns,
              {
                name: `column_${t.columns.length + 1}`,
                type: "VARCHAR(255)",
                isPrimaryKey: false,
                isForeignKey: false,
                isNullable: true,
              },
            ],
          }
          : t
      )
    );
  }, [currentTable, tables]);

  const updateColumn = useCallback(
    (columnIndex: number, updates: Partial<TableColumn>) => {
      if (!currentTable) return;
      setTables(
        tables.map((t) =>
          t.name === currentTable.name
            ? {
              ...t,
              columns: t.columns.map((c, i) =>
                i === columnIndex ? { ...c, ...updates } : c
              ),
            }
            : t
        )
      );
    },
    [currentTable, tables]
  );

  const deleteColumn = useCallback(
    (columnIndex: number) => {
      if (!currentTable) return;
      setTables(
        tables.map((t) =>
          t.name === currentTable.name
            ? {
              ...t,
              columns: t.columns.filter((_, i) => i !== columnIndex),
            }
            : t
        )
      );
    },
    [currentTable, tables]
  );

  const handleValidate = useCallback(async () => {
    try {
      const response = await fetch('/api/schema/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables }),
      });

      const data = await response.json();
      setValidation(data);
    } catch (err) {
      // Fallback to local validation if API fails
      setValidation(validateSchema(tables));
    }
  }, [tables]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Schema Designer</h1>
          </div>
          <p className="text-muted-foreground">
            Design your database schema visually. Add tables, define columns, and validate your design.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tables</CardTitle>
                <CardDescription>Click a table to edit its columns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-2">
                  <Input
                    placeholder="New table name"
                    value={newTableName}
                    onChange={(e) => setNewTableName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTable()}
                    data-testid="input-new-table"
                  />
                  <Button size="icon" onClick={addTable} data-testid="button-add-table">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <ScrollArea className="h-[300px]">
                  <div className="space-y-2">
                    {tables.map((table) => (
                      <motion.div
                        key={table.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group flex items-center justify-between rounded-lg border p-3 transition-all cursor-pointer ${selectedTable === table.name
                            ? "border-primary bg-primary/5"
                            : "hover:border-primary/50"
                          }`}
                        onClick={() => setSelectedTable(table.name)}
                        data-testid={`table-${table.name}`}
                      >
                        <div className="flex items-center gap-2">
                          <Table2 className="h-4 w-4 text-primary" />
                          <span className="font-mono text-sm font-medium">{table.name}</span>
                          <Badge variant="secondary">
                            {table.columns.length} cols
                          </Badge>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteTable(table.name);
                          }}
                          data-testid={`delete-table-${table.name}`}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>

                <Button
                  className="mt-4 w-full"
                  onClick={handleValidate}
                  data-testid="button-validate"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Validate Schema
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4 lg:col-span-3"
          >
            {currentTable ? (
              <Card>
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Table2 className="h-5 w-5 text-primary" />
                      <CardTitle className="font-mono">{currentTable.name}</CardTitle>
                    </div>
                    <Button onClick={addColumn} data-testid="button-add-column">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Column
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {currentTable.columns.map((column, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="grid grid-cols-12 gap-4 p-4 items-center"
                        data-testid={`column-${index}`}
                      >
                        <div className="col-span-3">
                          <Label className="sr-only">Column Name</Label>
                          <Input
                            value={column.name}
                            onChange={(e) =>
                              updateColumn(index, { name: e.target.value })
                            }
                            className="font-mono"
                            data-testid={`input-column-name-${index}`}
                          />
                        </div>
                        <div className="col-span-3">
                          <Label className="sr-only">Data Type</Label>
                          <Select
                            value={column.type}
                            onValueChange={(value) =>
                              updateColumn(index, { type: value })
                            }
                          >
                            <SelectTrigger data-testid={`select-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {dataTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Switch
                            checked={column.isPrimaryKey}
                            onCheckedChange={(checked) =>
                              updateColumn(index, { isPrimaryKey: checked })
                            }
                            data-testid={`switch-pk-${index}`}
                          />
                          <div className="flex items-center gap-1">
                            <Key className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs">PK</span>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <Switch
                            checked={column.isForeignKey}
                            onCheckedChange={(checked) =>
                              updateColumn(index, { isForeignKey: checked })
                            }
                            data-testid={`switch-fk-${index}`}
                          />
                          <div className="flex items-center gap-1">
                            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="text-xs">FK</span>
                          </div>
                        </div>
                        <div className="col-span-1 flex items-center gap-2">
                          <Switch
                            checked={column.isNullable}
                            onCheckedChange={(checked) =>
                              updateColumn(index, { isNullable: checked })
                            }
                            data-testid={`switch-nullable-${index}`}
                          />
                          <span className="text-xs text-muted-foreground">Null</span>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteColumn(index)}
                            disabled={currentTable.columns.length === 1}
                            data-testid={`delete-column-${index}`}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex h-[400px] items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Table2 className="mx-auto mb-4 h-12 w-12 opacity-50" />
                  <p className="text-lg font-medium">No table selected</p>
                  <p className="text-sm">Create a new table or select one from the list</p>
                </div>
              </Card>
            )}

            <AnimatePresence>
              {validation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {validation.isValid && validation.warnings.length === 0 ? (
                    <Card className="border-l-4 border-l-success">
                      <CardContent className="flex items-center gap-4 py-4">
                        <CheckCircle2 className="h-8 w-8 text-success" />
                        <div>
                          <h3 className="font-semibold">Schema looks great!</h3>
                          <p className="text-sm text-muted-foreground">
                            No issues found. Your database design follows best practices.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {validation.errors.map((error, i) => (
                        <Card key={`error-${i}`} className="border-l-4 border-l-destructive">
                          <CardContent className="py-4">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="mt-0.5 h-5 w-5 text-destructive shrink-0" />
                              <div>
                                <h4 className="font-semibold">{error.message}</h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {error.suggestion}
                                </p>
                                <Badge variant="secondary" className="mt-2">
                                  Table: {error.table}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {validation.warnings.map((warning, i) => (
                        <Card key={`warning-${i}`} className="border-l-4 border-l-yellow-500">
                          <CardContent className="py-4">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="mt-0.5 h-5 w-5 text-yellow-500 shrink-0" />
                              <div>
                                <h4 className="font-semibold">{warning.message}</h4>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {warning.suggestion}
                                </p>
                                <div className="mt-2 flex gap-2">
                                  <Badge variant="secondary">
                                    Table: {warning.table}
                                  </Badge>
                                  {warning.column && (
                                    <Badge variant="outline">
                                      Column: {warning.column}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
