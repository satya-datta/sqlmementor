import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  Code,
  BarChart3,
  Layers,
  Lock,
  CheckCircle2,
  Circle,
  Play,
  Clock,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import type { LearningPath, Lesson } from "@shared/schema";

const icons: Record<string, any> = {
  BookOpen,
  BarChart3,
  Code,
  Layers,
};

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

export default function Learn() {
  const { data: learningPaths, isLoading: isLoadingPaths } = useQuery<LearningPath[]>({
    queryKey: ["/api/learning-paths"],
  });

  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);

  // Set initial selected path when data loads
  useEffect(() => {
    if (learningPaths && learningPaths.length > 0 && !selectedPathId) {
      setSelectedPathId(learningPaths[0].id);
    }
  }, [learningPaths, selectedPathId]);

  const { data: lessons, isLoading: isLoadingLessons } = useQuery<Lesson[]>({
    queryKey: [`/api/learning-paths/${selectedPathId}/lessons`],
    enabled: !!selectedPathId,
  });

  const selectedPath = learningPaths?.find(p => p.id === selectedPathId);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "concept":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "practice":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "challenge":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getIcon = (iconName: string) => {
    const Icon = icons[iconName] || Database;
    return <Icon className="h-6 w-6 text-primary" />;
  };

  const getSelectedIcon = (iconName: string) => {
    const Icon = icons[iconName] || Database;
    return <Icon className="h-7 w-7 text-primary-foreground" />;
  };

  if (isLoadingPaths) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Learning Paths</h1>
          <p className="text-muted-foreground">
            Choose your journey. Each path is designed to build your skills progressively.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial="initial"
            animate="animate"
            variants={stagger}
            className="space-y-4 lg:col-span-1"
          >
            {learningPaths?.map((path) => (
              <motion.div key={path.id} variants={fadeInUp}>
                <Card
                  className={`cursor-pointer transition-all duration-200 ${selectedPathId === path.id
                      ? "border-primary ring-1 ring-primary"
                      : "hover:border-primary/50"
                    }`}
                  onClick={() => setSelectedPathId(path.id)}
                  data-testid={`card-path-${path.id}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        {getIcon(path.icon)}
                      </div>
                      <Badge variant="secondary" size="sm" className="shrink-0">
                        {path.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 text-lg">{path.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="mb-3">
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          0/{path.totalLessons}
                        </span>
                      </div>
                      <Progress
                        value={0}
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{path.totalLessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{path.estimatedHours}h</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {selectedPath && (
            <motion.div
              key={selectedPath.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden">
                <CardHeader className="border-b bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                      {getSelectedIcon(selectedPath.icon)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{selectedPath.title}</CardTitle>
                      <CardDescription>{selectedPath.description}</CardDescription>
                    </div>
                    <Button data-testid="button-continue-path">
                      <Play className="mr-2 h-4 w-4" />
                      Continue
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {isLoadingLessons ? (
                      <div className="p-8 text-center text-muted-foreground">Loading lessons...</div>
                    ) : (
                      lessons?.map((lesson, index) => (
                        <motion.div
                          key={lesson.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
                          data-testid={`lesson-${lesson.id}`}
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-muted bg-background">
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium truncate">{lesson.title}</span>
                              <Badge
                                variant="secondary"
                                size="sm"
                                className={`${getTypeColor(lesson.type)} shrink-0`}
                              >
                                {getTypeLabel(lesson.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {lesson.description}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-4">
                            <span className="text-sm text-muted-foreground">15 min</span>
                            <Button size="icon" variant="ghost">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
