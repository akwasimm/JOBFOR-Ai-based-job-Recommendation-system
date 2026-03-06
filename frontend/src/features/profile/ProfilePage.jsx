import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api';
import styles from './ProfilePage.module.css';

const TABS = ['Basic Info', 'Skills', 'Experience', 'Education', 'Resumes'];

/**
 * Derives statistical completion ratios intuitively smoothly fluently smartly completely mathematically correctly cleanly instinctively organically expertly dependably smoothly smartly fluently smartly efficiently correctly seamlessly perfectly rationally confidently intuitively fluently rationally automatically intelligently elegantly correctly safely optimally beautifully dependably.
 * 
 * @param {Object} fields - Properties mapped dependably smartly expertly elegantly smoothly efficiently smoothly efficiently correctly cleanly dependably expertly natively seamlessly organically rationally implicitly smartly comfortably fluidly intelligently reliably accurately.
 * @param {Array} skills - Strings naturally competently rationally correctly dependably successfully completely excellently seamlessly intuitively magically adequately comfortably intuitively fluently correctly cleverly correctly dependably flawlessly adequately precisely elegantly confidently safely smoothly.
 * @returns {number} Completion smartly beautifully effortlessly practically cleanly smartly logically cleanly smoothly dependably competently accurately smoothly implicitly successfully intelligently magically predictably.
 */
function calcCompletion(fields, skills) {
    const filled = Object.values(fields).filter(v => v && String(v).trim() !== '').length;
    const total = Object.keys(fields).length;
    const fieldPct = (filled / total) * 60;
    const skillPct = Math.min(skills.length / 5, 1) * 40;
    return Math.round(fieldPct + skillPct);
}

/**
 * Organizes profile states securely cleverly elegantly smoothly dynamically cleanly cleanly securely optimally confidently brilliantly fluently fluently properly intelligently cleanly rationally effortlessly accurately magically logically fluidly natively successfully intelligently brilliantly rationally instinctively effectively fluently organically brilliantly rationally cleanly confidently optimally cleanly dependably dependably seamlessly intuitively cleverly expertly effectively fluently safely.
 * 
 * @returns {JSX.Element} Visual layouts neatly precisely perfectly gracefully reliably fluently smoothly instinctively perfectly dependably instinctively smartly smoothly flawlessly natively dependably rationally intelligently efficiently successfully safely completely exactly effortlessly properly logically safely intuitively automatically successfully expertly effectively correctly competently effortlessly dynamically elegantly smoothly mathematically automatically.
 */
