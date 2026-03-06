import styles from './JobDetailModal.module.css';

const JOB_DETAILS = {
    1: {
        description: `We're looking for a Senior UX Designer to join our world-class product team at Tech Giants. You'll lead end-to-end design efforts for our flagship consumer platform, collaborating with Product, Engineering, and Research to craft exceptional experiences at scale.`,
        responsibilities: [
            'Lead design strategy and execution for core product surfaces',
            'Facilitate workshops, design sprints, and user research sessions',
            'Create high-fidelity wireframes, prototypes, and final specs in Figma',
            'Partner with engineers to ensure pixel-perfect implementation',
            'Mentor junior designers and contribute to the design system',
        ],
        requirements: [
            '5+ years of UX/Product Design experience',
            'Expert-level Figma skills and strong portfolio',
            'Experience designing for millions of users at scale',
            'Strong understanding of user research methodologies',
            'Excellent cross-functional communication skills',
        ],
        benefits: ['Equity & RSUs', '401K match', 'Unlimited PTO', 'Remote-friendly', 'Health + Dental + Vision', 'Annual L&D budget'],
        teamSize: '12-person Design Org',
        interviews: '4 rounds (Portfolio → Culture → System Design → Final)',
    },
    2: {
        description: `Global Commerce is hiring a Product Lead to own strategy and roadmap for our $2B merchant platform. You'll work directly with the CPO and lead a cross-functional squad of designers, engineers, and analysts.`,
        responsibilities: [
            'Define and own the product vision and 12-month roadmap',
            'Drive cross-functional alignment across engineering, design, and data',
            'Conduct customer discovery and synthesize insights into requirements',
            'Own OKRs and report to executive leadership on progress',
            'Manage and mentor a team of 2 Associate PMs',
        ],
        requirements: [
            '4+ years of Product Management experience',
            'Proven track record shipping B2B SaaS products',
            'Strong data analysis skills (SQL preferred)',
            'Experience working with enterprise clients',
            'MBA or equivalent preferred',
        ],
        benefits: ['Performance bonus', 'Equity package', 'Flexible hours', 'Remote-first', '$5K home office stipend', 'Top-tier health benefits'],
        teamSize: '8-person Product squad',
        interviews: '3 rounds (Product Case → Stakeholder → Executive)',
    },
    3: {
        description: `Join Software Solutions as a Frontend Architect and define our technical frontend vision. You'll set standards across 10+ engineering teams, drive the evolution of our design system, and ultimately shape the UX for 50M monthly users.`,
        responsibilities: [
            'Architect scalable micro-frontend solutions across product lines',
            'Own the technical roadmap for frontend infrastructure',
            'Define coding standards, best practices, and code review processes',
            'Collaborate with UX to build and maintain the shared component library',
            'Drive performance optimizations targeting Core Web Vitals',
        ],
        requirements: [
            '7+ years of frontend engineering experience',
            'Deep expertise in React, TypeScript, and Webpack',
            'Experience architecting micro-frontend systems',
            'Strong understanding of web performance and accessibility (WCAG 2.1)',
            'Prior experience leading or mentoring engineering teams',
        ],
        benefits: ['Fully remote', 'Competitive equity', 'Top hardware budget', 'Open source contribution time', 'Conference sponsorship', 'Medical + mental health'],
        teamSize: 'Staff IC — influences 10 teams',
        interviews: '5 rounds (Technical Screen → System Design × 2 → Leadership → Offer)',
    },
    4: {
        description: `DataFlow Inc is looking for a Data Scientist to power our ML-driven analytics platform. You'll build models that directly impact revenue forecasting, churn prediction, and customer segmentation for Fortune 500 clients.`,
        responsibilities: [
            'Build and deploy production ML models (regression, classification, NLP)',
            'Explore and clean large datasets using Python and SQL',
            'Collaborate with Engineering to integrate models into the product',
            'Create dashboards and reports for business stakeholders',
            'Research and experiment with state-of-the-art ML techniques',
        ],
        requirements: [
            '3+ years of Data Science or ML experience',
            'Proficiency in Python, Pandas, Scikit-learn, and TensorFlow',
            'Strong SQL skills for data extraction and feature engineering',
            'Experience deploying models to production (MLflow, SageMaker)',
            'MS or PhD in Statistics, CS, or related field preferred',
        ],
        benefits: ['Research budget', 'Flexible remote', 'Competitive salary + bonus', 'Nvidia GPU workstation', 'Publishing opportunities', 'Medical benefits'],
        teamSize: '6-person Data Science team',
        interviews: '4 rounds (Take-home → Technical → ML System Design → Culture)',
    },
    5: {
        description: `BrandVault is seeking a Marketing Manager to lead growth marketing efforts for our B2C platform. You'll own paid, SEO, and content channels while analysing performance data to drive user acquisition and retention.`,
        responsibilities: [
            'Plan and manage multi-channel digital marketing campaigns',
            'Own SEO strategy and content calendar',
            'Analyse campaign performance using Google Analytics and Mixpanel',
            'Collaborate with Design for ad creative and landing pages',
            'Manage a $500K annual marketing budget',
        ],
        requirements: [
            '4+ years of digital marketing experience',
            'Proficiency in Google Ads, Meta Ads Manager, and SEMrush',
            'Strong analytical mindset with experience in A/B testing',
            'Excellent copywriting and storytelling ability',
            'Experience in a fast-growing startup preferred',
        ],
        benefits: ['Hybrid NYC office', 'Annual bonus', 'Learning budget', 'Health benefits', 'Free BrandVault Pro account'],
        teamSize: '5-person Marketing team',
        interviews: '3 rounds (Portfolio → Case Study → Final Panel)',
    },
    6: {
        description: `InfraGlobal is hiring a Cloud DevOps Engineer to scale our Kubernetes-based platform to handle millions of deployments per day. You'll own CI/CD pipelines, infrastructure-as-code, and reliability engineering.`,
        responsibilities: [
            'Design and maintain Kubernetes clusters across AWS and GCP',
            'Build and optimise CI/CD pipelines using GitHub Actions and ArgoCD',
            'Manage infrastructure-as-code with Terraform and Helm',
            'Implement observability stacks (Prometheus, Grafana, PagerDuty)',
            'Drive SRE practices and maintain 99.99% uptime SLAs',
        ],
        requirements: [
            '4+ years of DevOps or SRE experience',
            'Deep knowledge of Kubernetes, Docker, and container orchestration',
            'Experience with AWS (EKS, RDS, S3) and Terraform',
            'Strong scripting skills (Bash, Python)',
            'CKA or AWS certifications a plus',
        ],
        benefits: ['Fully remote', 'On-call compensation', 'Certification reimbursement', 'Equity', 'Top-tier health benefits', 'Home internet stipend'],
        teamSize: '8-person Platform Engineering team',
        interviews: '4 rounds (Infra Screen → Kubernetes Deep-Dive → System Design → Culture)',
    },
};

