import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QuestionnaireProvider } from "./contexts/QuestionnaireContext";
import Home from "./pages/Home";
import Questionnaire from "./pages/Questionnaire";
import Result from "./pages/Result";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Match from "./pages/Match";
import Login from "./pages/Login";

// Admin pages - completely independent from frontend
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUserList from "./pages/admin/UserList";
import AdminUserDetail from "./pages/admin/UserDetail";
import AdminQuestionList from "./pages/admin/QuestionList";
import AdminRecordList from "./pages/admin/RecordList";
import AdminPersonality from "./pages/admin/PersonalityManage";
import AdminMatching from "./pages/admin/MatchingManage";
import AdminSettings from "./pages/admin/Settings";

function Router() {
  return (
    <Switch>
      {/* Frontend routes */}
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/questionnaire" component={Questionnaire} />
      <Route path="/result" component={Result} />
      <Route path="/about" component={About} />
      <Route path="/profile" component={Profile} />
      <Route path="/match" component={Questionnaire} />

      



      {/* Admin routes - independent entry */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={() => <AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/users" component={() => <AdminLayout><AdminUserList /></AdminLayout>} />
      <Route path="/admin/users/:id" component={() => <AdminLayout><AdminUserDetail /></AdminLayout>} />
      <Route path="/admin/questions" component={() => <AdminLayout><AdminQuestionList /></AdminLayout>} />
      <Route path="/admin/records" component={() => <AdminLayout><AdminRecordList /></AdminLayout>} />
      <Route path="/admin/personality" component={() => <AdminLayout><AdminPersonality /></AdminLayout>} />
      <Route path="/admin/matching" component={() => <AdminLayout><AdminMatching /></AdminLayout>} />
      <Route path="/admin/settings" component={() => <AdminLayout><AdminSettings /></AdminLayout>} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <LanguageProvider>
          <QuestionnaireProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </QuestionnaireProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
