import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import type { Lesson, LearningPath } from "@shared/schema";
import { motion } from "framer-motion";

export default function LessonView() {
    const { pathId, lessonId } = useParams();

    const { data: path } = useQuery<LearningPath>({
        queryKey: [`/api/learning-paths/${pathId}`],
        enabled: !!pathId,
    });

    const { data: lessons } = useQuery<Lesson[]>({
        queryKey: [`/api/learning-paths/${pathId}/lessons`],
        enabled: !!pathId,
    });

    const currentLesson = lessons?.find((l) => l.id === lessonId);
    const nextLesson = lessons?.find((l) => l.orderIndex === (currentLesson?.orderIndex || 0) + 1);

    if (!currentLesson || !path) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
                <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8 flex items-center gap-4">
                    <Link to="/learn">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Path
                        </Button>
                    </Link>
                    <div className="h-6 w-px bg-border" />
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">{path.title}</span>
                        <span className="font-semibold text-sm">{currentLesson.title}</span>
                    </div>
                </div>
            </header>

            <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 grid lg:grid-cols-[1fr_300px] gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="prose prose-slate dark:prose-invert max-w-none">
                        <h1>{currentLesson.title}</h1>
                        <p className="lead">{currentLesson.description}</p>
                        <ReactMarkdown>{currentLesson.content}</ReactMarkdown>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                        <Button variant="outline" disabled>
                            Previous Lesson
                        </Button>
                        {nextLesson ? (
                            <Link to={`/learn/path/${pathId}/lesson/${nextLesson.id}`}>
                                <Button className="gap-2">
                                    Next: {nextLesson.title}
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Button className="gap-2" variant="secondary">
                                Complete Path
                                <CheckCircle2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </motion.div>

                <aside className="hidden lg:block space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Path Syllabus</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ScrollArea className="h-[calc(100vh-250px)]">
                                <div className="divide-y">
                                    {lessons?.map((lesson) => {
                                        const isCurrent = lesson.id === lessonId;
                                        const isCompleted = lesson.orderIndex < (currentLesson.orderIndex || 0);

                                        return (
                                            <Link key={lesson.id} to={`/learn/path/${pathId}/lesson/${lesson.id}`}>
                                                <div
                                                    className={`p-4 flex items-start gap-3 text-sm transition-colors hover:bg-muted/50 cursor-pointer ${isCurrent ? "bg-primary/5" : ""
                                                        }`}
                                                >
                                                    {isCompleted ? (
                                                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                                    ) : isCurrent ? (
                                                        <Circle className="h-4 w-4 text-primary shrink-0 mt-0.5 fill-primary/20" />
                                                    ) : (
                                                        <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                                    )}
                                                    <div className="space-y-1">
                                                        <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>
                                                            {lesson.title}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground line-clamp-1">
                                                            {lesson.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </aside>
            </main>
        </div>
    );
}
