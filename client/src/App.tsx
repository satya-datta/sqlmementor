import { Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/navbar";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Learn from "@/pages/learn";
import Playground from "@/pages/playground";
import JoinPlayground from "@/pages/joins";
import SchemaDesigner from "@/pages/schema-designer";
import Scenarios from "@/pages/scenarios";
import LessonView from "@/pages/lesson";
import { Auth } from "@/pages/auth";
import { Account } from "@/pages/account";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/learn" element={<Learn />} />
      <Route path="/learn/path/:pathId/lesson/:lessonId" element={<LessonView />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/joins" element={<JoinPlayground />} />
      <Route path="/schema-designer" element={<SchemaDesigner />} />
      <Route path="/scenarios" element={<Scenarios />} />
      <Route path="/auth/:pathname" element={<Auth />} />
      <Route path="/account/:pathname" element={<Account />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Navbar />
          <Router />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
