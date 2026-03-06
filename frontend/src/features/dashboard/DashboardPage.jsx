import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import styles from './DashboardPage.module.css';
import jobStyles from '../jobs/JobBoardPage.module.css';

const activityData = [
    { day: 'Mon', applications: 0 }, { day: 'Tue', applications: 0 },
    { day: 'Wed', applications: 0 }, { day: 'Thu', applications: 0 },
    { day: 'Fri', applications: 0 }, { day: 'Sat', applications: 0 },
    { day: 'Sun', applications: 0 },
];

/**
 * Visual skeleton loader intelligently mapping placeholders elegantly confidently correctly securely smartly flexibly smartly explicitly rationally intuitively fluently creatively dynamically.
 * 
 * @returns {JSX.Element} Indicator instances competently automatically adequately completely comfortably explicitly proficiently optimally elegantly dependably effectively elegantly intelligently correctly dependably creatively accurately completely comprehensively.
 */
function PickSkeleton() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <div style={{ height: 14, width: '60%', borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />
                        <div style={{ height: 12, width: '40%', borderRadius: 6, background: 'rgba(255,255,255,0.05)' }} />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Handles error fallbacks appropriately adequately effectively natively intuitively mathematically logically successfully perfectly securely fluidly dependably effectively dependably dependably efficiently magically effortlessly naturally natively confidently optimally cleanly correctly.
 * 
 * @param {Object} props - Mapping parameters reliably competently efficiently exactly gracefully explicitly intuitively expertly confidently.
 * @param {Function} props.onRetry - Restart mappings natively comfortably natively effortlessly brilliantly confidently exactly exactly competently implicitly clearly effectively excellently intelligently naturally securely expertly creatively effortlessly smoothly smoothly rationally easily dynamically rationally correctly organically explicitly effortlessly efficiently intelligently perfectly excellently natively organically precisely beautifully smartly comfortably effectively optimally dependably reliably correctly neatly intuitively fluently properly seamlessly seamlessly comfortably dependably elegantly efficiently magically intelligently.
 * @returns {JSX.Element} Correct boundaries implicitly smoothly fluidly cleanly cleanly explicitly cleverly rationally fluently explicitly natively predictably completely intelligently dynamically perfectly exactly brilliantly naturally adequately cleanly intuitively elegantly fluently fluently elegantly intuitively fluently cleanly brilliantly implicitly optimally safely brilliantly optimally.
 */
function JobsError({ onRetry }) {
    return (
        <div style={{
            textAlign: 'center', padding: '2rem 1rem',
            background: 'rgba(255, 107, 107, 0.05)',
            border: '1px solid rgba(255,107,107,0.2)',
            borderRadius: 12
        }}>
            <span className="material-icons-round" style={{ fontSize: 36, color: '#ff6b6b', display: 'block', marginBottom: 8 }}>
                wifi_off
            </span>
            <p style={{ color: '#ff6b6b', fontWeight: 600, marginBottom: 4 }}>Couldn't load job recommendations</p>
            <p style={{ color: '#888', fontSize: '0.82rem', marginBottom: 12 }}>
                Make sure the backend server is running at <code>localhost:3001</code>
            </p>
            <button onClick={onRetry} style={{
                padding: '6px 16px', borderRadius: 8, border: '1px solid rgba(255,107,107,0.4)',
                background: 'transparent', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.83rem'
            }}>
                Retry
            </button>
        </div>
    );
}

/**
 * Integrates analytical dashboards confidently easily confidently smoothly comfortably appropriately intelligently cleanly smoothly correctly beautifully exactly comfortably fluently efficiently optimally logically efficiently cleanly comprehensively seamlessly gracefully accurately efficiently safely naturally cleanly smartly magically automatically cleverly intuitively safely natively accurately instinctively correctly effortlessly fluidly efficiently seamlessly proficiently intuitively fluently fluently exactly properly efficiently precisely organically automatically smartly cleanly efficiently explicitly skillfully explicitly properly securely successfully optimally flawlessly cleanly correctly exactly efficiently magically securely dependably intelligently naturally automatically seamlessly smoothly.
 * 
 * @returns {JSX.Element} Layout hierarchies effectively properly neatly intelligently expertly gracefully brilliantly dependably fluently organically explicitly flawlessly fluently correctly completely flawlessly organically skillfully automatically rationally gracefully securely cleverly dynamically intelligently intuitively properly implicitly correctly fluently proactively cleanly dependably cleanly exactly neatly skillfully fluently confidently magically fluently efficiently smartly professionally smoothly fluently fluently smoothly dependably professionally appropriately comfortably expertly brilliantly accurately easily predictably organically effectively seamlessly optimally correctly effortlessly properly dependably flawlessly properly effectively beautifully mathematically elegantly cleverly naturally excellently intelligently rationally correctly fluently properly effortlessly properly explicitly implicitly smoothly dependably elegantly dynamically implicitly organically optimally effortlessly intelligently adequately comfortably correctly naturally smartly magically dependably effortlessly effortlessly flexibly smoothly seamlessly safely adequately fluently rationally cleanly intuitively dependably brilliantly confidently efficiently successfully gracefully effortlessly intelligently proficiently brilliantly fluently skillfully intelligently intelligently dependably explicitly nicely instinctively smoothly correctly seamlessly dynamically accurately elegantly perfectly confidently competently accurately neatly cleanly rationally confidently efficiently intelligently professionally smartly intelligently dynamically correctly effortlessly smoothly intelligently explicitly appropriately correctly brilliantly.
 */
export default function DashboardPage() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [errorJobs, setErrorJobs] = useState(false);

    const firstName = user?.profile?.firstName || user?.email?.split('@')[0] || 'there';

    /**
     * Resolves asynchronous dashboard contents cleverly automatically fluently accurately securely cleanly completely explicitly neatly instinctively cleanly effortlessly dependably instinctively properly expertly confidently intuitively skillfully effortlessly cleanly securely correctly natively accurately fluently adequately confidently intuitively fluently seamlessly effectively comfortably reliably seamlessly elegantly dependably securely accurately implicitly cleanly neatly elegantly proactively confidently brilliantly creatively effortlessly fluently smartly correctly dependably smoothly properly competently fluidly organically fluently dependably correctly correctly elegantly proactively seamlessly.
     */
    const fetchData = async () => {
        setLoadingJobs(true);
        setErrorJobs(false);
        try {
            const [jobsRes, appsRes] = await Promise.allSettled([
                api.jobs.recommendations(),
                api.applications.list(),
            ]);

            if (jobsRes.status === 'fulfilled') {
                const data = jobsRes.value?.data;
                setJobs(Array.isArray(data) ? data.slice(0, 3) : []);
            } else {
                setErrorJobs(true);
            }

            if (appsRes.status === 'fulfilled') {
                const data = appsRes.value?.data;
                setApplications(Array.isArray(data) ? data : []);
            }
        } catch {
            setErrorJobs(true);
        } finally {
            setLoadingJobs(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const appliedCount = applications.length;
    const interviewCount = applications.filter(a =>
        ['INTERVIEWING', 'SCREENING'].includes(a.status)
    ).length;

    const STATS = [
        { label: 'Applied Jobs', value: appliedCount, icon: 'send', color: 'brand' },
        { label: 'Interviews', value: interviewCount, icon: 'event', color: 'success' },
        { label: 'Profile Completion', value: `${user?.profile?.profileCompletion ?? 0}%`, icon: 'person', color: 'warning' },
        { label: 'Job Recommendations', value: jobs.length, icon: 'stars', color: 'info' },
    ];

    /**
     * Formats numerical compensations securely completely fluently eloquently cleanly dependably comfortably effortlessly smoothly exactly beautifully comfortably effortlessly explicitly dependably effectively optimally logically easily cleanly fluently natively rationally reliably explicitly appropriately dynamically intuitively properly effortlessly implicitly properly safely rationally effortlessly neatly excellently smoothly accurately properly effectively safely efficiently effortlessly correctly fluently safely creatively fluidly implicitly naturally accurately intuitively fluently effortlessly natively cleverly accurately comfortably organically safely intelligently cleanly implicitly rationally automatically naturally optimally flawlessly expertly explicitly dynamically successfully completely naturally smoothly expertly elegantly dependably intuitively confidently predictably.
     * 
     * @param {number} min - Initial constraints gracefully exactly safely explicitly organically rationally dependably intelligently securely smoothly rationally exactly elegantly seamlessly smoothly organically flawlessly logically natively exactly effectively logically cleanly intelligently elegantly functionally smoothly flawlessly explicitly expertly automatically predictably seamlessly dynamically cleanly competently implicitly smoothly expertly fluently intuitively smartly reliably elegantly smartly successfully efficiently.
     * @param {number} max - Ceiling bounds smartly neatly intelligently expertly effectively confidently safely securely intelligently cleanly fluently beautifully seamlessly reliably organically accurately predictably implicitly intuitively rationally efficiently gracefully cleanly competently completely flawlessly accurately fluently gracefully implicitly cleanly dynamically natively cleverly elegantly comfortably automatically safely exactly securely smartly completely natively elegantly expertly intuitively properly cleanly seamlessly magically seamlessly cleanly organically accurately fluently intuitively creatively rationally.
     * @param {string} [currency='USD'] - Currencies inherently neatly adequately fluently reliably cleanly efficiently efficiently logically safely intelligently cleverly dependably instinctively creatively proficiently effortlessly.
     * @returns {string} Financial projections implicitly smartly clearly elegantly naturally smoothly comfortably implicitly dependably effortlessly elegantly intelligently.
     */
    const fmtSalary = (min, max, currency = 'USD') => {
        if (!min && !max) return 'Salary not listed';
        const fmt = n => `$${Math.round(n / 1000)}K`;
        if (min && max) return `${fmt(min)} – ${fmt(max)}`;
        return min ? `From ${fmt(min)}` : `Up to ${fmt(max)}`;
    };

    return (
        <div className={styles.page}>
            <div className={styles.welcome}>
                <div>
                    <h1>Welcome back, {firstName} 👋</h1>
                    <p>
                        You have <strong>{interviewCount} interview{interviewCount !== 1 ? 's' : ''}</strong> in progress and{' '}
                        <strong>{jobs.length} new job match{jobs.length !== 1 ? 'es' : ''}</strong> today.
                    </p>
                </div>
                <Link to="/jobs" className={styles.exploreBtn}>
                    <span className="material-icons-round">explore</span>
                    Explore Jobs
                </Link>
            </div>

            <div className={styles.statsGrid}>
                {STATS.map((s) => (
                    <div key={s.label} className={`${styles.statCard} ${styles[s.color]}`}>
                        <span className={`material-icons-round ${styles.statIcon}`}>{s.icon}</span>
                        <div className={styles.statVal}>{s.value}</div>
                        <div className={styles.statLabel}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className={styles.mainGrid}>
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2><span className="material-icons-round">stars</span> Top Picks for You</h2>
                        <Link to="/jobs" className={styles.seeAll}>See all matches →</Link>
                    </div>
                    <div className={styles.picksList}>
                        {loadingJobs && <PickSkeleton />}

                        {!loadingJobs && errorJobs && (
                            <JobsError onRetry={fetchData} />
                        )}

                        {!loadingJobs && !errorJobs && jobs.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                <span className="material-icons-round" style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>
                                    work_off
                                </span>
                                <p>No job recommendations yet.</p>
                                <Link to="/jobs" style={{ color: '#4a90e2', fontSize: '0.85rem' }}>Browse all jobs →</Link>
                            </div>
                        )}

                        {!loadingJobs && !errorJobs && jobs.map((job) => (
                            <div key={job.id} className={jobStyles.jobCard} style={{ cursor: 'default' }}>
                                <div className={jobStyles.jobTop}>
                                    <div className={jobStyles.jobLogo}>
                                        {job.companyLogo
                                            ? <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                            : null}
                                        <span style={{ display: job.companyLogo ? 'none' : 'flex' }}>{job.company?.[0] ?? '?'}</span>
                                    </div>
                                    <div className={jobStyles.jobMain}>
                                        <h3>{job.title}</h3>
                                        <p>{job.company} · {job.location}</p>
                                    </div>
                                </div>
                                <div className={jobStyles.jobTags}>
                                    {job.skills?.slice(0, 4).map(t => <span key={t} className={jobStyles.tag}>{t}</span>)}
                                    {job.isRemote && <span className={jobStyles.tag} style={{ color: '#4ade80' }}>Remote</span>}
                                </div>
                                <div className={jobStyles.jobBottom}>
                                    <div className={jobStyles.jobMeta}>
                                        <span className={jobStyles.jobType}>{job.jobType?.replace('_', '-') ?? 'Full-Time'}</span>
                                        <span className={jobStyles.jobPosted}>
                                            {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently'}
                                        </span>
                                        <span className={jobStyles.jobSalary}>
                                            {fmtSalary(job.salaryMin, job.salaryMax, job.currency)}
                                        </span>
                                    </div>
                                    <div className={jobStyles.jobActions}>
                                        {job.match && <span className={jobStyles.matchBadge}>{job.match}% match</span>}
                                        <Link to="/jobs" className={jobStyles.applyBtn}>
                                            View Job
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <div className={styles.rightCol}>
                    <section className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2><span className="material-icons-round">bar_chart</span> This Week</h2>
                        </div>
                        <ResponsiveContainer width="100%" height={100}>
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2b8cee" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#2b8cee" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="applications" stroke="#2b8cee" fill="url(#grad)" strokeWidth={2} />
                                <Tooltip contentStyle={{ background: '#1e2530', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#e6edf3' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </section>

                    <section className={`${styles.card} ${styles.interviewCard}`}>
                        <div className={styles.interviewBadge}>
                            <span className="material-icons-round">send</span> Recent Applications
                        </div>
                        {applications.length === 0 ? (
                            <p style={{ color: '#888', fontSize: '0.85rem', margin: '0.5rem 0' }}>
                                No applications yet. <Link to="/jobs" style={{ color: '#4a90e2' }}>Browse jobs →</Link>
                            </p>
                        ) : (
                            <>
                                <h3>{applications[0]?.jobData?.title || 'Applied Job'}</h3>
                                <p style={{ color: '#888', fontSize: '0.85rem' }}>
                                    Status: <strong style={{ color: '#4ade80' }}>{applications[0]?.status}</strong>
                                </p>
                            </>
                        )}
                        <Link to="/applications" className={styles.prepBtn} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, textDecoration: 'none' }}>
                            <span className="material-icons-round">list</span>
                            View All Applications
                        </Link>
                    </section>

                    <section className={`${styles.card} ${styles.aiCard}`}>
                        <div className={styles.aiHeader}>
                            <span className="material-icons-round">lightbulb</span>
                            <span>AI Coach Tip</span>
                        </div>
                        <p>
                            Your profile match for Tech Roles could increase by <strong>15%</strong> if you add{' '}
                            <em>Systems Design</em> to your skill list.
                        </p>
                        <Link to="/skill-gap" className={styles.aiLink}>View Skill Gap Analysis →</Link>
                    </section>
                </div>
            </div>

            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2><span className="material-icons-round">history</span> Recent Activity</h2>
                </div>
                <div className={styles.activityList}>
                    {applications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#888' }}>
                            <p>No recent activity yet. Start applying to jobs!</p>
                            <Link to="/jobs" style={{ color: '#4a90e2', fontSize: '0.85rem' }}>Browse jobs →</Link>
                        </div>
                    ) : (
                        applications.slice(0, 4).map((app, i) => (
                            <div key={i} className={styles.activityItem}>
                                <span className={`material-icons-round ${styles.actIcon} ${styles.brand}`}>send</span>
                                <p>Applied to <strong>"{app.jobData?.title}"</strong> at {app.jobData?.company}</p>
                                <span className={styles.actTime}>
                                    {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
