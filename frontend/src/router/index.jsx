import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../context/ToastContext';
import AppLayout from '../components/layout/AppLayout';

// ─── Critical path: loaded immediately ───────────────────────
import LandingPage from '../features/auth/LandingPage';
import LoginPage from '../features/auth/LoginPage';
import RegisterPage from '../features/auth/RegisterPage';
import DashboardPage from '../features/dashboard/DashboardPage';

// ─── Lazy: loaded only when first visited ────────────────────
const JobBoardPage = lazy(() => import('../features/jobs/JobBoardPage'));
const SavedJobsPage = lazy(() => import('../features/jobs/SavedJobsPage'));
const AppliedJobsPage = lazy(() => import('../features/jobs/AppliedJobsPage'));
const MarketInsightsPage = lazy(() => import('../features/insights/MarketInsightsPage'));
const SkillGapPage = lazy(() => import('../features/skillgap/SkillGapPage'));
const AICoachPage = lazy(() => import('../features/ai/AICoachPage'));
const AIRecommendationsPage = lazy(() => import('../features/ai/AIRecommendationsPage'));
const BigOppsPage = lazy(() => import('../features/bigopps/BigOppsPage'));
const ProfilePage = lazy(() => import('../features/profile/ProfilePage'));
const NotFoundPage = lazy(() => import('../features/NotFoundPage'));

// ─── Suspense fallback spinner ───────────────────────────────
function PageSpinner() {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', minHeight: '60vh', color: '#888', gap: 12,
            flexDirection: 'column',
        }}>
            <div style={{
                width: 36, height: 36, borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: '#2b8cee',
                animation: 'spin 0.7s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <Suspense fallback={<PageSpinner />}>
                        <Routes>
                            {/* Public routes — eager loaded */}
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/auth/login" element={<LoginPage />} />
                            <Route path="/auth/register" element={<RegisterPage />} />

                            {/* Protected app routes with sidebar + navbar layout */}
                            <Route element={<AppLayout />}>
                                <Route path="/dashboard" element={<DashboardPage />} />
                                <Route path="/jobs" element={<JobBoardPage />} />
                                <Route path="/jobs/saved" element={<SavedJobsPage />} />
                                <Route path="/jobs/applied" element={<AppliedJobsPage />} />
                                <Route path="/insights" element={<MarketInsightsPage />} />
                                <Route path="/skill-gap" element={<SkillGapPage />} />
                                <Route path="/ai-coach" element={<AICoachPage />} />
                                <Route path="/recommendations" element={<AIRecommendationsPage />} />
                                <Route path="/big-opps" element={<BigOppsPage />} />
                                <Route path="/profile" element={<ProfilePage />} />
                            </Route>

                            {/* 404 */}
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </Suspense>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}
