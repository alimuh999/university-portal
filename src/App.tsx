import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Complaints from "./pages/Complaints";
import Clearance from "./pages/Clearance";
import Courses from "./pages/Courses";
import Marksheet from "./pages/Marksheet";
import ExamForm from "./pages/ExamForm";
import AdmitCard from "./pages/AdmitCard";
import Timetable from "./pages/Timetable";
import LeaveRequest from "./pages/LeaveRequest";
import GatePass from "./pages/GatePass";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { student } = useAuth();
  if (!student) return <Redirect to="/login" />;
  return (
    <Layout>
      <Component />
    </Layout>
  );
}

function PublicRoute({ component: Component }: { component: React.ComponentType }) {
  const { student } = useAuth();
  if (student) return <Redirect to="/dashboard" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/login">
        <PublicRoute component={Login} />
      </Route>
      <Route path="/register">
        <PublicRoute component={Register} />
      </Route>
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route path="/complaints">
        <ProtectedRoute component={Complaints} />
      </Route>
      <Route path="/clearance">
        <ProtectedRoute component={Clearance} />
      </Route>
      <Route path="/courses">
        <ProtectedRoute component={Courses} />
      </Route>
      <Route path="/marksheet">
        <ProtectedRoute component={Marksheet} />
      </Route>
      <Route path="/exam-form">
        <ProtectedRoute component={ExamForm} />
      </Route>
      <Route path="/admit-card">
        <ProtectedRoute component={AdmitCard} />
      </Route>
      <Route path="/timetable">
        <ProtectedRoute component={Timetable} />
      </Route>
      <Route path="/leave">
        <ProtectedRoute component={LeaveRequest} />
      </Route>
      <Route path="/gate-pass">
        <ProtectedRoute component={GatePass} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
