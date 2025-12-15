import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/learn" component={Learn} />
      <Route path="/playground" component={Playground} />
      <Route path="/joins" component={JoinPlayground} />
      <Route path="/schema-designer" component={SchemaDesigner} />
      <Route path="/scenarios" component={Scenarios} />
      <Route component={NotFound} />
    </Switch>
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
