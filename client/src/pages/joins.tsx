import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GitMerge, Table2, ArrowRight, Info } from "lucide-react";

type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL";

interface TableRow {
  id: number;
  [key: string]: unknown;
}

const leftTableData: TableRow[] = [
  { id: 1, name: "Alice", department_id: 1 },
  { id: 2, name: "Bob", department_id: 2 },
  { id: 3, name: "Carol", department_id: 1 },
  { id: 4, name: "David", department_id: null },
  { id: 5, name: "Emma", department_id: 3 },
];

const rightTableData: TableRow[] = [
  { id: 1, department: "Engineering" },
  { id: 2, department: "Marketing" },
  { id: 4, department: "Sales" },
];

const joinDescriptions: Record<JoinType, { title: string; description: string; color: string }> = {
  INNER: {
    title: "INNER JOIN",
    description: "Returns only rows that have matching values in both tables. Think of it as the intersection.",
    color: "bg-blue-500",
  },
  LEFT: {
    title: "LEFT JOIN",
    description: "Returns all rows from the left table, and matched rows from the right. Unmatched right rows show as NULL.",
    color: "bg-green-500",
  },
  RIGHT: {
    title: "RIGHT JOIN",
    description: "Returns all rows from the right table, and matched rows from the left. Unmatched left rows show as NULL.",
    color: "bg-purple-500",
  },
  FULL: {
    title: "FULL OUTER JOIN",
    description: "Returns all rows from both tables. Unmatched rows from either side show as NULL.",
    color: "bg-orange-500",
  },
};

