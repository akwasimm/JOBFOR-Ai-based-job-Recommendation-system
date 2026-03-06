import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
    { icon: 'dashboard', label: 'Dashboard', to: '/dashboard' },
    { icon: 'work', label: 'Jobs', to: '/jobs' },
    { icon: 'insights', label: 'Insights', to: '/insights' },
    { icon: 'rocket_launch', label: 'Big Opps', to: '/big-opps' },
    { icon: 'bookmark', label: 'Saved', to: '/jobs/saved' },
    { icon: 'task_alt', label: 'Applied', to: '/jobs/applied' },
    { icon: 'smart_toy', label: 'AI Coach', to: '/ai-coach' },
    { icon: 'psychology', label: 'Skill Gap', to: '/skill-gap' },
    { icon: 'stars', label: 'Recommended', to: '/recommendations' },
];

/**
 * Provides persistent navigation vectors natively across major application zones. Handles structural collapses
 * for responsive viewport management while retaining explicit routing anchors securely.
 * 
 * @component
 * @param {Object} props - Component properties.
 * @param {boolean} props.collapsed - Structural indicator driving CSS spatial contractions conditionally.
 * @param {Function} props.onToggle - Event emitter bound to user-initiated expansion/contraction interactions.
 * @returns {JSX.Element} The persistent application sidebar pane.
 */
export default function Sidebar({ collapsed, onToggle }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    /**
     * Evicts established active bindings gracefully ending the user session implicitly destroying tokens.
     */
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
            <div className={styles.logo}>
                <span className={styles.logoDot}>
                    <span className="material-icons-round">work_outline</span>
                </span>
                {!collapsed && <span className={styles.logoText}>JobFor<span className={styles.logoPeriod}>.</span></span>}
            </div>

            <button className={styles.toggleBtn} onClick={onToggle} aria-label="Toggle sidebar">
                <span className="material-icons-round">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
            </button>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <span className={`material-icons-round ${styles.navIcon}`}>{item.icon}</span>
                        {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
                        {!collapsed && item.badge && (
                            <span className={styles.badge}>{item.badge}</span>
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className={styles.bottom}>
                <NavLink
                    to="/profile"
                    className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                    title={collapsed ? 'Profile' : undefined}
                >
                    <span className={`material-icons-round ${styles.navIcon}`}>manage_accounts</span>
                    {!collapsed && <span className={styles.navLabel}>Profile</span>}
                </NavLink>

                <div className={styles.userCard}>
                    <div className={styles.avatar}>{user?.avatar || 'U'}</div>
                    {!collapsed && (
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>{user?.name}</span>
                            <span className={styles.userRole}>{user?.role}</span>
                        </div>
                    )}
                    {!collapsed && (
                        <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
                            <span className="material-icons-round">logout</span>
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
}
