import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Lessons from "./pages/Lessons";
import LessonRead from "./pages/LessonRead";
import Quiz from "./pages/Quiz";
import QuizDone from "./pages/QuizDone";
import Challenges from "./pages/Challenges";
import ChallengeScreen from "./pages/ChallengeScreen";
import PiggyBank from "./pages/PiggyBank";
import Badges from "./pages/Badges";
import ParentGate from "./pages/ParentGate";
import ParentArea from "./pages/ParentArea";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/lessons"} component={Lessons} />
      <Route path={"/lesson-read"} component={LessonRead} />
      <Route path={"/quiz"} component={Quiz} />
      <Route path={"/quiz-done"} component={QuizDone} />
      <Route path={"/challenges"} component={Challenges} />
      <Route path={"/challenge-screen"} component={ChallengeScreen} />
      <Route path={"/piggy"} component={PiggyBank} />
      <Route path={"/badges"} component={Badges} />
      <Route path={"/parent-gate"} component={ParentGate} />
      <Route path={"/parent-area"} component={ParentArea} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