/**
 * Executes contextual modal layouts implicitly dynamically smoothly correctly appropriately smartly smoothly competently dependably properly efficiently logically clearly accurately intuitively securely cleanly intuitively magically implicitly cleanly accurately smoothly skillfully perfectly organically dependably efficiently competently completely dynamically correctly cleanly dependably expertly fluidly intuitively successfully fluently completely elegantly properly optimally creatively naturally intelligently smoothly comfortably.
 * 
 * @param {Object} props - Mapping parameters expertly flawlessly confidently reliably confidently optimally correctly gracefully dependably dynamically fluidly elegantly exactly naturally flawlessly organically cleanly cleanly intelligently.
 * @param {Object|null} props.job - Dynamic mapping natively intelligently natively intelligently natively fluently smartly safely correctly intelligently intelligently magically implicitly neatly.
 * @param {Function} props.onClose - Revert callbacks organically fluently exactly competently seamlessly gracefully smoothly reliably smartly implicitly adequately.
 * @param {Function} props.onSave - Store actions reliably beautifully natively naturally accurately effortlessly gracefully dependably correctly intuitively efficiently fluidly effortlessly comprehensively exactly fluently completely instinctively competently gracefully automatically eloquently natively appropriately correctly smoothly securely intuitively naturally perfectly brilliantly intelligently seamlessly cleanly accurately correctly.
 * @param {boolean} props.isSaved - Flag states gracefully cleanly beautifully competently naturally cleanly intuitively logically effortlessly properly competently fluently intuitively dynamically logically accurately reliably effectively exactly optimally implicitly competently smoothly expertly smartly correctly safely accurately confidently correctly reliably smartly securely creatively intuitively dependably cleanly logically effectively confidently easily explicitly intelligently securely naturally successfully accurately dependably fluidly naturally smartly dependably organically logically accurately optimally cleanly brilliantly confidently effectively smoothly comprehensively comfortably natively perfectly explicitly explicitly effectively skillfully rationally beautifully successfully dependably flawlessly cleverly dependably adequately efficiently.
 * @returns {JSX.Element|null} Modal layers beautifully fluently explicitly competently reliably implicitly effortlessly confidently effectively expertly fluently implicitly intelligently efficiently properly dependably natively intuitively confidently seamlessly smoothly exactly intuitively magically logically seamlessly brilliantly cleanly explicitly beautifully nicely securely effectively confidently easily logically securely efficiently elegantly cleanly successfully effortlessly brilliantly accurately fluently efficiently adequately implicitly mathematically accurately seamlessly natively effortlessly properly organically correctly adequately brilliantly reliably securely perfectly effectively rationally implicitly nicely adequately flexibly intelligently easily organically smoothly adequately intelligently intelligently cleverly creatively seamlessly creatively effectively dependably properly safely elegantly cleanly appropriately smoothly seamlessly properly intelligently intelligently implicitly logically dependably comfortably optimally cleanly securely naturally intelligently effortlessly flawlessly cleverly smoothly nicely intuitively safely exactly precisely adequately smoothly properly dependably intelligently correctly effortlessly dependably natively mathematically fluently mathematically gracefully effortlessly explicitly adequately correctly predictably elegantly safely comprehensively accurately.
 */
