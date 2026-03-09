import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import styles from './AppLayout.module.css';

/**
 * Orchestrates unified structural blueprints assembling core navigational panes and aligning active viewport scopes.
 * Handles responsive sidebar toggling and global authenticated routing constraints.
 * 
 * @component
 * @returns {JSX.Element} Composed application frame.
 */
export default function AppLayout() {
    const { user, initializing } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    if (initializing) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(43,140,238,0.2)', borderTopColor: '#2b8cee', animation: 'spin 0.7s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    if (!user) return <Navigate to="/auth/login" replace />;

    return (
        <div className={styles.layout}>
            <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />
            <div
                className={styles.main}
                style={{ marginLeft: collapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
            >
                <Navbar sidebarCollapsed={collapsed} />
                <main className={styles.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
