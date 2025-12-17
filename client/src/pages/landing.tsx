import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Database,
  Code,
  GitMerge,
  Lightbulb,
  BookOpen,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Play,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Guided Learning Paths",
    description: "Structured journeys from beginner to advanced, with clear milestones and immediate practice.",
  },
  {
    icon: Database,
    title: "Schema-First Learning",
    description: "Design databases visually before writing queries. Understand the 'why' behind every table.",
  },
  {
    icon: GitMerge,
    title: "Visual JOIN Playground",
    description: "See exactly how JOINs work with interactive tables, highlighted connections, and live results.",
  },
  {
    icon: Lightbulb,
    title: "Friendly Error Explainer",
    description: "No cryptic messages. Get clear explanations of what went wrong and how to fix it.",
  },
  {
    icon: Layers,
    title: "Query Execution Visualizer",
    description: "Watch your query execute step-by-step. Understand FROM to SELECT in visual order.",
  },
  {
    icon: Code,
    title: "Real Industry Scenarios",
    description: "Practice with E-commerce, Healthcare, Banking, and more. Build portfolio-worthy projects.",
  },
];

const learningPaths = [
  { title: "Beginner SQL", lessons: 40, hours: 8, level: "Beginner" },
  { title: "SQL for Data Analysts", lessons: 98, hours: 12, level: "Intermediate" },
  { title: "SQL for Backend Devs", lessons: 20, hours: 10, level: "Intermediate" },
  { title: "Database Design", lessons: 20, hours: 8, level: "All Levels" },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Landing() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pb-20 pt-16 md:pb-32 md:pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute left-1/2 top-0 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-sm font-medium shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Learn SQL the visual way</span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Master SQL &<br />
              <span className="text-primary">Database Design</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl">
              A calm, clear mentor that finally makes databases make sense. Learn through visual exploration,
              real-world problems, and gentle guidance — not stress and competition.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/learn/login">
                <Button size="lg" className="gap-2 text-base" data-testid="button-start-learning">
                  <Play className="h-4 w-4" />
                  Start Learning Free
                </Button>
              </Link>
              <Link to="/playground">
                <Button size="lg" variant="outline" className="gap-2 text-base" data-testid="button-try-playground">
                  Try SQL Playground
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              Everything you need to master databases
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-muted-foreground"
            >
              Our platform combines visual learning, interactive exercises, and real-world scenarios
              to help you truly understand SQL and database design.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.h2
              variants={fadeInUp}
              className="mb-4 text-3xl font-bold tracking-tight md:text-4xl"
            >
              Choose your learning path
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="mx-auto max-w-2xl text-muted-foreground"
            >
              Structured courses designed for different goals. Start where you are, progress at your pace.
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {learningPaths.map((path) => (
              <motion.div key={path.title} variants={fadeInUp}>
                <Link to="/learn">
                  <Card className="group h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25">
                        <Database className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg">{path.title}</CardTitle>
                      <CardDescription>{path.level}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{path.lessons} lessons</span>
                        <span>{path.hours} hours</span>
                      </div>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        <span>Start learning</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="border-t bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid items-center gap-12 lg:grid-cols-2"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl">
                Why learn with SQL Mentor?
              </h2>
              <ul className="space-y-4">
                {[
                  "Visual-first approach that shows, not just tells",
                  "Design databases before writing queries",
                  "Supportive error messages, never judgmental",
                  "Real industry scenarios, not toy examples",
                  "Step-by-step query execution visualization",
                  "Progress tracking without competition stress",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeInUp} className="relative">
              <div className="rounded-2xl border bg-card p-6 shadow-xl">
                <div className="mb-4 flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <pre className="overflow-x-auto font-mono text-sm">
                  <code className="text-muted-foreground">
                    <span className="text-primary">SELECT</span> customers.name, orders.total{"\n"}
                    <span className="text-primary">FROM</span> customers{"\n"}
                    <span className="text-primary">LEFT JOIN</span> orders{"\n"}
                    {"  "}<span className="text-primary">ON</span> customers.id = orders.customer_id{"\n"}
                    <span className="text-primary">WHERE</span> orders.total {">"} 100{"\n"}
                    <span className="text-primary">ORDER BY</span> orders.total <span className="text-primary">DESC</span>;
                  </code>
                </pre>
              </div>
              <div className="absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-2xl bg-primary/20" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
              Ready to master databases?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Start your journey today. No account needed to begin learning.
            </p>
            <Link to="/auth/login">
              <Button size="lg" className="gap-2 text-base" data-testid="button-get-started">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            <span>SQL Mentor</span>
          </div>
          <p className="mt-2">Learn SQL the way databases are actually built.</p>
        </div>
      </footer>
    </div>
  );
}
