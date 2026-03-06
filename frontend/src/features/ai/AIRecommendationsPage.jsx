import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import styles from './AIRecommendationsPage.module.css';

/**
 * Formats numerical minimum and maximum salary boundaries into localized human-readable Indian Rupee string representations.
 * 
 * @param {number|null} min - Lower boundary annual compensation value.
 * @param {number|null} max - Upper boundary annual compensation value.
 * @returns {string} Formatted salary string (e.g., "₹12L – ₹15L") or a fallback message if undefined.
 */
function fmtSalary(min, max) {
    if (!min && !max) return 'Salary not listed';
    const f = n => `₹${Math.round(n / 100000)}L`;
    if (min && max) return `${f(min)} – ${f(max)}`;
    return min ? `From ${f(min)}` : `Up to ${f(max)}`;
}

/**
 * Renders a visually distinct placeholder boundary indicating the absence of query results or personalized models.
 * 
 * @param {Object} props - Component property bindings.
 * @param {string} props.icon - Material icon identifier representing the empty dataset graphically.
 * @param {string} props.title - Primary header string defining the absent parameter state.
 * @param {string} props.sub - Secondary instructional string providing context or actionable resolutions.
 * @returns {JSX.Element}
 */
function EmptyState({ icon, title, sub }) {
    return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            <span className="material-icons-round" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>{icon}</span>
            <p style={{ fontWeight: 600, color: '#ccc' }}>{title}</p>
            <p style={{ fontSize: '0.85rem' }}>{sub}</p>
        </div>
    );
}

/**
 * Encapsulates network failure states yielding interactive retry mechanisms bypassing standard application crash behaviors.
 * 
 * @param {Object} props - Encoded interaction parameters.
 * @param {Function} props.onRetry - Executable callback triggering procedural data refetch attempts.
 * @returns {JSX.Element}
 */
function ErrorState({ onRetry }) {
    return (
        <div style={{
            textAlign: 'center', padding: '2rem', background: 'rgba(255,107,107,0.05)',
            border: '1px solid rgba(255,107,107,0.2)', borderRadius: 12
        }}>
            <span className="material-icons-round" style={{ fontSize: 36, color: '#ff6b6b', display: 'block', marginBottom: 8 }}>wifi_off</span>
            <p style={{ color: '#ff6b6b', fontWeight: 600 }}>Couldn't load recommendations</p>
            <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 12 }}>Make sure backend is running at localhost:3001</p>
            <button onClick={onRetry} style={{
                padding: '6px 16px', borderRadius: 8, border: '1px solid rgba(255,107,107,0.4)',
                background: 'transparent', color: '#ff6b6b', cursor: 'pointer'
            }}>Retry</button>
        </div>
    );
}

/**
 * Orchestrates highly personalized algorithmic job match surfaces retrieving specialized machine learning outputs synchronously.
 * Merges predictive vectors including explicitly derived "Top Picks" alongside global generalized "Trending" application data.
 * 
 * @component
 * @returns {JSX.Element} The rendered recommendation dashboard interface.
 */
export default function AIRecommendationsPage() {
    const [jobs, setJobs] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const [recRes, trendRes] = await Promise.allSettled([
                api.jobs.recommendations(),
                api.jobs.trending(),
            ]);
            if (recRes.status === 'fulfilled') {
                const data = recRes.value?.data;
                setJobs(Array.isArray(data) ? data.slice(0, 3) : []);
            } else setError(true);

            if (trendRes.status === 'fulfilled') {
                const data = trendRes.value?.data;
                setTrending(Array.isArray(data) ? data.slice(0, 3) : []);
            }
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    return (
        <div className={styles.page}>
            <div className={styles.badge}>
                <span className="material-icons-round">stars</span> AI RECOMMENDATIONS
            </div>

            <h2 className={styles.sectionLabel}>TOP PICKS FOR YOU</h2>

            {loading && (
                <div className={styles.topPicksGrid}>
                    {[1, 2, 3].map(i => (
                        <div key={i} className={styles.pickCard} style={{ opacity: 0.4 }}>
                            <div style={{ height: 160, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />
                        </div>
                    ))}
                </div>
            )}

            {!loading && error && <ErrorState onRetry={fetchData} />}

            {!loading && !error && jobs.length === 0 && (
                <EmptyState icon="work_off" title="No recommendations yet"
                    sub="Complete your profile with skills and experience to get personalised matches." />
            )}

            {!loading && !error && jobs.length > 0 && (
                <div className={styles.topPicksGrid}>
                    {jobs.map((job, idx) => (
                        <div key={job.id} className={`${styles.pickCard} ${idx === 0 ? styles.featured : ''}`}>
                            {idx === 0 && <span className={styles.featuredTag}>⭐ Best Match</span>}
                            <div className={styles.pickTop}>
                                <div className={styles.pickLogo}>{job.companyLogo || job.company?.[0] || '?'}</div>
                                <div className={styles.pickInfo}>
                                    <h3>{job.title}</h3>
                                    <p>{job.company}</p>
                                    <span className={styles.salary}>{fmtSalary(job.salaryMin, job.salaryMax)}</span>
                                </div>
                                <div className={styles.matchBig}>{job.isRemote ? '🌐' : '📍'}</div>
                            </div>
                            <div className={styles.reasons}>
                                {(job.skills || '').split(' ').filter(Boolean).slice(0, 3).map(skill => (
                                    <span key={skill} className={styles.reason}>
                                        <span className="material-icons-round">check_circle</span>{skill}
                                    </span>
                                ))}
                            </div>
                            <Link to="/jobs" className={styles.applyBtn}>View Job</Link>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.twoCol}>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        <span className="material-icons-round">new_releases</span> Trending Jobs
                    </h2>
                    {trending.length === 0 ? (
                        <EmptyState icon="trending_up" title="No trending jobs" sub="Check back soon." />
                    ) : (
                        trending.map(j => (
                            <div key={j.id} className={styles.simpleRow}>
                                <div>
                                    <h3>{j.title}</h3>
                                    <p>{j.company} · {j.location}</p>
                                </div>
                                <span className={styles.matchSm}>{j.isRemote ? '🌐' : '📍'}</span>
                                <Link to="/jobs" className={styles.quickBtn}>View</Link>
                            </div>
                        ))
                    )}
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>
                        <span className="material-icons-round">history</span> Recently Posted
                    </h2>
                    {trending.slice(0, 2).map(j => (
                        <div key={j.id} className={styles.missedRow}>
                            <div>
                                <h3>{j.title}</h3>
                                <p>{j.company} · {new Date(j.postedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                            </div>
                            <Link to="/jobs" className={styles.alertBtn}>View</Link>
                        </div>
                    ))}
                    {trending.length === 0 && (
                        <EmptyState icon="work" title="No recent jobs" sub="Check the job board." />
                    )}
                </section>
            </div>
        </div>
    );
}
