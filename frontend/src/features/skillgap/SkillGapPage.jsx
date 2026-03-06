import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import styles from './SkillGapPage.module.css';

/**
 * Resolves qualitative enum values into localized integer metrics dictating visual progression bars synchronously.
 * @constant {Object<string, number>}
 */
const PROF_MAP = { BEGINNER: 25, INTERMEDIATE: 55, ADVANCED: 80, EXPERT: 95 };

/**
 * Calculates and visualizes hierarchical user competency constraints extrapolating actionable learning trajectories.
 * Merges localized profile arrays into comparative readiness indices natively generating contextual UI elements.
 * 
 * @component
 * @returns {JSX.Element} The rendered skill gap analysis interface.
 */
export default function SkillGapPage() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await api.profile.get();
            setProfile(res?.data);
        } catch { setError(true); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchProfile(); }, []);

    const skills = profile?.skills || [];
    const experience = profile?.workExperience || [];

    // Build skills-you-have from profile skills
    const skillsHave = skills.map(s => ({
        name: s.skill?.name || s.name || 'Unknown',
        level: PROF_MAP[s.proficiency] || 60,
    }));

    // Readiness = profile completion from auth or skill count heuristic
    const readiness = user?.profile?.profileCompletion
        ?? Math.min(Math.round((skills.length / 10) * 60 + (experience.length / 3) * 40), 100);

    const LEARNING_PATH = [
        { step: 1, title: 'Complete Your Profile', duration: 'Today', platform: 'JobFor', status: profile?.firstName ? 'done' : 'start' },
        { step: 2, title: 'Add 5+ Skills', duration: '1 day', platform: 'JobFor', status: skills.length >= 5 ? 'done' : skills.length > 0 ? 'start' : 'locked' },
        { step: 3, title: 'Add Work Experience', duration: '1 day', platform: 'JobFor', status: experience.length > 0 ? 'done' : 'locked' },
    ];

    return (
        <div className={styles.page}>
            {/* Target */}
            <div className={styles.targetCard}>
                <div>
                    <span className={styles.targetLabel}>CAREER READINESS</span>
                    <h1>{loading ? 'Loading…' : (user?.profile?.headline || 'Your Career Profile')}</h1>
                </div>
                <div className={styles.readinessRing}>
                    <svg viewBox="0 0 100 100" className={styles.ring}>
                        <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#2b8cee" strokeWidth="8"
                            strokeDasharray={`${readiness * 2.64} 264`} strokeLinecap="round"
                            transform="rotate(-90 50 50)" />
                    </svg>
                    <div className={styles.ringText}>
                        <span className={styles.ringVal}>{readiness}%</span>
                        <span>Readiness</span>
                    </div>
                </div>
            </div>

            {error && (
                <div style={{
                    textAlign: 'center', padding: '2rem', background: 'rgba(255,107,107,0.05)',
                    border: '1px solid rgba(255,107,107,0.2)', borderRadius: 12, marginBottom: 24
                }}>
                    <span className="material-icons-round" style={{ color: '#ff6b6b', fontSize: 32, display: 'block' }}>wifi_off</span>
                    <p style={{ color: '#ff6b6b' }}>Couldn't load profile data</p>
                    <button onClick={fetchProfile} style={{
                        marginTop: 8, padding: '4px 14px', borderRadius: 6,
                        border: '1px solid rgba(255,107,107,0.4)', background: 'transparent', color: '#ff6b6b', cursor: 'pointer'
                    }}>Retry</button>
                </div>
            )}

            <div className={styles.mainGrid}>
                {/* Skills You Have */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle} style={{ color: 'var(--color-success)' }}>
                        <span className="material-icons-round">check_circle</span> Skills You Have
                    </h2>
                    {loading ? <p style={{ color: '#888' }}>Loading skills…</p> : (
                        skillsHave.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1rem', color: '#888' }}>
                                <p>No skills added yet.</p>
                                <a href="/profile" style={{ color: '#4a90e2', fontSize: '0.85rem' }}>Add skills in Profile →</a>
                            </div>
                        ) : (
                            <div className={styles.skillsList}>
                                {skillsHave.map((s) => (
                                    <div key={s.name} className={styles.skillItem}>
                                        <div className={styles.skillMeta}>
                                            <span>{s.name}</span>
                                            <span className={styles.skillPct}>{s.level}%</span>
                                        </div>
                                        <div className={styles.progressBar}>
                                            <div className={styles.progressFill}
                                                style={{ width: `${s.level}%`, background: 'var(--color-success)' }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </section>

                {/* Career Progress */}
                <section className={styles.card}>
                    <h2 className={styles.cardTitle} style={{ color: 'var(--color-warning)' }}>
                        <span className="material-icons-round">trending_up</span> Profile Strength
                    </h2>
                    {loading ? <p style={{ color: '#888' }}>Loading…</p> : (
                        <div className={styles.skillsList}>
                            {[
                                { name: 'Basic Info', level: profile?.firstName ? 100 : 0 },
                                { name: 'Skills', level: Math.min(skills.length * 10, 100) },
                                { name: 'Experience', level: Math.min(experience.length * 34, 100) },
                                { name: 'Education', level: (profile?.education?.length || 0) > 0 ? 100 : 0 },
                            ].map(s => (
                                <div key={s.name} className={styles.skillItem}>
                                    <div className={styles.skillMeta}>
                                        <span>{s.name}</span>
                                        <span className={styles.skillPct}>{s.level}%</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill}
                                            style={{ width: `${s.level}%`, background: 'var(--color-warning)' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Personalised Learning Path */}
            <section className={styles.card}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>
                        <span className="material-icons-round">route</span> Personalised Learning Path
                    </h2>
                </div>
                <div className={styles.learningPath}>
                    {LEARNING_PATH.map((s, i) => (
                        <div key={i} className={styles.pathStep}>
                            <div className={`${styles.stepNum} ${s.status === 'start' ? styles.active : s.status === 'done' ? styles.active : ''}`}>
                                {s.status === 'done' ? '✓' : s.step}
                            </div>
                            <div className={styles.stepLine} />
                            <div className={styles.stepContent}>
                                <h3>{s.title}</h3>
                                <p>{s.platform} · {s.duration}</p>
                            </div>
                            <a href="/profile"
                                className={`${styles.viewBtn} ${s.status === 'locked' ? styles.locked : ''}`}>
                                {s.status === 'done' ? (
                                    <><span className="material-icons-round">check_circle</span> Done</>
                                ) : s.status === 'locked' ? (
                                    <><span className="material-icons-round">lock</span> Locked</>
                                ) : (
                                    <><span className="material-icons-round">open_in_new</span> Start</>
                                )}
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
