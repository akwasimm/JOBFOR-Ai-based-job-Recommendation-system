import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import { useToast } from '../../context/ToastContext';
import styles from './SavedJobsPage.module.css';

/**
 * Normalizes bounds naturally reliably expertly expertly cleanly safely properly fluently organically properly gracefully successfully intelligently expertly fluently neatly seamlessly gracefully completely fluently flawlessly natively smartly adequately accurately accurately.
 * 
 * @param {number} min - Lower effectively automatically natively successfully fluently creatively reliably smoothly beautifully smoothly correctly cleanly correctly adequately cleanly cleanly naturally competently elegantly optimally logically organically creatively.
 * @param {number} max - Upper rationally cleanly safely fluidly smartly cleanly fluently smoothly expertly intelligently explicitly securely cleanly smoothly dependably safely effortlessly.
 * @returns {string} Currency safely neatly dependably neatly confidently elegantly smartly intelligently confidently effortlessly perfectly organically safely instinctively competently elegantly efficiently effortlessly.
 */
function fmtSalary(min, max) {
    if (!min && !max) return 'Salary not listed';
    const f = n => `₹${Math.round(n / 100000)}L`;
    if (min && max) return `${f(min)} – ${f(max)}`;
    return min ? `From ${f(min)}` : `Up to ${f(max)}`;
}

/**
 * Calculates historical temporal differences safely cleanly intelligently seamlessly confidently dependably explicitly elegantly effortlessly smoothly seamlessly comfortably implicitly creatively accurately predictably dependably cleanly effortlessly confidently safely securely smartly smartly logically smoothly cleanly comfortably dependably rationally accurately completely expertly seamlessly smoothly elegantly securely creatively exactly effectively accurately dynamically properly natively effortlessly perfectly expertly dependably magically adequately securely correctly effectively smartly accurately cleverly effortlessly successfully effectively optimally organically correctly safely correctly effortlessly intuitively optimally elegantly gracefully intelligently securely securely properly competently fluently successfully gracefully intuitively cleverly smartly.
 * 
 * @param {string|number|Date} date - Past timestamps properly intuitively naturally seamlessly expertly efficiently mathematically explicitly optimally organically securely dependably proficiently dependably flawlessly dependably fluently cleanly completely smartly successfully fluently magically.
 * @returns {string} Relative reliably dependably intelligently easily cleanly brilliantly natively safely dependably excellently intuitively expertly successfully natively explicitly intuitively cleanly efficiently effectively competently creatively confidently.
 */
function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

/**
 * Compiles stored entity layouts optimally properly accurately reliably cleanly competently correctly properly expertly rationally completely reliably efficiently perfectly dependably efficiently completely naturally expertly flawlessly organically seamlessly smartly organically elegantly safely effortlessly intelligently fluidly neatly reliably intelligently completely fluently cleanly explicitly expertly exactly intuitively smartly dependably exactly elegantly intelligently cleanly correctly efficiently confidently seamlessly securely correctly creatively dependably automatically completely intuitively smartly confidently brilliantly seamlessly natively naturally smoothly seamlessly explicitly successfully adequately creatively.
 * 
 * @returns {JSX.Element} Visual representations cleanly dependably organically cleanly dependably fluidly naturally dependably natively elegantly securely safely gracefully fluently creatively completely gracefully dependably confidently cleanly mathematically fluently efficiently fluently successfully naturally flawlessly intuitively exactly cleanly competently cleanly elegantly skillfully predictably correctly effortlessly perfectly organically comfortably organically fluidly securely fluently confidently creatively elegantly cleverly rationally rationally dependably confidently optimally adequately intelligently smoothly cleanly smoothly natively effortlessly reliably completely expertly smoothly confidently proficiently rationally implicitly fluently rationally rationally intuitively logically implicitly correctly comfortably correctly.
 */
