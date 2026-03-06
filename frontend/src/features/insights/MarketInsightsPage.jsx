import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { api } from '../../api';
import styles from './MarketInsightsPage.module.css';

const tooltipStyle = {
    background: '#1e2530', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', color: '#e6edf3', fontSize: '12px',
};

/**
 * Custom React hook establishing parallel asynchronous connections against discrete statistical
 * market endpoints fetching localized compensation data, trending skillsets, and hiring volumes.
 * 
 * @function useInsightsData
 * @returns {{
 *  salary: Object|null,
 *  skills: Array<Object>,
 *  trends: Array<Object>,
 *  companies: Array<Object>,
 *  loading: boolean,
 *  error: boolean,
 *  refetch: Function
 * }}
 */
function useInsightsData() {
    const [salary, setSalary] = useState(null);
    const [skills, setSkills] = useState([]);
    const [trends, setTrends] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetch = async () => {
        setLoading(true);
        setError(false);
        try {
            const [salRes, sklRes, trdRes, cmpRes] = await Promise.allSettled([
                api.insights.salary(),
                api.insights.skills(),
                api.insights.trends(),
                api.insights.companies(),
            ]);
            if (salRes.status === 'fulfilled') setSalary(salRes.value?.data);
            if (sklRes.status === 'fulfilled') setSkills(Array.isArray(sklRes.value?.data) ? sklRes.value.data : []);
            if (trdRes.status === 'fulfilled') setTrends(Array.isArray(trdRes.value?.data) ? trdRes.value.data : []);
            if (cmpRes.status === 'fulfilled') setCompanies(Array.isArray(cmpRes.value?.data) ? cmpRes.value.data : []);
            // If all failed, show error
            if ([salRes, sklRes, trdRes, cmpRes].every(r => r.status === 'rejected')) setError(true);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetch(); }, []);
    return { salary, skills, trends, companies, loading, error, refetch: fetch };
}

/**
 * Normalizes potentially divergent upstream salary payload structures projecting unified 
 * numerical arrays suitable for direct consumption by graphical rendering libraries (Recharts).
 * Applies baseline heuristic approximations if definitive datasets are missing.
 * 
 * @function buildSalaryData
 * @param {Object} salary - Server-provided categorical salary bounds.
 * @returns {Array<{role: string, salary: number}>} Normalized D3-compatible dataset mapping localized structural variants.
 */
function buildSalaryData(salary) {
    if (!salary) return [
        { role: 'Junior', salary: 6 }, { role: 'Mid', salary: 12 }, { role: 'Senior', salary: 22 },
        { role: 'Lead', salary: 32 }, { role: 'Director', salary: 50 },
    ];
    // API may return levels like { junior, mid, senior, lead } in absolute values
    return Object.entries(salary).map(([role, val]) => ({
        role: role.charAt(0).toUpperCase() + role.slice(1),
        salary: Math.round((typeof val === 'object' ? val.avg || val.median || val : val) / 100000),
    })).filter(d => d.salary > 0).slice(0, 6);
}

/**
 * Standardizes longitudinal temporal points measuring hiring velocity variations scaling inputs to render continuous splines.
 * Defaults back to simulated realistic projections ensuring layout integrity if network payloads stall.
 * 
 * @function buildTrendData
 * @param {Array<Object>} trends - Temporal node array conveying job posting frequencies over distinct chronological milestones.
 * @returns {Array<{month: string, jobs: number}>} Standardized vector array rendering bounded area graphs distinctly.
 */
function buildTrendData(trends) {
    if (!trends || trends.length === 0) return [
        { month: 'Sep', jobs: 1200 }, { month: 'Oct', jobs: 1450 }, { month: 'Nov', jobs: 1100 },
        { month: 'Dec', jobs: 900 }, { month: 'Jan', jobs: 1650 }, { month: 'Feb', jobs: 1820 },
    ];
    return trends.slice(-6).map(t => ({
        month: t.month || t.label || t.date,
        jobs: t.count || t.jobs || t.value || 0,
    }));
}

/**
 * Visual dashboards resolving high-level demographic macroeconomic shifts, mapping explicit localized salary distributions
 * directly relative to explicit technical competency demand frequencies observed across contemporary posting vectors dynamically.
 * 
 * @component
 * @returns {JSX.Element} Visual aggregation layout rendering interconnected data charts.
 */
