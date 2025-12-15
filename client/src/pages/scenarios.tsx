import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ShoppingCart,
  Building2,
  GraduationCap,
  Landmark,
  Users,
  Play,
  ArrowRight,
  Table2,
  CheckCircle2,
  Circle,
  Lock,
} from "lucide-react";
import type { Scenario as DBScenario, Exercise as DBExercise } from "@shared/schema";

// Map icon strings to components
const icons: Record<string, any> = {
  ShoppingCart,
  Building2,
  GraduationCap,
  Landmark,
  Users,
};

// Extended interface for frontend display
interface DisplayScenario extends Omit<DBScenario, "icon"> {
  icon: any;
  tables: string[];
  exercisesCount: number;
  completedCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Scenarios() {
  const { data: dbScenarios, isLoading: isLoadingScenarios } = useQuery<DBScenario[]>({
    queryKey: ["/api/scenarios"],
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "exercises">("overview");

  const { data: exercises, isLoading: isLoadingExercises } = useQuery<DBExercise[]>({
    queryKey: [`/api/scenarios/${selectedScenarioId}/exercises`],
    enabled: !!selectedScenarioId,
  });

  // Transform DB scenarios to frontend display format
  const scenarios: DisplayScenario[] = dbScenarios?.map(s => {
    // Parse tables from schema if possible
    let tables: string[] = [];
    if (s.schema && typeof s.schema === 'object' && !Array.isArray(s.schema)) {
      tables = Object.keys(s.schema as object);
    }

    return {
      ...s,
      icon: icons[s.icon] || ShoppingCart,
      tables: tables,
      exercisesCount: 0, // Backend doesn't provide this yet
      completedCount: 0,
      difficulty: "Intermediate", // Defaulting as it's missing in DB
    };
  }) || [];

  const selectedScenario = scenarios.find(s => s.id === selectedScenarioId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Hard":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoadingScenarios) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Industry Scenarios</h1>
          <p className="text-muted-foreground">
            Practice SQL with real-world databases. Each scenario includes a complete schema and progressive exercises.
          </p>
        </motion.div>

        {!selectedScenario ? (
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {scenarios.map((scenario) => (
              <motion.div key={scenario.id} variants={fadeInUp}>
                <Card
                  className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  onClick={() => setSelectedScenarioId(scenario.id)}
                  data-testid={`card-scenario-${scenario.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <scenario.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <Badge variant="secondary">{scenario.difficulty}</Badge>
                    </div>
                    <CardTitle className="mt-3">{scenario.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {scenario.completedCount}/{scenario.exercisesCount || '?'}
                        </span>
                      </div>
                      <Progress
                        value={0}
                        className="h-2"
                      />
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                      {scenario.tables.slice(0, 4).map((table) => (
                        <Badge key={table} variant="outline" size="sm" className="font-mono">
                          {table}
                        </Badge>
                      ))}
                      {scenario.tables.length > 4 && (
                        <Badge variant="outline" size="sm">
                          +{scenario.tables.length - 4}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      <span>Start scenario</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={selectedScenario.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => setSelectedScenarioId(null)}
              data-testid="button-back"
            >
              <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
              Back to Scenarios
            </Button>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                      <selectedScenario.icon className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <CardTitle className="mt-4">{selectedScenario.title}</CardTitle>
                    <CardDescription>{selectedScenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="mb-2 text-sm font-medium">Tables in this scenario</div>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedScenario.tables.length > 0 ? (
                          selectedScenario.tables.map((table) => (
                            <Badge key={table} variant="secondary" size="sm" className="font-mono">
                              <Table2 className="mr-1 h-3 w-3" />
                              {table}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm text-muted-foreground">No tables defined</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Overall Progress</span>
                        <span className="font-medium">
                          {selectedScenario.completedCount}/{exercises?.length || 0}
                        </span>
                      </div>
                      <Progress
                        value={0}
                        className="h-2"
                      />
                    </div>
                    <Link href="/playground">
                      <Button className="w-full" data-testid="button-start-practice">
                        <Play className="mr-2 h-4 w-4" />
                        Start Practicing
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-2">
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "overview" | "exercises")}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Schema Overview</TabsTrigger>
                    <TabsTrigger value="exercises">Exercises</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <Card>
                      <CardHeader>
                        <CardTitle>Entity Relationship Diagram</CardTitle>
                        <CardDescription>
                          Visual representation of the database schema
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-lg border bg-muted/30 p-8">
                          {selectedScenario.tables.length > 0 ? (
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              {selectedScenario.tables.map((table, index) => (
                                <motion.div
                                  key={table}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="rounded-lg border bg-card p-4 shadow-sm"
                                >
                                  <div className="mb-2 flex items-center gap-2">
                                    <Table2 className="h-4 w-4 text-primary" />
                                    <span className="font-mono font-semibold">{table}</span>
                                  </div>
                                  <div className="space-y-1 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary" size="sm">PK</Badge>
                                      <span className="font-mono">id</span>
                                    </div>
                                    <div className="font-mono">...</div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground">Schema visualization not available</div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="exercises">
                    <Card>
                      <CardHeader>
                        <CardTitle>Practice Exercises</CardTitle>
                        <CardDescription>
                          Complete these exercises to master the schema
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <ScrollArea className="max-h-[500px]">
                          <div className="divide-y">
                            {isLoadingExercises ? (
                              <div className="p-8 text-center text-muted-foreground">Loading exercises...</div>
                            ) : exercises && exercises.length > 0 ? (
                              exercises.map((exercise, index) => (
                                <motion.div
                                  key={exercise.id}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`flex items-center gap-4 p-4 hover:bg-muted/50`}
                                  data-testid={`exercise-${exercise.id}`}
                                >
                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background">
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-medium">{exercise.title}</span>
                                      <Badge
                                        variant="secondary"
                                        size="sm"
                                        className={getDifficultyColor(exercise.difficulty)}
                                      >
                                        {exercise.difficulty}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">
                                      {exercise.description}
                                    </p>
                                  </div>
                                  <Link href="/playground">
                                    <Button size="sm" variant="outline">
                                      <Play className="mr-2 h-3.5 w-3.5" />
                                      Start
                                    </Button>
                                  </Link>
                                </motion.div>
                              ))
                            ) : (
                              <div className="p-8 text-center text-muted-foreground">No exercises available</div>
                            )}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