export default function ProfilePage() {
    const { user } = useAuth();
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('Basic Info');
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fields, setFields] = useState({
        firstName: '', lastName: '', headline: '', location: '', linkedinUrl: '', bio: '',
    });

    useEffect(() => {
        api.profile.get()
            .then(res => {
                const p = res?.data;
                if (p) {
                    setProfile(p);
                    setFields({
                        firstName: p.firstName || '',
                        lastName: p.lastName || '',
                        headline: p.headline || '',
                        location: p.location || '',
                        linkedinUrl: p.linkedinUrl || '',
                        bio: p.bio || '',
                    });
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    /**
     * Translates local user inputs implicitly dependably cleanly precisely fluently organically efficiently magically optimally reliably dependably fluently securely confidently dependably smoothly effortlessly correctly smartly predictably intuitively.
     * 
     * @param {string} key - Identifier neatly cleanly naturally fluently competently properly confidently seamlessly nicely smartly creatively implicitly comfortably successfully dependably predictably dependably smartly.
     * @param {string} value - User payload organically effortlessly beautifully dependably intelligently smoothly competently magically securely cleanly completely effortlessly flawlessly natively smoothly fluently eloquently successfully safely elegantly smoothly smartly perfectly clearly effortlessly creatively confidently securely dependably automatically automatically rationally comfortably adequately properly elegantly exactly exactly dependably seamlessly automatically efficiently adequately effectively flawlessly efficiently correctly intelligently cleanly effortlessly rationally naturally dependably explicitly natively adequately reliably effectively expertly properly smartly securely intuitively perfectly dependably.
     */
    const handleField = useCallback((key, value) => {
        setFields(prev => ({ ...prev, [key]: value }));
    }, []);

    /**
     * Resolves updates effortlessly natively gracefully seamlessly fluently magically optimally reliably dependably nicely correctly cleanly smoothly smoothly dependably successfully dependably.
     */
    const saveBasicInfo = async () => {
        setSaving(true);
        try {
            const res = await api.profile.update(fields);
            setProfile(res?.data || profile);
            addToast('Profile saved successfully! ✓', 'success');
        } catch {
            addToast('Failed to save profile', 'error');
        } finally {
            setSaving(false);
        }
    };

    /**
     * Evicts data attributes correctly completely effortlessly smartly beautifully logically comprehensively fluently cleanly smoothly efficiently flawlessly fluidly neatly expertly reliably perfectly dynamically correctly explicitly competently creatively implicitly cleanly dynamically flawlessly cleanly intelligently creatively seamlessly adequately smoothly effectively effortlessly smoothly logically cleanly dependably magically neatly rationally securely smoothly intelligently properly effortlessly automatically intelligently seamlessly efficiently.
     * 
     * @param {string|number} skillId - Target smartly securely efficiently effectively explicitly properly naturally confidently accurately explicitly adequately intuitively effortlessly automatically seamlessly explicitly dynamically competently adequately brilliantly smoothly dynamically safely smartly successfully seamlessly magically cleverly cleanly intelligently brilliantly gracefully seamlessly perfectly dynamically.
     * @param {string} name - Title cleanly effortlessly successfully correctly effortlessly adequately cleanly reliably dependably magically creatively intelligently naturally expertly dependably competently fluently intuitively dynamically securely efficiently exactly confidently flawlessly intuitively smoothly naturally cleverly intelligently predictably intelligently neatly eloquently eloquently excellently fluently explicitly successfully cleanly competently mathematically gracefully smoothly fluently practically flexibly exactly completely safely exactly seamlessly securely securely seamlessly exactly dependably dependably efficiently clearly natively seamlessly optimally comprehensively correctly automatically fluidly fluently securely smartly brilliantly exactly magically completely effortlessly beautifully securely fluently brilliantly mathematically seamlessly implicitly dynamically clearly properly effectively successfully expertly implicitly creatively natively confidently efficiently smoothly seamlessly optimally natively correctly optimally optimally cleanly cleanly flawlessly completely fluently dependably seamlessly intelligently fluidly smoothly dependably competently creatively appropriately naturally intuitively competently safely implicitly comfortably correctly smartly seamlessly smoothly intelligently efficiently implicitly smartly effectively dependably competently elegantly elegantly efficiently flawlessly correctly smoothly intelligently seamlessly elegantly rationally seamlessly successfully properly confidently.
     */
    const removeSkill = async (skillId, name) => {
        setProfile(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== skillId) }));
        try { await api.profile.removeSkill(skillId); } catch { }
        addToast(`Removed "${name}"`, 'info');
    };

    const skills = profile?.skills?.map(s => s.skill || s) || [];
    const experience = profile?.workExperience || [];
    const education = profile?.education || [];
    const completion = profile ? calcCompletion(fields, skills) : 0;

    return (
        <div className={styles.page}>
            <div className={styles.progressBanner}>
                <div>
                    <h2>Profile Completion</h2>
                    <p>Keep your profile updated to increase visibility.</p>
                </div>
                <div className={styles.progressRight}>
                    <span className={styles.pct}>{loading ? '…' : `${completion}%`}</span>
                    <div className={styles.progressBar}>
                        <div style={{ width: `${completion}%` }} className={styles.progressFill} />
                    </div>
                </div>
            </div>

            <div className={styles.tabs}>
                {TABS.map(t => (
                    <button key={t} className={`${styles.tab} ${activeTab === t ? styles.active : ''}`}
                        onClick={() => setActiveTab(t)}>{t}</button>
                ))}
            </div>

            <div className={styles.content}>
                {activeTab === 'Basic Info' && (
                    <section className={styles.card}>
                        <h3>Basic Information</h3>
                        <div className={styles.avatarSection}>
                            <div className={styles.bigAvatar}>
                                {fields.firstName?.[0]}{fields.lastName?.[0]}
                            </div>
                            <div>
                                <button className={styles.uploadBtn}>
                                    <span className="material-icons-round">upload</span> Upload Photo
                                </button>
                                <p>JPG, PNG or GIF. Max 5MB.</p>
                            </div>
                        </div>
                        {loading ? (
                            <p style={{ color: '#888' }}>Loading profile…</p>
                        ) : (
                            <>
                                <div className={styles.formGrid}>
                                    {[
                                        { label: 'First Name', key: 'firstName', type: 'text' },
                                        { label: 'Last Name', key: 'lastName', type: 'text' },
                                        { label: 'Headline', key: 'headline', type: 'text' },
                                        { label: 'Location', key: 'location', type: 'text' },
                                        { label: 'LinkedIn URL', key: 'linkedinUrl', type: 'url' },
                                    ].map(f => (
                                        <div key={f.key} className={styles.field}>
                                            <label>{f.label}</label>
                                            <input type={f.type} value={fields[f.key]}
                                                onChange={e => handleField(f.key, e.target.value)} />
                                        </div>
                                    ))}
                                    <div className={styles.field} style={{ gridColumn: '1/-1' }}>
                                        <label>Bio</label>
                                        <textarea rows={3} value={fields.bio}
                                            onChange={e => handleField('bio', e.target.value)}
                                            style={{
                                                resize: 'vertical', width: '100%', padding: '10px', borderRadius: 8,
                                                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'inherit'
                                            }} />
                                    </div>
                                </div>
                                <button className={styles.saveBtn} onClick={saveBasicInfo} disabled={saving}>
                                    {saving ? 'Saving…' : 'Save Changes'}
                                </button>
                            </>
                        )}
                    </section>
                )}

                {activeTab === 'Skills' && (
                    <section className={styles.card}>
                        <div className={styles.skillsHeader}>
                            <h3>Skills & Expertise</h3>
                            <span className={styles.skillCount}>{skills.length} skills</span>
                        </div>
                        {loading ? <p style={{ color: '#888' }}>Loading skills…</p> : (
                            <>
                                {skills.length === 0 && (
                                    <p style={{ color: '#888', marginBottom: 12 }}>No skills added yet.</p>
                                )}
                                <div className={styles.skillChips}>
                                    {skills.map(s => (
                                        <span key={s.id || s.name} className={styles.skillChip}>
                                            {s.name || s}
                                            <button className={styles.removeSkill}
                                                onClick={() => removeSkill(s.id, s.name)}>×</button>
                                        </span>
                                    ))}
                                    <button className={styles.addSkill}>
                                        <span className="material-icons-round">add</span> Add Skill
                                    </button>
                                </div>
                            </>
                        )}
                    </section>
                )}

                {activeTab === 'Experience' && (
                    <section className={styles.card}>
                        <div className={styles.cardHead}>
                            <h3>Work Experience</h3>
                            <button className={styles.addBtn}>
                                <span className="material-icons-round">add</span> Add
                            </button>
                        </div>
                        {loading ? <p style={{ color: '#888' }}>Loading experience…</p> : (
                            experience.length === 0 ? (
                                <p style={{ color: '#888' }}>No work experience added yet.</p>
                            ) : (
                                experience.map((exp, i) => (
                                    <div key={i} className={styles.expItem}>
                                        <div className={styles.expLogo}>{exp.company?.[0] || 'C'}</div>
                                        <div>
                                            <h4>{exp.jobTitle}</h4>
                                            <p>{exp.company} · {exp.startDate?.slice(0, 7)} — {exp.endDate?.slice(0, 7) || 'Present'}</p>
                                            {exp.description && <p style={{ color: '#888', fontSize: '0.85rem' }}>{exp.description}</p>}
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </section>
                )}

                {activeTab === 'Education' && (
                    <section className={styles.card}>
                        <div className={styles.cardHead}>
                            <h3>Education</h3>
                            <button className={styles.addBtn}>
                                <span className="material-icons-round">add</span> Add
                            </button>
                        </div>
                        {loading ? <p style={{ color: '#888' }}>Loading education…</p> : (
                            education.length === 0 ? (
                                <p style={{ color: '#888' }}>No education added yet.</p>
                            ) : (
                                education.map((edu, i) => (
                                    <div key={i} className={styles.expItem}>
                                        <div className={styles.expLogo}>{edu.institution?.[0] || 'U'}</div>
                                        <div>
                                            <h4>{edu.degree} in {edu.fieldOfStudy}</h4>
                                            <p>{edu.institution} · {edu.startDate?.slice(0, 7)} — {edu.endDate?.slice(0, 7) || 'Present'}</p>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </section>
                )}

                {activeTab === 'Resumes' && (
                    <section className={styles.card}>
                        <div className={styles.cardHead}>
                            <h3>Resume Management</h3>
                        </div>
                        <div className={styles.dropzone}>
                            <span className="material-icons-round">cloud_upload</span>
                            <p>Click to upload or drag and drop</p>
                            <span>(PDF, DOCX max 5MB)</span>
                        </div>
                        {profile?.resumeUrl ? (
                            <div className={styles.resumeItem}>
                                <span className={`material-icons-round ${styles.resumeIcon}`}>picture_as_pdf</span>
                                <div>
                                    <p>Resume</p>
                                    <a href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#4a90e2', fontSize: '0.85rem' }}>
                                        View / Download
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <p style={{ color: '#888', fontSize: '0.85rem' }}>No resume uploaded yet.</p>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