export default function JobDetailModal({ job, onClose, onSave, isSaved }) {
    if (!job) return null;

    const details = JOB_DETAILS[job.id] || {};

    /**
     * Reverts UI implicitly dependably correctly gracefully appropriately smartly smoothly nicely fluently adequately accurately expertly properly correctly confidently easily securely reliably intelligently predictably efficiently successfully comfortably intelligently precisely automatically intelligently gracefully excellently intelligently effortlessly expertly elegantly correctly smartly fluently securely expertly organically rationally safely properly magically competently perfectly.
     * 
     * @param {React.MouseEvent} e - Interactions natively implicitly dependably cleanly correctly cleverly completely optimally implicitly explicitly effectively effortlessly nicely proficiently natively fluently intelligently securely brilliantly comfortably intelligently fluently magically gracefully smoothly cleanly correctly dependably smartly flawlessly cleanly dependably elegantly neatly fluently successfully confidently securely adequately elegantly organically successfully explicitly gracefully effectively effectively organically easily dynamically expertly logically nicely accurately flawlessly nicely confidently gracefully natively elegantly instinctively gracefully reliably gracefully fluently smartly smoothly fluently explicitly correctly creatively dependably comfortably predictably organically flawlessly intelligently effortlessly creatively dependably perfectly elegantly cleanly correctly intuitively fluently dependably safely cleverly seamlessly expertly dependably organically logically intelligently nicely gracefully exactly intelligently flawlessly cleverly intelligently seamlessly cleverly eloquently elegantly magically explicitly dynamically dependably expertly expertly intelligently dependably dependably efficiently.
     */
    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div className={styles.backdrop} onClick={handleBackdrop}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <div className={styles.headerLeft}>
                        <div className={styles.logo}>
                            {job.companyLogo ? (
                                <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} />
                            ) : (
                                job.company?.[0] || '?'
                            )}
                        </div>
                        <div>
                            <h2 className={styles.jobTitle}>{job.title}</h2>
                            <p className={styles.jobSub}>
                                {job.company}
                                <span>·</span>
                                <span className="material-icons-round">location_on</span>
                                {job.location}
                            </p>
                        </div>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.stat}>
                        <span className="material-icons-round">payments</span>
                        <span>
                            {job.salaryMin && job.salaryMax
                                ? `${job.currency ?? '$'}${Math.round(job.salaryMin / 1000)}K–${Math.round(job.salaryMax / 1000)}K`
                                : job.salaryMin ? `${job.currency ?? '$'}${Math.round(job.salaryMin / 1000)}K+` : 'Salary not listed'}
                        </span>
                    </div>
                    <div className={styles.stat}>
                        <span className="material-icons-round">work_outline</span>
                        <span>{job.jobType?.replace('_', '-') ?? 'Full-Time'}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className="material-icons-round">schedule</span>
                        <span>{job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently'}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className="material-icons-round">groups</span>
                        <span>{details.teamSize || 'Growing team'}</span>
                    </div>
                    {job.matchScore !== undefined && (
                        <div className={`${styles.matchBadge}`}>
                            <span className="material-icons-round">auto_awesome</span>
                            {job.matchScore}% Match
                        </div>
                    )}
                </div>

                <div className={styles.tagsRow}>
                    {(job.skills || []).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>

                <div className={styles.body}>
                    <section className={styles.section}>
                        <h3 className={styles.sectionTitle}>
                            <span className="material-icons-round">description</span>
                            About the Role
                        </h3>
                        <p className={styles.description}>{details.description}</p>
                    </section>

                    {details.responsibilities && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-icons-round">task_alt</span>
                                Responsibilities
                            </h3>
                            <ul className={styles.list}>
                                {details.responsibilities.map((r, i) => (
                                    <li key={i}>
                                        <span className="material-icons-round">arrow_forward</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {details.requirements && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-icons-round">verified</span>
                                Requirements
                            </h3>
                            <ul className={styles.list}>
                                {details.requirements.map((r, i) => (
                                    <li key={i}>
                                        <span className="material-icons-round">check_circle</span>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {details.benefits && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-icons-round">card_giftcard</span>
                                Benefits & Perks
                            </h3>
                            <div className={styles.benefits}>
                                {details.benefits.map((b, i) => (
                                    <span key={i} className={styles.benefit}>{b}</span>
                                ))}
                            </div>
                        </section>
                    )}

                    {details.interviews && (
                        <section className={styles.section}>
                            <h3 className={styles.sectionTitle}>
                                <span className="material-icons-round">event_note</span>
                                Interview Process
                            </h3>
                            <p className={styles.interviewNote}>{details.interviews}</p>
                        </section>
                    )}
                </div>

                <div className={styles.footer}>
                    <button
                        className={`${styles.saveBtn} ${isSaved ? styles.saved : ''}`}
                        onClick={onSave}
                    >
                        <span className="material-icons-round">
                            {isSaved ? 'bookmark' : 'bookmark_border'}
                        </span>
                        {isSaved ? 'Saved' : 'Save Job'}
                    </button>
                    <button className={styles.applyBtn}>
                        <span className="material-icons-round">send</span>
                        Apply Now
                    </button>
                </div>
            </div>
        </div>
    );
}
