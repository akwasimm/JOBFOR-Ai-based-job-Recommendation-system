import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api';
import styles from './BigOppsPage.module.css';

/**
 * Formats explicitly bounded annual salary constraints isolating standardized localized string outputs.
 * 
 * @param {number|null} min - Lower numerical threshold of expected compensation.
 * @param {number|null} max - Upper numerical threshold of expected compensation.
 * @returns {string|null} Resolved graphical string representing salary tiers logically.
 */
function fmtSalary(min, max) {
    if (!min && !max) return null;
    const f = n => `₹${Math.round(n / 100000)}L`;
    if (min && max) return `${f(min)} – ${f(max)}`;
    return min ? `From ${f(min)}` : `Up to ${f(max)}`;
}

/**
 * Instantiates pulsing structural placeholders temporarily masking uninitialized content zones
 * maintaining strict DOM heights before asynchronous data flows resolve natively.
 * 
 * @returns {JSX.Element} Structural skeleton blocks.
 */
function Skeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{ height: 72, borderRadius: 10, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
            ))}
        </div>
    );
}

/**
 * Propagates visual escalation pathways capturing asynchronous rejection instances offering dedicated functional recovery buttons.
 * 
 * @param {Object} props - Input handler mapping object.
 * @param {Function} props.onRetry - Invoked routine driving subsequent secondary network fetches.
 * @returns {JSX.Element} Recovery interface.
 */
function ErrorMsg({ onRetry }) {
    return (
        <div style={{
            textAlign: 'center', padding: '1.5rem', background: 'rgba(255,107,107,0.05)',
            border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10
        }}>
            <span className="material-icons-round" style={{ color: '#ff6b6b', display: 'block', marginBottom: 6 }}>wifi_off</span>
            <p style={{ color: '#ff6b6b' }}>Couldn't load jobs</p>
            <button onClick={onRetry} style={{
                marginTop: 8, padding: '4px 14px', borderRadius: 6, border: '1px solid rgba(255,107,107,0.4)',
                background: 'transparent', color: '#ff6b6b', cursor: 'pointer'
            }}>Retry</button>
        </div>
    );
}

/**
 * Top-tier employment aggregator component categorizing specialized high-demand trajectories grouping outputs functionally
 * isolating remote vectors vs localized high-density mass hiring surges dynamically.
 * 
 * @component
 * @returns {JSX.Element} Specialized routing node featuring filtered "hot" trending lists natively.
 */
export default function BigOppsPage() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.jobs.trending();
            const data = res?.data;
            setTrending(Array.isArray(data) ? data : []);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    // Separate into remote (high-opportunity) and on-site
    const remote = trending.filter(j => j.isRemote);
    const onsite = trending.filter(j => !j.isRemote);
    // Mass hiring = companies with most roles posted (simulate from trending)
    const massHiring = [...trending].slice(0, 3);

    return (
        <div className={styles.page}>
            <div className={styles.badge}>
                <span className="material-icons-round">rocket_launch</span> 🚀 BIG OPPORTUNITIES
            </div>

            {/* Mass Hiring / Hot Jobs */}
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    <span className="material-icons-round">group_add</span> HOT JOBS NOW
                </h2>
                {loading ? <Skeleton /> : error ? <ErrorMsg onRetry={fetchData} /> : (
                    massHiring.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>No trending jobs at the moment.</p>
                    ) : (
                        <div className={styles.massGrid}>
                            {massHiring.map(j => (
                                <div key={j.id} className={styles.massCard}>
                                    <div className={styles.massLogo}>{j.companyLogo || j.company?.[0] || '?'}</div>
                                    <div className={styles.massInfo}>
                                        <h3>{j.company}</h3>
                                        <p>{j.title}</p>
                                    </div>
                                    <div className={styles.massRight}>
                                        <span className={styles.roles}>{fmtSalary(j.salaryMin, j.salaryMax) || 'Competitive'}</span>
                                        <span className={`${styles.urgency} ${styles.green}`}>
                                            {j.isRemote ? '🌐 REMOTE' : '📍 ON-SITE'}
                                        </span>
                                    </div>
                                    <Link to="/jobs" className={styles.applyBtn}>View All</Link>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </section>

            {/* Remote Jobs */}
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    <span className="material-icons-round">public</span> REMOTE OPPORTUNITIES
                </h2>
                {loading ? <Skeleton /> : error ? <ErrorMsg onRetry={fetchData} /> : (
                    remote.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>No remote jobs right now.</p>
                    ) : (
                        <div className={styles.faangGrid}>
                            {remote.map(j => (
                                <div key={j.id} className={styles.faangCard}>
                                    <div className={styles.faangLogo}>{j.companyLogo || j.company?.[0] || '?'}</div>
                                    <div className={styles.faangInfo}>
                                        <h3>{j.company}</h3>
                                        <p>{j.title}</p>
                                        <span className={styles.salary}>{fmtSalary(j.salaryMin, j.salaryMax) || 'Competitive'}</span>
                                    </div>
                                    <div className={styles.faangRight}>
                                        <span className={styles.growth}>🌐 Remote</span>
                                        <Link to="/jobs" className={styles.applyBtnSm}>Apply</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </section>

            {/* On-Site Jobs */}
            <section className={styles.card}>
                <h2 className={styles.sectionTitle}>
                    <span className="material-icons-round">location_city</span> ON-SITE ROLES
                </h2>
                {loading ? <Skeleton /> : error ? <ErrorMsg onRetry={fetchData} /> : (
                    onsite.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center', padding: '1.5rem' }}>No on-site jobs right now.</p>
                    ) : (
                        <div className={styles.campusGrid}>
                            {onsite.map(j => (
                                <div key={j.id} className={styles.campusCard}>
                                    <span className="material-icons-round">location_on</span>
                                    <div>
                                        <h3>{j.title}</h3>
                                        <p>{j.company} · {j.location}</p>
                                        <span>{fmtSalary(j.salaryMin, j.salaryMax) || 'Competitive'}</span>
                                    </div>
                                    <Link to="/jobs" className={styles.registerBtn}>View</Link>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </section>
        </div>
    );
}
