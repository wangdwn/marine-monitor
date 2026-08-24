import { Routes, Route, Navigate } from "react-router";
import Layout from "./components/Layout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import MapPage from "./pages/MapPage";
import ReportsPage from "./pages/ReportsPage";
import PoliciesPage from "./pages/PoliciesPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import SurveyPage from "./pages/SurveyPage";
import PlanningPage from "./pages/PlanningPage";
import SafetyPage from "./pages/SafetyPage";
import CollectorPage from "./pages/CollectorPage";
import FundingPage from "./pages/FundingPage";
import AnnouncePage from "./pages/AnnouncePage";
import AutomationPage from "./pages/AutomationPage";
import ExternalPage from "./pages/ExternalPage";

export default function App() {
  return (
    <Routes>
      {/* 整合方案：取消登录界面，/login 直接重定向首页，全站公开可用 */}
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route
        path="*"
        element={
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/survey" element={<SurveyPage />} />
              <Route path="/planning" element={<PlanningPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/reports/:id" element={<ReportsPage />} />
              <Route path="/policies" element={<PoliciesPage />} />
              <Route path="/policies/:id" element={<PoliciesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/collector" element={<CollectorPage />} />
              <Route path="/funding" element={<FundingPage />} />
              <Route path="/announce" element={<AnnouncePage />} />
              <Route path="/automation" element={<AutomationPage />} />
              <Route path="/external" element={<ExternalPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        }
      />
    </Routes>
  );
}
