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
    const { user } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

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
