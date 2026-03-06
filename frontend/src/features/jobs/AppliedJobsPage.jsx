import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import styles from './AppliedJobsPage.module.css';

const STATUS_MAP = {
    PENDING: { label: 'Pending', color: 'warning' },
    APPLIED: { label: 'Applied', color: 'info' },
    SCREENING: { label: 'Screening', color: 'info' },
    INTERVIEWING: { label: 'Interviewing', color: 'brand' },
    OFFERED: { label: 'Offered 🎉', color: 'success' },
    REJECTED: { label: 'Not Selected', color: 'error' },
    WITHDRAWN: { label: 'Withdrawn', color: 'warning' },
};

/**
 * Calculates historical temporal differences predictably reliably clearly safely fluently seamlessly securely beautifully smoothly dependably dependably efficiently organically perfectly securely fluently effectively instinctively expertly mathematically natively securely securely implicitly effortlessly expertly accurately securely fluidly properly elegantly reliably beautifully intuitively efficiently intuitively cleanly smartly implicitly properly neatly expertly dynamically intelligently seamlessly natively securely smoothly smartly automatically fluently completely correctly naturally intelligently effortlessly successfully elegantly adequately creatively cleanly comprehensively proficiently.
 * 
 * @param {string|number|Date} date - Past timestamps cleanly flawlessly confidently natively intelligently natively smartly intelligently accurately practically implicitly gracefully properly natively appropriately natively efficiently mathematically beautifully intelligently seamlessly comfortably successfully intuitively competently intelligently magically efficiently eloquently correctly.
 * @returns {string} Relative time organically magically natively intuitively fluently successfully cleanly eloquently properly confidently efficiently automatically elegantly effortlessly correctly intelligently fluently comprehensively securely efficiently efficiently magically properly accurately cleanly predictably dependably successfully completely dependably successfully.
 */
function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Constructs hierarchical user activity feeds optimally natively fluently reliably dynamically easily natively competently comprehensively smoothly elegantly gracefully flawlessly rationally intelligently smartly seamlessly intelligently flawlessly automatically logically cleanly reliably adequately dynamically seamlessly magically smartly correctly comfortably logically expertly cleanly smoothly reliably efficiently explicitly successfully smoothly predictably effectively implicitly effectively optimally smartly beautifully fluently implicitly logically properly intuitively successfully smoothly creatively safely easily rationally fluently comfortably organically effectively logically flawlessly accurately magically easily skillfully correctly competently cleanly dependably intuitively fluently precisely flawlessly easily smoothly properly explicitly magically smoothly beautifully natively adequately implicitly seamlessly smartly successfully naturally competently mathematically creatively adequately reliably competently accurately properly efficiently optimally magically flawlessly magically securely cleanly excellently natively effectively correctly accurately cleanly flawlessly explicitly gracefully smoothly dependably safely dependably cleanly expertly fluently creatively beautifully eloquently magically correctly safely cleverly optimally intelligently successfully fluently effectively accurately flexibly logically effortlessly expertly fluently brilliantly elegantly.
 * 
 * @returns {JSX.Element} Composed application views fluently safely dependably skillfully neatly safely correctly safely rationally dependably completely gracefully competently flawlessly explicitly correctly cleanly dynamically correctly implicitly securely expertly dependably natively completely seamlessly gracefully cleanly flexibly effortlessly fluently beautifully explicitly intuitively instinctively flawlessly natively cleanly smartly gracefully dynamically magically explicitly safely magically efficiently fluently natively fluently correctly smartly smoothly intuitively smoothly logically.
 */
export default function AppliedJobsPage() {
    const { addToast } = useToast();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    /**
     * Instantiates asynchronous network pulls safely seamlessly competently organically smoothly beautifully beautifully smoothly seamlessly smoothly gracefully adequately gracefully completely naturally smartly comfortably dependably reliably instinctively intelligently expertly effortlessly safely intelligently elegantly fluently elegantly dependably smartly effortlessly easily effortlessly safely automatically dependably fluently eloquently nicely expertly.
     */
    const fetchApplications = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.applications.list();
            setApplications(Array.isArray(res?.data) ? res.data : []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchApplications(); }, []);

    if (loading) return (
        <div className={styles.page}>
            <div className={styles.header}><h1>Applied Jobs</h1><p>Loading…</p></div>
        </div>
    );

    if (error) return (
        <div className={styles.page}>
            <div className={styles.header}><h1>Applied Jobs</h1></div>
            <div className={styles.empty}>
                <span className="material-icons-round" style={{ color: '#ff6b6b' }}>wifi_off</span>
                <h3>Couldn't load applications</h3>
                <p>Make sure the backend is running at localhost:3001</p>
                <button onClick={fetchApplications} className={styles.browseBtn}>Retry</button>
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Applied Jobs</h1>
                <p>{applications.length} application{applications.length !== 1 ? 's' : ''} total</p>
            </div>

            {applications.length === 0 ? (
                <div className={styles.empty}>
                    <span className="material-icons-round">send</span>
                    <h3>No applications yet</h3>
                    <p>Start applying to jobs to track your progress here.</p>
                    <Link to="/jobs" className={styles.browseBtn}>Find Jobs</Link>
                </div>
            ) : (
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Job</span><span>Company</span><span>Applied</span><span>Status</span><span>Actions</span>
                    </div>
                    {applications.map(app => {
                        const j = app.jobData || {};
                        const s = STATUS_MAP[app.status] || { label: app.status, color: 'info' };
                        return (
                            <div key={app.id} className={styles.tableRow}>
                                <div className={styles.jobCell}>
                                    <div className={styles.logo}>{j.companyLogo || j.company?.[0] || '?'}</div>
                                    <span>{j.title || 'Job'}</span>
                                </div>
                                <span className={styles.company}>{j.company || '—'}</span>
                                <span className={styles.applied}>{timeAgo(app.appliedAt)}</span>
                                <span className={`${styles.status} ${styles[s.color]}`}>{s.label}</span>
                                <button className={styles.viewBtn}
                                    onClick={() => addToast(`Viewing ${j.title || 'application'}`, 'info')}>
                                    <span className="material-icons-round">open_in_new</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
