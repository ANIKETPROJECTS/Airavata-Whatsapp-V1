import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Route, Switch, Router as WouterRouter, Redirect } from 'wouter';
import { Shell } from './components/layout/Shell';
import { routes } from './routes';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={() => <Redirect to="/dashboard" />} />
        {routes.map(r => (
          <Route key={r.path} path={r.path} component={r.component} />
        ))}
        <Route component={() => (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-xl text-gray-500">404 - Page Not Found</h2>
          </div>
        )} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
