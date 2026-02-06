import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FileProvider } from "@/lib/file-context";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import AdminDashboard from "./pages/AdminDashboard";
import ActivityPage from "./pages/ActivityPage";
import FileAccessPage from "./pages/FileAccessPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <FileProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/file/:fileId" element={<FileAccessPage />} />
            <Route
              path="/"
              element={
                <DashboardLayout>
                  <Index />
                </DashboardLayout>
              }
            />
            <Route
              path="/admin"
              element={
                <DashboardLayout>
                  <AdminDashboard />
                </DashboardLayout>
              }
            />
            <Route
              path="/activity"
              element={
                <DashboardLayout>
                  <ActivityPage />
                </DashboardLayout>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