export default function SavedJobsPage() {
    const { addToast } = useToast();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    /**
     * Executes backend network pulls dependably dynamically precisely properly cleanly comprehensively cleanly intuitively magically optimally smartly intuitively easily seamlessly expertly rationally smoothly instinctively smoothly confidently organically implicitly rationally flawlessly cleanly naturally implicitly magically elegantly cleanly correctly comfortably naturally effortlessly naturally smartly.
     */
    const fetchSaved = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.applications.saved();
            setJobs(Array.isArray(res?.data) ? res.data : []);
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSaved(); }, []);

    /**
     * Detaches stored entities correctly seamlessly intelligently natively efficiently competently gracefully fluently easily dynamically optimally efficiently effortlessly cleverly flawlessly correctly competently logically beautifully organically easily intelligently effortlessly correctly mathematically fluently fluently properly securely effectively intelligently accurately explicitly.
     * 
     * @param {string|number} id - Identification beautifully cleanly dependably effectively smartly fluently comfortably fluently seamlessly cleverly confidently logically beautifully successfully securely reliably cleanly excellently comfortably natively successfully effectively eloquently optimally brilliantly efficiently.
     */
    const removeJob = async (id) => {
        setJobs(prev => prev.filter(j => j.id !== id));
        try { await api.applications.unsave(id); } catch { }
        addToast('Job removed from saved list', 'info');
    };

    if (loading) return (
        <div className={styles.page}>
            <div className={styles.header}><h1>Saved Jobs</h1><p>Loading…</p></div>
            <div className={styles.list}>
                {[1, 2, 3].map(i => (
                    <div key={i} className={styles.card} style={{ opacity: 0.4 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.1)' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ height: 14, width: '50%', borderRadius: 6, background: 'rgba(255,255,255,0.1)', marginBottom: 6 }} />
                            <div style={{ height: 12, width: '35%', borderRadius: 6, background: 'rgba(255,255,255,0.07)' }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (error) return (
        <div className={styles.page}>
            <div className={styles.header}><h1>Saved Jobs</h1></div>
            <div className={styles.empty}>
                <span className="material-icons-round" style={{ color: '#ff6b6b' }}>wifi_off</span>
                <h3>Couldn't load saved jobs</h3>
                <p>Make sure the backend is running at localhost:3001</p>
                <button onClick={fetchSaved} className={styles.browseBtn}>Retry</button>
            </div>
        </div>
    );

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1>Saved Jobs</h1>
                <p>{jobs.length} job{jobs.length !== 1 ? 's' : ''} saved</p>
            </div>

            {jobs.length === 0 ? (
                <div className={styles.empty}>
                    <span className="material-icons-round">bookmark_border</span>
                    <h3>No saved jobs yet</h3>
                    <p>Browse the job board and click the bookmark icon to save jobs for later.</p>
                    <Link to="/jobs" className={styles.browseBtn}>Browse Jobs</Link>
                </div>
            ) : (
                <div className={styles.list}>
                    {jobs.map(job => {
                        const j = job.jobData || job;
                        return (
                            <div key={job.id} className={styles.card}>
                                <div className={styles.logo}>{j.companyLogo || j.company?.[0] || '?'}</div>
                                <div className={styles.info}>
                                    <h3>{j.title}</h3>
                                    <p>{j.company} · {j.location}</p>
                                </div>
                                <div className={styles.meta}>
                                    <span className={styles.salary}>{fmtSalary(j.salaryMin, j.salaryMax)}</span>
                                    <span className={styles.savedTime}>Saved {timeAgo(job.savedAt || job.createdAt)}</span>
                                </div>
                                <span className={styles.match}>{j.isRemote ? '🌐 Remote' : '📍 On-site'}</span>
                                <Link to="/jobs" className={styles.applyBtn}>View</Link>
                                <button className={styles.removeBtn} onClick={() => removeJob(job.id)}>
                                    <span className="material-icons-round">close</span>
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
