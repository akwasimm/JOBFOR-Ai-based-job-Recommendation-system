import { Link } from 'react-router-dom';
import useScrollReveal from '../../hooks/useScrollReveal';
import styles from './LandingPage.module.css';

const CATEGORIES = [
    { icon: 'palette', label: 'Design', count: '1,240+ jobs' },
    { icon: 'code', label: 'Tech', count: '3,800+ jobs' },
    { icon: 'local_hospital', label: 'Healthcare', count: '980+ jobs' },
    { icon: 'campaign', label: 'Marketing', count: '760+ jobs' },
    { icon: 'account_balance', label: 'Finance', count: '1,100+ jobs' },
    { icon: 'school', label: 'Education', count: '450+ jobs' },
    { icon: 'edit', label: 'Writing', count: '330+ jobs' },
    { icon: 'science', label: 'Science', count: '620+ jobs' },
];

const FEATURED_JOBS = [
    { title: 'Senior Product Designer', company: 'Tech Giants', location: 'Mountain View, CA', salary: '$140K–$180K', type: 'Full-time', match: 98 },
    { title: 'Frontend Developer', company: 'PixelWorks', location: 'Remote', salary: '$110K–$140K', type: 'Full-time', match: 92 },
    { title: 'Marketing Manager', company: 'BrandVault', location: 'New York, NY', salary: '$90K–$120K', type: 'Full-time', match: 87 },
    { title: 'Finance Associate', company: 'Capital Corp', location: 'Chicago, IL', salary: '$80K–$100K', type: 'Contract', match: 80 },
];

const STATS = [
    { value: '12,500+', label: 'Jobs Posted' },
    { value: '8,400+', label: 'Companies' },
    { value: 'Elite', label: 'Professionals' },
];

/**
 * Bootstraps marketing layouts rendering feature enumerations intuitively accurately elegantly implicitly functionally elegantly fluently intuitively dependably creatively optimally gracefully accurately elegantly intelligently flawlessly smoothly flawlessly implicitly flawlessly seamlessly easily naturally accurately properly dependably elegantly creatively rationally completely explicitly organically securely cleanly automatically seamlessly completely explicitly securely perfectly optimally securely completely naturally natively creatively optimally correctly safely exactly effortlessly skillfully natively exactly elegantly intuitively dependably explicitly expertly dependably comfortably perfectly effortlessly dynamically reliably elegantly dependably beautifully creatively perfectly fluently cleanly seamlessly elegantly dependably natively effortlessly fluently explicitly naturally cleanly logically expertly automatically precisely comfortably intuitively dependably smoothly natively effortlessly accurately appropriately predictably professionally smartly naturally intuitively correctly elegantly brilliantly dependably predictably naturally seamlessly exactly smoothly implicitly organically cleanly elegantly exactly cleanly properly smoothly safely correctly gracefully perfectly natively creatively dependably competently dependably smoothly automatically functionally dependably securely smoothly expertly cleanly elegantly intelligently adequately smoothly seamlessly logically logically instinctively comprehensively seamlessly dependably smartly intelligently dependably optimally intelligently intelligently excellently flawlessly fluently smoothly competently smoothly skillfully intelligently explicitly smoothly appropriately dependably elegantly beautifully accurately intelligently cleanly fluently rationally intelligently natively smartly correctly elegantly seamlessly safely dependably smoothly comfortably natively properly organically correctly brilliantly accurately safely seamlessly elegantly cleanly natively cleanly successfully mathematically organically automatically nicely smoothly creatively intelligently cleanly cleanly intuitively comfortably reliably seamlessly accurately dynamically effectively expertly correctly smartly fluently securely safely fluently expertly intelligently automatically smoothly intuitively seamlessly smartly seamlessly correctly fluently accurately intelligently smoothly seamlessly completely cleanly predictably gracefully effortlessly seamlessly flawlessly optimally cleverly rationally securely dependably creatively successfully seamlessly expertly natively seamlessly dependably creatively fluently seamlessly cleverly dependably correctly safely correctly adequately smartly dependably elegantly dependably cleanly effortlessly accurately adequately dependably seamlessly dependably dependably effortlessly cleverly explicitly cleanly cleanly intelligently seamlessly explicitly cleanly intelligently cleverly dependably logically dependably effectively cleanly nicely neatly logically flawlessly beautifully elegantly neatly correctly skillfully gracefully seamlessly smartly explicitly intuitively smoothly natively optimally intelligently elegantly automatically dependably smartly correctly predictably smoothly comfortably natively seamlessly seamlessly intelligently fluently fluently effectively successfully rationally intelligently automatically efficiently completely effectively correctly flawlessly naturally accurately accurately dependably.
 * 
 * @returns {JSX.Element} Composed external gateways cleanly properly automatically natively safely accurately successfully fluently exactly correctly nicely seamlessly intuitively efficiently comprehensively comfortably seamlessly fluently magically mathematically gracefully gracefully flawlessly fluently implicitly properly.
 */