export default function MarketInsightsPage() {
    const { salary, skills, trends, companies, loading, error, refetch } = useInsightsData();

    const salaryData = buildSalaryData(salary);
    const hiringTrend = buildTrendData(trends);

    const avgSalary = salary?.average || salary?.median || salary?.avg || null;
    const openRoles = salary?.totalJobs || null;
    const topSkills = skills.slice(0, 5);
    const topCompanies = companies.slice(0, 6);

    const MARKET_STATS = [
        {
            label: 'Avg. Salary',
            value: avgSalary ? `₹${Math.round(avgSalary / 100000)}L` : '₹18 LPA',
            icon: 'payments', change: '+8% YoY', up: true
        },
        {
            label: 'Open Roles',
            value: openRoles ? `${(openRoles / 1000).toFixed(1)}K` : '45.2K',
            icon: 'work', change: '+23% MoM', up: true
        },
        { label: 'Time to Hire', value: '21 days', icon: 'schedule', change: '-3 days', up: true },
        { label: 'Remote Ratio', value: '68%', icon: 'home_work', change: '+5% QoQ', up: true },
    ];

    return (
        <div className={styles.page}>
            <div className={styles.badge}>
                <span className="material-icons-round">insights</span> MARKET INSIGHTS
                {loading && <span style={{ marginLeft: 8, fontSize: '0.75rem', opacity: 0.6 }}>Loading…</span>}
            </div>

            {error && (
                <div style={{
                    marginBottom: 20, padding: '12px 16px', background: 'rgba(255,107,107,0.05)',
                    border: '1px solid rgba(255,107,107,0.2)', borderRadius: 10, display: 'flex',
                    alignItems: 'center', gap: 10
                }}>
                    <span className="material-icons-round" style={{ color: '#ff6b6b' }}>wifi_off</span>
                    <span style={{ flex: 1, color: '#ff8080', fontSize: '0.9rem' }}>
                        Couldn't load live data — showing default estimates
                    </span>
                    <button onClick={refetch} style={{
                        padding: '4px 12px', borderRadius: 6,
                        border: '1px solid rgba(255,107,107,0.4)', background: 'transparent',
                        color: '#ff6b6b', cursor: 'pointer', fontSize: '0.82rem'
                    }}>Retry</button>
                </div>
            )}

            {/* Market Stats */}
            <div className={styles.statsGrid}>
                {MARKET_STATS.map((s) => (
                    <div key={s.label} className={styles.statCard}>
                        <span className={`material-icons-round ${styles.statIcon}`}>{s.icon}</span>
                        <div className={styles.statVal}>{s.value}</div>
                        <div className={styles.statLabel}>{s.label}</div>
                        <span className={`${styles.change} ${s.up ? styles.up : styles.down}`}>{s.change}</span>
                    </div>
                ))}
            </div>

            <div className={styles.chartsGrid}>
                {/* Salary by Level */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2><span className="material-icons-round">payments</span> Salary Insights by Level</h2>
                        <span className={styles.tag}>All Roles · INR</span>
                    </div>
                    <p className={styles.cardSub}>
                        Median salary: <strong>₹{salaryData[Math.floor(salaryData.length / 2)]?.salary || 22}L</strong>
                        {' '}· Top roles: <strong>₹{salaryData[salaryData.length - 1]?.salary || 50}L</strong>
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={salaryData} barSize={36}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="role" tick={{ fill: '#8b949e', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8b949e', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}L`} />
                            <Tooltip contentStyle={tooltipStyle} formatter={v => [`₹${v} LPA`, 'Salary']} />
                            <Bar dataKey="salary" fill="#2b8cee" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </section>

                {/* Hiring Trend */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2><span className="material-icons-round">trending_up</span> Market Overview</h2>
                        <span className={styles.tag}>Last 6 months</span>
                    </div>
                    <p className={styles.cardSub}>Tech job postings are <strong>up +28%</strong> compared to last quarter.</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={hiringTrend}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2b8cee" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#2b8cee" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: '#8b949e', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#8b949e', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Area type="monotone" dataKey="jobs" stroke="#2b8cee" fill="url(#areaGrad)" strokeWidth={2} />
                            <Tooltip contentStyle={tooltipStyle} />
                        </AreaChart>
                    </ResponsiveContainer>
                </section>
            </div>

            {/* Top Skills in Demand */}
            {topSkills.length > 0 && (
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h2><span className="material-icons-round">psychology</span> Top Skills in Demand</h2>
                        <span className={styles.tag}>From job listings</span>
                    </div>
                    <div className={styles.companiesGrid}>
                        {topSkills.map((s, i) => (
                            <div key={i} className={styles.companyCard}>
                                <div className={styles.companyLogo}>{s.name?.[0] || '?'}</div>
                                <div className={styles.companyInfo}>
                                    <h3>{s.name}</h3>
                                    <span className={styles.companyType}>{s.category || 'Tech'}</span>
                                </div>
                                <div className={styles.companyRight}>
                                    <span className={styles.openRoles}>{s.count || s.demand || '—'} jobs</span>
                                    <span className={`${styles.growth} ${styles.up}`}>In demand</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Top Companies from DB */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2><span className="material-icons-round">business</span> Top Hiring Companies</h2>
                </div>
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {[1, 2, 3].map(i => <div key={i} style={{ height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.05)' }} />)}
                    </div>
                ) : topCompanies.length === 0 ? (
                    <p style={{ color: '#888', textAlign: 'center', padding: '1rem' }}>
                        No company data yet — data builds as jobs are posted.
                    </p>
                ) : (
                    <div className={styles.companiesGrid}>
                        {topCompanies.map((c, i) => (
                            <div key={i} className={styles.companyCard}>
                                <div className={styles.companyLogo}>{c.name?.[0] || '?'}</div>
                                <div className={styles.companyInfo}>
                                    <h3>{c.name}</h3>
                                    <span className={styles.companyType}>{c.industry || c.type || 'Tech'}</span>
                                </div>
                                <div className={styles.companyRight}>
                                    <span className={styles.openRoles}>{c.openRoles || c.count || 0} roles</span>
                                    <span className={`${styles.growth} ${styles.up}`}>{c.growth || '+10%'}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* CTA */}
            <div className={styles.cta}>
                <span className="material-icons-round">rocket_launch</span>
                <div>
                    <h3>Ready to leverage these insights?</h3>
                    <p>Tailor your applications based on real market data.</p>
                </div>
                <a href="/recommendations" className={styles.ctaBtn}>View AI Recommendations →</a>
            </div>
        </div>
    );
}