export default function JoinPlayground() {
  const [joinType, setJoinType] = useState<JoinType>("INNER");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  const { resultRows, matchedLeft, matchedRight, unmatchedLeft, unmatchedRight } = useMemo(() => {
    const result: TableRow[] = [];
    const matchedL = new Set<number>();
    const matchedR = new Set<number>();

    leftTableData.forEach((left, leftIdx) => {
      const match = rightTableData.find((r) => r.id === left.department_id);
      if (match) {
        matchedL.add(leftIdx);
        matchedR.add(rightTableData.indexOf(match));
        result.push({
          id: result.length + 1,
          employee: left.name,
          dept_id: left.department_id,
          department: match.department,
        });
      } else if (joinType === "LEFT" || joinType === "FULL") {
        result.push({
          id: result.length + 1,
          employee: left.name,
          dept_id: left.department_id,
          department: null,
        });
      }
    });

    if (joinType === "RIGHT" || joinType === "FULL") {
      rightTableData.forEach((right, rightIdx) => {
        if (!matchedR.has(rightIdx)) {
          result.push({
            id: result.length + 1,
            employee: null,
            dept_id: right.id,
            department: right.department,
          });
        }
      });
    }

    const unmatchedL = leftTableData
      .map((_, idx) => idx)
      .filter((idx) => !matchedL.has(idx));
    const unmatchedR = rightTableData
      .map((_, idx) => idx)
      .filter((idx) => !matchedR.has(idx));

    return {
      resultRows: result,
      matchedLeft: Array.from(matchedL),
      matchedRight: Array.from(matchedR),
      unmatchedLeft: unmatchedL,
      unmatchedRight: unmatchedR,
    };
  }, [joinType]);

  const getRowStyle = (
    tableType: "left" | "right",
    rowIndex: number
  ): string => {
    const isMatched =
      tableType === "left"
        ? matchedLeft.includes(rowIndex)
        : matchedRight.includes(rowIndex);
    const isUnmatched =
      tableType === "left"
        ? unmatchedLeft.includes(rowIndex)
        : unmatchedRight.includes(rowIndex);

    if (isMatched) {
      return "bg-green-100 dark:bg-green-900/30 border-l-4 border-l-green-500";
    }
    if (isUnmatched) {
      if (
        (tableType === "left" && (joinType === "LEFT" || joinType === "FULL")) ||
        (tableType === "right" && (joinType === "RIGHT" || joinType === "FULL"))
      ) {
        return "bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-l-yellow-500";
      }
      return "bg-red-50 dark:bg-red-900/20 border-l-4 border-l-red-400 opacity-50";
    }
    return "";
  };

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
              <GitMerge className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Visual JOIN Playground</h1>
          </div>
          <p className="text-muted-foreground">
            See exactly how different JOINs combine data. Toggle between types and watch the rows highlight.
          </p>
        </motion.div>

        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {joinDescriptions[joinType].description}
                </span>
              </div>
              <Tabs value={joinType} onValueChange={(v) => setJoinType(v as JoinType)}>
                <TabsList>
                  <TabsTrigger value="INNER" data-testid="tab-inner">INNER</TabsTrigger>
                  <TabsTrigger value="LEFT" data-testid="tab-left">LEFT</TabsTrigger>
                  <TabsTrigger value="RIGHT" data-testid="tab-right">RIGHT</TabsTrigger>
                  <TabsTrigger value="FULL" data-testid="tab-full">FULL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Table2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">employees</CardTitle>
                  <Badge variant="secondary" size="sm">Left Table</Badge>
                </div>
                <CardDescription>
                  Contains employee records with department references
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-2 text-left font-semibold">id</th>
                        <th className="px-3 py-2 text-left font-semibold">name</th>
                        <th className="px-3 py-2 text-left font-semibold">dept_id</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {leftTableData.map((row, index) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`border-t transition-all duration-300 ${getRowStyle("left", index)}`}
                            onMouseEnter={() => setHoveredRow(row.department_id as number)}
                            onMouseLeave={() => setHoveredRow(null)}
                          >
                            <td className="px-3 py-2 font-mono">{row.id}</td>
                            <td className="px-3 py-2">{row.name as string}</td>
                            <td className="px-3 py-2 font-mono">
                              {row.department_id === null ? (
                                <span className="text-muted-foreground italic">NULL</span>
                              ) : (
                                row.department_id as number
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="text-center">
              <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${joinDescriptions[joinType].color}`}>
                <GitMerge className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold">{joinDescriptions[joinType].title}</h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-[200px] mx-auto">
                ON employees.dept_id = departments.id
              </p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Table2 className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">departments</CardTitle>
                  <Badge variant="secondary" size="sm">Right Table</Badge>
                </div>
                <CardDescription>
                  Contains department records
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-3 py-2 text-left font-semibold">id</th>
                        <th className="px-3 py-2 text-left font-semibold">department</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence>
                        {rightTableData.map((row, index) => (
                          <motion.tr
                            key={row.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={`border-t transition-all duration-300 ${getRowStyle("right", index)} ${
                              hoveredRow === row.id ? "ring-2 ring-primary ring-inset" : ""
                            }`}
                          >
                            <td className="px-3 py-2 font-mono">{row.id}</td>
                            <td className="px-3 py-2">{row.department as string}</td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Result Set</CardTitle>
                  <CardDescription>
                    {resultRows.length} rows returned from {joinDescriptions[joinType].title}
                  </CardDescription>
                </div>
                <Badge className={`${joinDescriptions[joinType].color} text-white border-none`}>
                  {resultRows.length} rows
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[300px]">
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="px-4 py-3 text-left font-semibold">employee</th>
                        <th className="px-4 py-3 text-left font-semibold">dept_id</th>
                        <th className="px-4 py-3 text-left font-semibold">department</th>
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {resultRows.map((row, index) => (
                          <motion.tr
                            key={`${row.employee}-${row.department}-${index}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-t"
                          >
                            <td className="px-4 py-3">
                              {row.employee === null ? (
                                <span className="text-muted-foreground italic">NULL</span>
                              ) : (
                                row.employee as string
                              )}
                            </td>
                            <td className="px-4 py-3 font-mono">
                              {row.dept_id === null ? (
                                <span className="text-muted-foreground italic">NULL</span>
                              ) : (
                                row.dept_id as number
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {row.department === null ? (
                                <span className="text-muted-foreground italic">NULL</span>
                              ) : (
                                row.department as string
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Card className="bg-muted/30">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-l-4 border-l-green-500 bg-green-100 dark:bg-green-900/30" />
                  <span>Matched rows (included in result)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-l-4 border-l-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" />
                  <span>Unmatched but included (with NULL)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded border-l-4 border-l-red-400 bg-red-50 opacity-50 dark:bg-red-900/20" />
                  <span>Excluded from result</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