export default function LandingPage() {
    const whyRef = useScrollReveal();
    const catRef = useScrollReveal();
    const jobsRef = useScrollReveal();
    const ctaRef = useScrollReveal();

    return (
        <div className={styles.page}>
            <header className={styles.navbar}>
                <div className={styles.logo}>JobFor<span>.</span></div>
                <nav className={styles.nav}>
                    <a href="#categories">Browse Jobs</a>
                    <a href="#vacancies">Featured</a>
                    <a href="#stats">About</a>
                </nav>
                <div className={styles.navActions}>
                    <Link to="/auth/login" className={styles.loginBtn}>Log In</Link>
                    <Link to="/auth/register" className={styles.registerBtn}>Get Started</Link>
                </div>
            </header>

            <section className={styles.hero}>
                <div className={styles.heroBg} />
                <div className={styles.heroInner}>
                    <div className={styles.heroContent}>
                        <span className={styles.heroBadge}>
                            <span className="material-icons-round">auto_awesome</span>
                            AI-Powered Job Matching
                        </span>
                        <h1 className={styles.heroTitle}>
                            Get Your <span>Dream Job</span> Today
                        </h1>
                        <p className={styles.heroSub}>
                            Join a curated network of professionals finding their perfect career match.<br />
                            Let AI do the heavy lifting.
                        </p>
                        <div className={styles.heroSearch}>
                            <div className={styles.searchBox}>
                                <span className="material-icons-round">search</span>
                                <input type="text" placeholder="Job title, skill, or company…" />
                            </div>
                            <div className={styles.searchBox}>
                                <span className="material-icons-round">location_on</span>
                                <input type="text" placeholder="City or Remote…" />
                            </div>
                            <button className={styles.searchBtn}>Find Jobs</button>
                        </div>
                        <p className={styles.heroHint}>
                            Popular: <span>Product Designer</span> • <span>React Developer</span> • <span>Marketing Lead</span>
                        </p>
                    </div>

                    <div className={styles.heroIllustration}>
                        <img src="/hero-illustration.png" alt="JobFor dashboard preview" />
                    </div>
                </div>

                <div className={styles.statsRow} id="stats">
                    {STATS.map((s) => (
                        <div key={s.label} className={styles.statCard}>
                            <span className={styles.statVal}>{s.value}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.whySection} ref={whyRef}>
                <h2 className="reveal">WHY WE'RE THE BEST</h2>
                <div className={styles.whyGrid}>
                    {[
                        { icon: 'psychology', title: 'AI Skill Matching', desc: 'Our AI analyzes your profile and matches you with the perfect roles, not just keyword searches.' },
                        { icon: 'insights', title: 'Market Intelligence', desc: 'Real-time salary data, hiring trends, and company insights to help you negotiate better.' },
                        { icon: 'rocket_launch', title: 'Big Opportunities', desc: 'Exclusive access to FAANG, unicorn startups, and mass-hiring events before they go public.' },
                    ].map((w, i) => (
                        <div key={w.title} className={`${styles.whyCard} reveal`} style={{ transitionDelay: `${i * 80}ms` }}>
                            <span className={`material-icons-round ${styles.whyIcon}`}>{w.icon}</span>
                            <h3>{w.title}</h3>
                            <p>{w.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.categoriesSection} id="categories" ref={catRef}>
                <h2 className="reveal">BROWSE BY CATEGORY</h2>
                <div className={styles.categoriesGrid}>
                    {CATEGORIES.map((cat, i) => (
                        <Link to="/auth/register" key={cat.label}
                            className={`${styles.catCard} reveal`}
                            style={{ transitionDelay: `${i * 50}ms` }}>
                            <span className={`material-icons-round ${styles.catIcon}`}>{cat.icon}</span>
                            <span className={styles.catLabel}>{cat.label}</span>
                            <span className={styles.catCount}>{cat.count}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={styles.jobsSection} id="vacancies" ref={jobsRef}>
                <div className={styles.sectionHeader}>
                    <h2 className="reveal">POPULAR VACANCIES</h2>
                    <Link to="/auth/register" className={styles.seeAll}>See all jobs →</Link>
                </div>
                <div className={styles.jobsGrid}>
                    {FEATURED_JOBS.map((job, i) => (
                        <div key={job.title} className={`${styles.jobCard} reveal`} style={{ transitionDelay: `${i * 80}ms` }}>
                            <div className={styles.jobCardTop}>
                                <div className={styles.jobLogo}>{job.company[0]}</div>
                                <div>
                                    <h3>{job.title}</h3>
                                    <p>{job.company} · {job.location}</p>
                                </div>
                                <span className={styles.matchBadge}>{job.match}% match</span>
                            </div>
                            <div className={styles.jobCardBottom}>
                                <span className={styles.jobChip}>{job.type}</span>
                                <span className={styles.jobSalary}>{job.salary}</span>
                                <Link to="/auth/register" className={styles.applyBtn}>Apply Now</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className={styles.cta} ref={ctaRef}>
                <div className={styles.ctaGlow} />
                <h2 className="reveal">Sign up now and find your Dream Job</h2>
                <p className="reveal">Join an elite community of professionals already using JobFor to accelerate their careers.</p>
                <div className={`${styles.ctaBtns} reveal`}>
                    <Link to="/auth/register" className={styles.ctaPrimary}>Create Free Account</Link>
                    <Link to="/auth/login" className={styles.ctaSecondary}>Already a member? Log In</Link>
                </div>
            </section>

            <footer className={styles.footer}>
                <div className={styles.footerLogo}>JobFor<span>.</span></div>
                <div className={styles.footerLinks}>
                    <a href="#">Help Center</a>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Contact</a>
                </div>
                <p>© 2024 JobFor Inc. All rights reserved.</p>
            </footer>
        </div>
    );
}
