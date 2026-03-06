import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import styles from './Navbar.module.css';

const PAGE_TITLES = {
    '/dashboard': 'Dashboard',
    '/jobs': 'Job Board',
    '/jobs/saved': 'Saved Jobs',
    '/jobs/applied': 'Applied Jobs',
    '/insights': 'Market Insights',
    '/skill-gap': 'Skill Gap Analysis',
    '/ai-coach': 'AI Coach',
    '/recommendations': 'AI Recommendations',
    '/big-opps': 'Big Opportunities',
    '/profile': 'Profile',
};

/**
 * Configures the primary interactive application header accommodating contextual global search,
 * user identity state drops, and real-time notification streams.
 * 
 * @component
 * @param {Object} props - Mapping parameters.
 * @param {boolean} props.sidebarCollapsed - Spatial boolean indicating if the left navigation pane is contracted.
 * @returns {JSX.Element} Fluid global header.
 */
export default function Navbar({ sidebarCollapsed }) {
    const { user } = useAuth();
    const location = useLocation();
    const [search, setSearch] = useState('');
    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notifs, setNotifs] = useState([]);

    useEffect(() => {
        api.notifications.list()
            .then(res => {
                const data = res?.data;
                if (Array.isArray(data)) setNotifs(data);
            })
            .catch(() => { });
    }, []);

    const unreadCount = notifs.filter(n => !n.isRead).length;

    /**
     * Commits all active unread notification objects to a resolved "read" status dynamically communicating
     * this state mutation back to the backend service.
     */
    const markAllRead = async () => {
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
        try { await api.notifications.markAllRead(); } catch { }
    };

    const title = PAGE_TITLES[location.pathname] || 'JobFor';

    return (
        <header
            className={styles.navbar}
            style={{ left: sidebarCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)' }}
        >
            <div className={styles.pageTitle}>
                <span className={styles.titleText}>{title}</span>
                <span className={styles.subtitle}>Welcome back, {user?.name?.split(' ')[0]} 👋</span>
            </div>

            <div className={styles.searchWrap}>
                <span className="material-icons-round">search</span>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search jobs, skills, companies…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <button className={styles.clearSearch} onClick={() => setSearch('')}>
                        <span className="material-icons-round">close</span>
                    </button>
                )}
            </div>

            <div className={styles.actions}>
                <div className={styles.dropdownWrap}>
                    <button
                        className={styles.iconBtn}
                        onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
                        aria-label="Notifications"
                    >
                        <span className="material-icons-round">notifications</span>
                        {unreadCount > 0 && (
                            <span className={styles.notifBadge}>{unreadCount}</span>
                        )}
                    </button>
                    {notifOpen && (
                        <div className={styles.dropdown}>
                            <div className={styles.dropdownHeader}>
                                <span>Notifications</span>
                                {unreadCount > 0 && (
                                    <button className={styles.markAll} onClick={markAllRead}>
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            {notifs.length === 0 && (
                                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#888', fontSize: '0.85rem' }}>
                                    No notifications yet
                                </div>
                            )}
                            {notifs.map((n) => (
                                <div key={n.id} className={`${styles.notifItem} ${!n.isRead ? styles.unread : ''}`}>
                                    <span className={`material-icons-round ${styles.notifIcon}`}>
                                        {n.type === 'JOB_ALERT' ? 'work' :
                                            n.type === 'APPLICATION_UPDATE' ? 'send' :
                                                n.type === 'AI_RECOMMENDATION' ? 'smart_toy' : 'notifications'}
                                    </span>
                                    <div>
                                        <p>{n.message}</p>
                                        <span>{new Date(n.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.dropdownWrap}>
                    <button
                        className={styles.avatarBtn}
                        onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
                    >
                        <div className={styles.avatar}>{user?.avatar || 'U'}</div>
                    </button>
                    {profileOpen && (
                        <div className={`${styles.dropdown} ${styles.profileDropdown}`}>
                            <div className={styles.dropdownProfile}>
                                <div className={styles.avatarLg}>{user?.avatar}</div>
                                <div>
                                    <p className={styles.dpName}>{user?.name}</p>
                                    <p className={styles.dpRole}>{user?.role}</p>
                                </div>
                            </div>
                            <div className={styles.dropdownDivider} />
                            <a href="/profile" className={styles.dropdownItem}>
                                <span className="material-icons-round">manage_accounts</span> My Profile
                            </a>
                            <a href="/settings" className={styles.dropdownItem}>
                                <span className="material-icons-round">settings</span> Settings
                            </a>
                            <div className={styles.dropdownDivider} />
                            <button className={`${styles.dropdownItem} ${styles.logoutItem}`}>
                                <span className="material-icons-round">logout</span> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
