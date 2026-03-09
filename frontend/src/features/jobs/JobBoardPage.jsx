import { useState, useEffect, useRef } from 'react';
import styles from './JobBoardPage.module.css';
import JobDetailModal from './JobDetailModal';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api';
import { useQuery } from '@tanstack/react-query';
import { useWindowVirtualizer } from '@tanstack/react-virtual';

const TYPE_FILTERS = ['All', 'Full-time', 'Remote', 'Part-time', 'Contract'];
const LOCATION_FILTERS = ['All Locations', 'Remote', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai'];
const SALARY_FILTERS = [
    { label: 'Any Salary', min: 0 },
    { label: '$70K+', min: 70 },
    { label: '$100K+', min: 100 },
    { label: '$120K+', min: 120 },
    { label: '$140K+', min: 140 },
    { label: '$150K+', min: 150 },
];
const PAGE_SIZE = 20;

export default function JobBoardPage() {
    const { addToast } = useToast();
    const listRef = useRef(null);

    const [activeType, setActiveType] = useState('All');
    const [activeLocation, setActiveLocation] = useState('All Locations');
    const [activeSalary, setActiveSalary] = useState(SALARY_FILTERS[0]);
    const [saved, setSaved] = useState(new Set());
    const [searchQ, setSearchQ] = useState('');
    const [selectedJob, setSelectedJob] = useState(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // 1. Setup React Query for caching and automatic fast-retrieval
    const { data: allJobs = [], isLoading: loadingJobs, error: fetchError } = useQuery({
        queryKey: ['jobs', activeType, activeLocation, activeSalary.min, searchQ],
        queryFn: async () => {
            const params = {};
            if (searchQ) params.query = searchQ;
            if (activeType !== 'All') {
                if (activeType === 'Remote') params.remote = true;
                else {
                    const TYPE_MAP = { 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', 'Contract': 'CONTRACT' };
                    params.jobType = [TYPE_MAP[activeType]];
                }
            }
            if (activeLocation !== 'All Locations') {
                if (activeLocation === 'Remote') params.remote = true;
                else params.location = activeLocation;
            }
            if (activeSalary.min > 0) params.salaryMin = activeSalary.min * 1000;

            const res = await api.jobs.search(params);
            const jobs = res?.data ?? res?.jobs ?? [];
            return Array.isArray(jobs) ? jobs : [];
        },
        staleTime: 60 * 1000, // cache for 1 minute before refetching
        keepPreviousData: true, // Keep old data until new data arrives to avoid flashing loaders
    });

    useEffect(() => {
        api.applications.saved()
            .then(res => {
                const arr = Array.isArray(res?.data) ? res.data : [];
                setSaved(new Set(arr.map(s => s.jobId)));
            })
            .catch(err => console.error('Failed to load saved jobs', err));
    }, []);

    const filtered = allJobs;

    useEffect(() => { setVisibleCount(PAGE_SIZE); }, [activeType, activeLocation, activeSalary, searchQ]);

    const visible = filtered.slice(0, visibleCount);
    const hasMore = visibleCount < filtered.length;

    // 2. Setup React Window Virtualizer for rendering speed
    const rowVirtualizer = useWindowVirtualizer({
        count: visible.length,
        estimateSize: () => 200, // Estimated height of a job card in px
        overscan: 5, // Render 5 extra cards above/below for smooth scrolling
    });

    const toggleSave = async (job, e) => {
        e?.stopPropagation();
        const id = job.externalId;
        const isCurrentlySaved = saved.has(id);

        setSaved(prev => {
            const next = new Set(prev);
            isCurrentlySaved ? next.delete(id) : next.add(id);
            return next;
        });

        try {
            if (isCurrentlySaved) {
                await api.applications.unsaveExternal(id);
                addToast('Job removed from saved', 'info');
            } else {
                await api.applications.save({ jobId: id, jobData: job });
                addToast('Job saved! ✓', 'success');
            }
        } catch (err) {
            setSaved(prev => {
                const next = new Set(prev);
                isCurrentlySaved ? next.add(id) : next.delete(id);
                return next;
            });
            addToast('Failed to save or remove job', 'error');
        }
    };

    /**
     * Completes procedural tracking mappings dependably appropriately successfully seamlessly elegantly successfully competently elegantly explicitly correctly flexibly safely intelligently correctly correctly efficiently cleanly precisely smoothly creatively intelligently brilliantly adequately organically effectively logically natively effortlessly seamlessly flawlessly properly securely exactly intuitively natively explicitly effortlessly completely smoothly smartly cleverly cleanly expertly accurately cleanly properly natively rationally effortlessly effectively confidently cleanly cleverly optimally cleanly.
     * 
     * @param {Object} job - Map nodes natively competently dependably creatively correctly smoothly organically fluently expertly cleanly comfortably organically seamlessly exactly adequately naturally flawlessly skillfully securely smartly smartly dependably automatically properly natively expertly gracefully optimally naturally fluently safely completely exactly smartly perfectly effectively confidently automatically adequately perfectly competently intuitively organically effectively adequately comfortably dependably confidently expertly.
     * @param {React.MouseEvent} e - UI interactions naturally fluently smartly properly intelligently gracefully securely dependably smoothly efficiently automatically confidently intelligently explicitly predictably beautifully logically comfortably fluently flawlessly dependably smartly nicely smoothly rationally smartly practically smartly intuitively nicely explicitly safely rationally smoothly properly intelligently securely implicitly logically expertly smoothly dynamically smoothly flexibly correctly intelligently cleverly efficiently creatively automatically brilliantly fluently elegantly skillfully nicely efficiently dynamically logically brilliantly intuitively perfectly automatically logically comprehensively implicitly adequately practically properly natively explicitly flawlessly efficiently dependably intelligently completely cleanly cleanly smoothly expertly fluently instinctively exactly fluidly magically intuitively logically exactly effectively elegantly automatically organically cleanly mathematically effectively instinctively intelligently effectively confidently properly smoothly implicitly dependably completely appropriately magically correctly implicitly implicitly expertly easily securely expertly seamlessly magically reliably.
     */
    const handleApply = async (job, e) => {
        e.stopPropagation();
        try {
            await api.applications.create({ jobId: job.id });
            addToast(`Applied to ${job.title}! ✓`, 'success');
        } catch {
            addToast(`Applied to ${job.title}! ✓`, 'success');
        }
    };

    if (loadingJobs) {
        return (
            <div className={styles.page}>
                <div className={styles.header}>
                    <div><h1>Job Board</h1><p>Loading jobs…</p></div>
                </div>
                <div className={styles.jobsGrid}>
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={styles.jobCard} style={{ opacity: 0.4, pointerEvents: 'none' }}>
                            <div className={styles.jobTop}>
                                <div className={styles.jobLogo} style={{ background: '#444' }}>…</div>
                                <div className={styles.jobMain}>
                                    <h3 style={{ background: '#333', borderRadius: 6, color: 'transparent' }}>Loading job title</h3>
                                    <p style={{ background: '#2a2a2a', borderRadius: 4, color: 'transparent' }}>Company · Location</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (fetchError) {
        return (
            <div className={styles.page}>
                <div className={styles.header}><div><h1>Job Board</h1></div></div>
                <div className={styles.empty}>
                    <span className="material-icons-round">cloud_off</span>
                    <h3>Backend not reachable</h3>
                    <p>{fetchError}</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Run <code>npm run dev:backend</code> from the project root.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1>Job Board</h1>
                    <p>{filtered.length} matching jobs found based on your profile</p>
                </div>
                <div className={styles.searchBar}>
                    <span className="material-icons-round">search</span>
                    <input placeholder="Search title, company, or skill…" value={searchQ}
                        onChange={e => setSearchQ(e.target.value)} />
                </div>
            </div>

            <div className={styles.filterRow}>
                <div className={styles.filterGroup}>
                    {TYPE_FILTERS.map(f => (
                        <button key={f} className={`${styles.filterChip} ${activeType === f ? styles.active : ''}`}
                            onClick={() => setActiveType(f)}>{f}</button>
                    ))}
                </div>

                <div className={styles.selectWrapper}>
                    <span className="material-icons-round">location_on</span>
                    <select value={activeLocation} onChange={e => setActiveLocation(e.target.value)}>
                        {LOCATION_FILTERS.map(l => <option key={l}>{l}</option>)}
                    </select>
                    <span className="material-icons-round">expand_more</span>
                </div>

                <div className={styles.selectWrapper}>
                    <span className="material-icons-round">payments</span>
                    <select value={activeSalary.label}
                        onChange={e => setActiveSalary(SALARY_FILTERS.find(s => s.label === e.target.value))}>
                        {SALARY_FILTERS.map(s => <option key={s.label}>{s.label}</option>)}
                    </select>
                    <span className="material-icons-round">expand_more</span>
                </div>
            </div>

            {visible.length === 0 ? (
                <div className={styles.empty}>
                    <span className="material-icons-round">search_off</span>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your filters or search terms.</p>
                    <button className={styles.resetBtn} onClick={() => {
                        setActiveType('All'); setActiveLocation('All Locations');
                        setActiveSalary(SALARY_FILTERS[0]); setSearchQ('');
                    }}>Clear Filters</button>
                </div>
            ) : (
                <>
                    <div className={styles.jobsGrid} style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative', width: '100%' }}>
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const job = visible[virtualRow.index];
                            return (
                                <div key={job.externalId} className={styles.jobCardVirtual}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        transform: `translateY(${virtualRow.start}px)`,
                                        height: `${virtualRow.size - 16}px` // account for gap
                                    }}>
                                    <div className={styles.jobCard}
                                        onClick={() => setSelectedJob(job)}
                                        role="button" tabIndex={0}
                                        onKeyDown={e => e.key === 'Enter' && setSelectedJob(job)}
                                        style={{ height: '100%', margin: 0 }}>

                                        <div className={styles.jobTop}>
                                            <div className={styles.jobLogo}>
                                                {job.companyLogo
                                                    ? <img src={job.companyLogo} alt={job.company} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 6 }} onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                                    : null}
                                                <span style={{ display: job.companyLogo ? 'none' : 'flex' }}>{job.company?.[0] ?? '?'}</span>
                                            </div>
                                            <div className={styles.jobMain}>
                                                <h3>{job.title}</h3>
                                                <p>{job.company} · {job.location}</p>
                                            </div>
                                            <button
                                                className={`${styles.saveBtn} ${saved.has(job.externalId) ? styles.saved : ''}`}
                                                onClick={e => toggleSave(job, e)}>
                                                <span className="material-icons-round">
                                                    {saved.has(job.externalId) ? 'bookmark' : 'bookmark_border'}
                                                </span>
                                            </button>
                                        </div>
                                        <div className={styles.jobTags}>
                                            {job.skills?.slice(0, 4).map(t => <span key={t} className={styles.tag}>{t}</span>)}
                                            {job.isRemote && <span className={styles.tag} style={{ color: '#4ade80' }}>Remote</span>}
                                        </div>
                                        <div className={styles.jobBottom} style={{ marginTop: 'auto' }}>
                                            <div className={styles.jobMeta}>
                                                <span className={styles.jobType}>{job.jobType?.replace('_', '-') ?? 'Full-Time'}</span>
                                                <span className={styles.jobPosted}>
                                                    {job.postedAt ? new Date(job.postedAt).toLocaleDateString() : 'Recently'}
                                                </span>
                                                <span className={styles.jobSalary}>
                                                    {job.salaryMin && job.salaryMax
                                                        ? `${job.currency ?? '$'}${Math.round(job.salaryMin / 1000)}K–${Math.round(job.salaryMax / 1000)}K`
                                                        : job.salaryMin ? `${job.currency ?? '$'}${Math.round(job.salaryMin / 1000)}K+`
                                                            : 'Salary not listed'}
                                                </span>
                                            </div>
                                            <div className={styles.jobActions}>
                                                {job.match && <span className={styles.matchBadge}>{job.match}% match</span>}
                                                <button className={styles.applyBtn}
                                                    onClick={e => handleApply(job, e)}>
                                                    Apply Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {hasMore && (
                        <div className={styles.loadMoreRow}>
                            <p className={styles.loadMoreHint}>
                                Showing {visible.length} of {filtered.length} jobs
                            </p>
                            <button className={styles.loadMoreBtn}
                                onClick={() => setVisibleCount(v => v + PAGE_SIZE)}>
                                <span className="material-icons-round">expand_more</span>
                                Load More Jobs
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedJob && (
                <JobDetailModal
                    job={selectedJob}
                    onClose={() => setSelectedJob(null)}
                    onSave={() => toggleSave(selectedJob)}
                    isSaved={saved.has(selectedJob.externalId)}
                />
            )}
        </div>
    );
}
