import { PrismaClient, AuthProvider, JobType, ExperienceLevel, RemotePreference, SkillProficiency, ApplicationStatus, NotificationType, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...\n');

    // ─── Clean existing data ──────────────────────────────
    console.log('🧹 Clearing existing data...');
    await prisma.notification.deleteMany();
    await prisma.jobAlert.deleteMany();
    await prisma.userActivity.deleteMany();
    await prisma.chatHistory.deleteMany();
    await prisma.jobApplication.deleteMany();
    await prisma.savedJob.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.education.deleteMany();
    await prisma.workExperience.deleteMany();
    await prisma.userSkill.deleteMany();
    await prisma.skill.deleteMany();
    await prisma.profile.deleteMany();
    await prisma.user.deleteMany();
    await prisma.jobsCache.deleteMany();
    await prisma.company.deleteMany();
    await prisma.marketInsightsCache.deleteMany();
    console.log('✅ Database cleared\n');

    // ─── Skills ───────────────────────────────────────────
    console.log('🛠️  Creating skills...');
    const skills = await Promise.all([
        prisma.skill.create({ data: { name: 'React', category: 'Frontend', aliases: ['React.js', 'ReactJS'] } }),
        prisma.skill.create({ data: { name: 'TypeScript', category: 'Language', aliases: ['TS'] } }),
        prisma.skill.create({ data: { name: 'Node.js', category: 'Backend', aliases: ['Node', 'NodeJS'] } }),
        prisma.skill.create({ data: { name: 'Python', category: 'Language', aliases: ['Python3'] } }),
        prisma.skill.create({ data: { name: 'PostgreSQL', category: 'Database', aliases: ['Postgres', 'PG'] } }),
        prisma.skill.create({ data: { name: 'AWS', category: 'Cloud', aliases: ['Amazon Web Services'] } }),
        prisma.skill.create({ data: { name: 'Docker', category: 'DevOps', aliases: ['Containerization'] } }),
        prisma.skill.create({ data: { name: 'Figma', category: 'Design', aliases: [] } }),
        prisma.skill.create({ data: { name: 'GraphQL', category: 'API', aliases: [] } }),
        prisma.skill.create({ data: { name: 'Machine Learning', category: 'AI', aliases: ['ML'] } }),
        prisma.skill.create({ data: { name: 'Kubernetes', category: 'DevOps', aliases: ['K8s'] } }),
        prisma.skill.create({ data: { name: 'Next.js', category: 'Frontend', aliases: ['NextJS'] } }),
        prisma.skill.create({ data: { name: 'MongoDB', category: 'Database', aliases: ['Mongo'] } }),
        prisma.skill.create({ data: { name: 'Redis', category: 'Database', aliases: [] } }),
        prisma.skill.create({ data: { name: 'Vue.js', category: 'Frontend', aliases: ['Vue', 'VueJS'] } }),
    ]);
    console.log(`✅ Created ${skills.length} skills\n`);

    // ─── Companies ────────────────────────────────────────
    console.log('🏢 Creating companies...');
    const companies = await Promise.all([
        prisma.company.create({ data: { name: 'Tech Giants', logo: 'T', website: 'https://techgiants.io', industry: 'Technology', size: '1000-5000', description: 'Leading enterprise software solutions company.', rating: 4.5, workLifeBalance: 4.2, locations: ['Mountain View', 'Seattle', 'Remote'] } }),
        prisma.company.create({ data: { name: 'Global Commerce', logo: 'G', website: 'https://globalcommerce.com', industry: 'E-commerce', size: '5000+', description: 'Next-generation e-commerce platform for global markets.', rating: 4.1, workLifeBalance: 3.8, locations: ['Seattle', 'New York'] } }),
        prisma.company.create({ data: { name: 'NeuralStack', logo: 'N', website: 'https://neuralstack.ai', industry: 'AI / ML', size: '100-500', description: 'Cutting-edge AI startup building LLM-powered products.', rating: 4.8, workLifeBalance: 4.5, locations: ['Remote', 'San Francisco'] } }),
        prisma.company.create({ data: { name: 'InfraGlobal', logo: 'I', website: 'https://infraglobal.dev', industry: 'Cloud Infrastructure', size: '500-1000', description: 'Cloud-native infrastructure solutions for modern teams.', rating: 4.3, workLifeBalance: 4.0, locations: ['Remote', 'Austin'] } }),
        prisma.company.create({ data: { name: 'LaunchPad', logo: 'L', website: 'https://launchpad.design', industry: 'Product Design', size: '50-200', description: 'Design-first product studio for ambitious founders.', rating: 4.6, workLifeBalance: 4.7, locations: ['Seattle', 'New York'] } }),
    ]);
    console.log(`✅ Created ${companies.length} companies\n`);

    // ─── Jobs Cache ───────────────────────────────────────
    console.log('💼 Creating job listings...');
    const jobsData = [
        { externalId: 'job_001', source: 'adzuna', title: 'Senior React Developer', company: 'Tech Giants', companyLogo: 'T', location: 'Mountain View', description: 'Build scalable React applications for enterprise clients. Work with a talented team to deliver top-notch user experiences.', salaryMin: 140000, salaryMax: 180000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.SENIOR, isRemote: false, skills: ['React', 'TypeScript', 'GraphQL', 'Node.js'], applyUrl: 'https://techgiants.io/careers/react-dev', postedAt: new Date('2026-02-28') },
        { externalId: 'job_002', source: 'jsearch', title: 'Full-Stack Engineer', company: 'Global Commerce', companyLogo: 'G', location: 'Seattle', description: 'Join our e-commerce platform team to build end-to-end features using React and Node.js.', salaryMin: 130000, salaryMax: 165000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.MID, isRemote: false, skills: ['React', 'Node.js', 'PostgreSQL', 'Redis'], applyUrl: 'https://globalcommerce.com/jobs/fullstack', postedAt: new Date('2026-02-27') },
        { externalId: 'job_003', source: 'adzuna', title: 'AI / ML Engineer', company: 'NeuralStack', companyLogo: 'N', location: 'Remote', description: 'Design and train large language models for production use. Work closely with research and product teams.', salaryMin: 155000, salaryMax: 200000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.SENIOR, isRemote: true, skills: ['Python', 'Machine Learning', 'Docker', 'AWS'], applyUrl: 'https://neuralstack.ai/careers/ml-engineer', postedAt: new Date('2026-03-01') },
        { externalId: 'job_004', source: 'jsearch', title: 'Cloud DevOps Engineer', company: 'InfraGlobal', companyLogo: 'I', location: 'Remote', description: 'Maintain and scale cloud infrastructure across AWS and GCP. Champion CI/CD best practices.', salaryMin: 115000, salaryMax: 145000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.MID, isRemote: true, skills: ['AWS', 'Kubernetes', 'Docker', 'Python'], applyUrl: 'https://infraglobal.dev/jobs/devops', postedAt: new Date('2026-02-26') },
        { externalId: 'job_005', source: 'adzuna', title: 'Product Designer', company: 'LaunchPad', companyLogo: 'L', location: 'Seattle', description: 'Lead product design from discovery to delivery. Create beautiful, accessible interfaces using Figma.', salaryMin: 105000, salaryMax: 140000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.MID, isRemote: false, skills: ['Figma', 'React', 'TypeScript'], applyUrl: 'https://launchpad.design/jobs/designer', postedAt: new Date('2026-03-01') },
        { externalId: 'job_006', source: 'jsearch', title: 'Backend Engineer (Node.js)', company: 'Tech Giants', companyLogo: 'T', location: 'Mountain View', description: 'Build RESTful APIs and microservices using Node.js and TypeScript. PostgreSQL and Redis experience required.', salaryMin: 120000, salaryMax: 155000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.MID, isRemote: false, skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'], applyUrl: 'https://techgiants.io/careers/backend', postedAt: new Date('2026-02-25') },
        { externalId: 'job_007', source: 'adzuna', title: 'Frontend Architect', company: 'Global Commerce', companyLogo: 'G', location: 'Remote', description: 'Own the frontend architecture for our e-commerce platform serving 10M+ users globally.', salaryMin: 145000, salaryMax: 185000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.LEAD, isRemote: true, skills: ['React', 'Next.js', 'TypeScript', 'GraphQL'], applyUrl: 'https://globalcommerce.com/jobs/fe-architect', postedAt: new Date('2026-02-24') },
        { externalId: 'job_008', source: 'jsearch', title: 'Data Engineer', company: 'NeuralStack', companyLogo: 'N', location: 'San Francisco', description: 'Design and maintain data pipelines to power our AI training workflows.', salaryMin: 130000, salaryMax: 165000, currency: 'USD', jobType: JobType.FULL_TIME, experienceLevel: ExperienceLevel.MID, isRemote: false, skills: ['Python', 'PostgreSQL', 'AWS', 'Machine Learning'], applyUrl: 'https://neuralstack.ai/careers/data-engineer', postedAt: new Date('2026-02-28') },
    ];

    const jobs = await Promise.all(jobsData.map(j => prisma.jobsCache.create({ data: j })));
    console.log(`✅ Created ${jobs.length} job listings\n`);

    // ─── Users ────────────────────────────────────────────
    console.log('👤 Creating users...');
    const passwordHash = await bcrypt.hash('Password123!', 10);

    const alex = await prisma.user.create({
        data: {
            email: 'alex.rivera@jobfor.dev',
            passwordHash,
            authProvider: AuthProvider.EMAIL,
            role: UserRole.USER,
            isEmailVerified: true,
            lastLoginAt: new Date(),
            profile: {
                create: {
                    firstName: 'Alex',
                    lastName: 'Rivera',
                    phone: '+1-555-0101',
                    headline: 'Senior Product Designer · Ex-Google · Figma Certified',
                    summary: 'Passionate product designer with 7 years of experience creating intuitive digital experiences. Specialized in design systems and accessibility.',
                    currentCompany: 'Creative Labs Agency',
                    currentTitle: 'Senior Product Designer',
                    experienceYears: 7,
                    linkedinUrl: 'https://linkedin.com/in/alexrivera',
                    githubUrl: 'https://github.com/alexrivera',
                    portfolioUrl: 'https://alexrivera.design',
                    preferredLocations: ['Seattle', 'Remote', 'San Francisco'],
                    remotePreference: RemotePreference.HYBRID,
                    expectedSalaryMin: 120000,
                    expectedSalaryMax: 160000,
                    preferredJobTypes: [JobType.FULL_TIME],
                    profileCompletion: 92,
                }
            }
        },
        include: { profile: true }
    });

    const sarah = await prisma.user.create({
        data: {
            email: 'sarah.chen@jobfor.dev',
            passwordHash,
            authProvider: AuthProvider.EMAIL,
            role: UserRole.PREMIUM,
            isEmailVerified: true,
            lastLoginAt: new Date(),
            profile: {
                create: {
                    firstName: 'Sarah',
                    lastName: 'Chen',
                    phone: '+1-555-0202',
                    headline: 'Full-Stack Engineer · React + Node.js · Open Source Contributor',
                    summary: 'Full-stack engineer specializing in scalable web applications. Love open source and building developer tools.',
                    currentCompany: 'DataFlow Inc',
                    currentTitle: 'Software Engineer II',
                    experienceYears: 5,
                    linkedinUrl: 'https://linkedin.com/in/sarahchen',
                    githubUrl: 'https://github.com/sarahchen-dev',
                    preferredLocations: ['Remote', 'New York'],
                    remotePreference: RemotePreference.REMOTE,
                    expectedSalaryMin: 130000,
                    expectedSalaryMax: 175000,
                    preferredJobTypes: [JobType.FULL_TIME, JobType.CONTRACT],
                    profileCompletion: 85,
                }
            }
        },
        include: { profile: true }
    });

    const marcus = await prisma.user.create({
        data: {
            email: 'marcus.johnson@jobfor.dev',
            passwordHash,
            authProvider: AuthProvider.EMAIL,
            role: UserRole.USER,
            isEmailVerified: true,
            lastLoginAt: new Date(Date.now() - 86400000),
            profile: {
                create: {
                    firstName: 'Marcus',
                    lastName: 'Johnson',
                    phone: '+1-555-0303',
                    headline: 'ML Engineer · PyTorch · Building AI at Scale',
                    summary: 'Machine learning engineer with a focus on NLP and large language models. Previously at a top AI research lab.',
                    currentCompany: 'SteathAI Startup',
                    currentTitle: 'ML Engineer',
                    experienceYears: 4,
                    linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
                    preferredLocations: ['San Francisco', 'Remote'],
                    remotePreference: RemotePreference.REMOTE,
                    expectedSalaryMin: 150000,
                    expectedSalaryMax: 210000,
                    preferredJobTypes: [JobType.FULL_TIME],
                    profileCompletion: 78,
                }
            }
        },
        include: { profile: true }
    });

    console.log(`✅ Created 3 users (alex, sarah, marcus)\n`);

    // ─── User Skills ──────────────────────────────────────
    console.log('🎯 Assigning skills to users...');
    const skillMap = Object.fromEntries(skills.map(s => [s.name, s.id]));

    await Promise.all([
        // Alex — Designer
        prisma.userSkill.create({ data: { profileId: alex.profile!.id, skillId: skillMap['Figma'], proficiency: SkillProficiency.EXPERT, yearsOfExp: 7 } }),
        prisma.userSkill.create({ data: { profileId: alex.profile!.id, skillId: skillMap['React'], proficiency: SkillProficiency.INTERMEDIATE, yearsOfExp: 3 } }),
        prisma.userSkill.create({ data: { profileId: alex.profile!.id, skillId: skillMap['TypeScript'], proficiency: SkillProficiency.INTERMEDIATE, yearsOfExp: 2 } }),
        // Sarah — Full-stack
        prisma.userSkill.create({ data: { profileId: sarah.profile!.id, skillId: skillMap['React'], proficiency: SkillProficiency.EXPERT, yearsOfExp: 5 } }),
        prisma.userSkill.create({ data: { profileId: sarah.profile!.id, skillId: skillMap['Node.js'], proficiency: SkillProficiency.ADVANCED, yearsOfExp: 4 } }),
        prisma.userSkill.create({ data: { profileId: sarah.profile!.id, skillId: skillMap['TypeScript'], proficiency: SkillProficiency.ADVANCED, yearsOfExp: 3 } }),
        prisma.userSkill.create({ data: { profileId: sarah.profile!.id, skillId: skillMap['PostgreSQL'], proficiency: SkillProficiency.INTERMEDIATE, yearsOfExp: 3 } }),
        prisma.userSkill.create({ data: { profileId: sarah.profile!.id, skillId: skillMap['Docker'], proficiency: SkillProficiency.INTERMEDIATE, yearsOfExp: 2 } }),
        // Marcus — ML
        prisma.userSkill.create({ data: { profileId: marcus.profile!.id, skillId: skillMap['Python'], proficiency: SkillProficiency.EXPERT, yearsOfExp: 6 } }),
        prisma.userSkill.create({ data: { profileId: marcus.profile!.id, skillId: skillMap['Machine Learning'], proficiency: SkillProficiency.EXPERT, yearsOfExp: 4 } }),
        prisma.userSkill.create({ data: { profileId: marcus.profile!.id, skillId: skillMap['AWS'], proficiency: SkillProficiency.ADVANCED, yearsOfExp: 3 } }),
        prisma.userSkill.create({ data: { profileId: marcus.profile!.id, skillId: skillMap['Docker'], proficiency: SkillProficiency.INTERMEDIATE, yearsOfExp: 2 } }),
    ]);
    console.log('✅ Skills assigned\n');

    // ─── Work Experience ──────────────────────────────────
    console.log('💼 Adding work experience...');
    await Promise.all([
        prisma.workExperience.create({ data: { profileId: alex.profile!.id, company: 'Creative Labs Agency', title: 'Senior Product Designer', location: 'Seattle, WA', startDate: new Date('2021-03-01'), isCurrent: true, description: 'Leading design for 3 major product lines. Built a design system used across 5 teams.' } }),
        prisma.workExperience.create({ data: { profileId: alex.profile!.id, company: 'Google', title: 'UX Designer', location: 'Mountain View, CA', startDate: new Date('2018-06-01'), endDate: new Date('2021-02-28'), isCurrent: false, description: 'Designed core features for Google Maps and Google Search.' } }),
        prisma.workExperience.create({ data: { profileId: sarah.profile!.id, company: 'DataFlow Inc', title: 'Software Engineer II', location: 'New York, NY', startDate: new Date('2022-01-10'), isCurrent: true, description: 'Built real-time analytics dashboard serving 500K daily active users.' } }),
        prisma.workExperience.create({ data: { profileId: sarah.profile!.id, company: 'Startup Hub', title: 'Junior Developer', location: 'Remote', startDate: new Date('2020-05-01'), endDate: new Date('2021-12-31'), isCurrent: false, description: 'Developed React components and REST APIs for an early-stage SaaS product.' } }),
        prisma.workExperience.create({ data: { profileId: marcus.profile!.id, company: 'StealthAI Startup', title: 'ML Engineer', location: 'Remote', startDate: new Date('2023-02-01'), isCurrent: true, description: 'Building NLP pipelines and fine-tuning LLMs for enterprise clients.' } }),
        prisma.workExperience.create({ data: { profileId: marcus.profile!.id, company: 'AI Research Lab', title: 'Research Engineer', location: 'San Francisco, CA', startDate: new Date('2021-01-01'), endDate: new Date('2023-01-31'), isCurrent: false, description: 'Published 2 papers on transformer architecture optimizations.' } }),
    ]);
    console.log('✅ Work experience added\n');

    // ─── Education ────────────────────────────────────────
    console.log('🎓 Adding education...');
    await Promise.all([
        prisma.education.create({ data: { profileId: alex.profile!.id, institution: 'Rhode Island School of Design', degree: 'BFA', field: 'Graphic Design', startDate: new Date('2013-09-01'), endDate: new Date('2017-05-31'), grade: 'Honors' } }),
        prisma.education.create({ data: { profileId: sarah.profile!.id, institution: 'University of Washington', degree: 'BS', field: 'Computer Science', startDate: new Date('2016-09-01'), endDate: new Date('2020-06-30'), grade: '3.8 GPA' } }),
        prisma.education.create({ data: { profileId: marcus.profile!.id, institution: 'MIT', degree: 'MS', field: 'Computer Science (AI/ML)', startDate: new Date('2019-09-01'), endDate: new Date('2021-06-30'), grade: '4.0 GPA' } }),
    ]);
    console.log('✅ Education added\n');

    // ─── Certifications ───────────────────────────────────
    console.log('📜 Adding certifications...');
    await Promise.all([
        prisma.certification.create({ data: { profileId: alex.profile!.id, name: 'Figma Professional Certification', issuer: 'Figma', issueDate: new Date('2023-06-01'), credentialUrl: 'https://figma.com/cert/alex' } }),
        prisma.certification.create({ data: { profileId: sarah.profile!.id, name: 'AWS Certified Developer', issuer: 'Amazon Web Services', issueDate: new Date('2023-03-15'), expiryDate: new Date('2026-03-15'), credentialUrl: 'https://aws.amazon.com/cert/sarah' } }),
        prisma.certification.create({ data: { profileId: marcus.profile!.id, name: 'TensorFlow Developer Certificate', issuer: 'Google', issueDate: new Date('2022-11-01'), credentialUrl: 'https://tensorflow.org/cert/marcus' } }),
    ]);
    console.log('✅ Certifications added\n');

    // ─── Saved Jobs ───────────────────────────────────────
    console.log('🔖 Creating saved jobs...');
    await Promise.all([
        prisma.savedJob.create({ data: { userId: sarah.id, jobId: 'job_001', jobData: { title: 'Senior React Developer', company: 'Tech Giants', salary: '$140K–$180K' }, notes: 'Great company, strong culture', tags: ['top-pick', 'react'] } }),
        prisma.savedJob.create({ data: { userId: sarah.id, jobId: 'job_007', jobData: { title: 'Frontend Architect', company: 'Global Commerce', salary: '$145K–$185K' }, notes: 'Remote friendly!', tags: ['remote', 'leadership'] } }),
        prisma.savedJob.create({ data: { userId: alex.id, jobId: 'job_005', jobData: { title: 'Product Designer', company: 'LaunchPad', salary: '$105K–$140K' }, notes: 'Love their design portfolio', tags: ['design', 'dream-job'] } }),
        prisma.savedJob.create({ data: { userId: marcus.id, jobId: 'job_003', jobData: { title: 'AI / ML Engineer', company: 'NeuralStack', salary: '$155K–$200K' }, notes: 'Best ML opportunity seen this year!', tags: ['top-pick', 'ai'] } }),
    ]);
    console.log('✅ Saved jobs created\n');

    // ─── Job Applications ─────────────────────────────────
    console.log('📋 Creating job applications...');
    await Promise.all([
        prisma.jobApplication.create({ data: { userId: sarah.id, jobId: 'job_002', jobData: { title: 'Full-Stack Engineer', company: 'Global Commerce' }, status: ApplicationStatus.INTERVIEWING, appliedAt: new Date('2026-02-20'), interviewDate: new Date('2026-03-05') } }),
        prisma.jobApplication.create({ data: { userId: sarah.id, jobId: 'job_006', jobData: { title: 'Backend Engineer', company: 'Tech Giants' }, status: ApplicationStatus.APPLIED, appliedAt: new Date('2026-02-26') } }),
        prisma.jobApplication.create({ data: { userId: alex.id, jobId: 'job_005', jobData: { title: 'Product Designer', company: 'LaunchPad' }, status: ApplicationStatus.SCREENING, appliedAt: new Date('2026-02-22') } }),
        prisma.jobApplication.create({ data: { userId: marcus.id, jobId: 'job_003', jobData: { title: 'AI / ML Engineer', company: 'NeuralStack' }, status: ApplicationStatus.APPLIED, appliedAt: new Date('2026-03-01') } }),
        prisma.jobApplication.create({ data: { userId: marcus.id, jobId: 'job_008', jobData: { title: 'Data Engineer', company: 'NeuralStack' }, status: ApplicationStatus.OFFERED, appliedAt: new Date('2026-02-10'), interviewDate: new Date('2026-02-24') } }),
    ]);
    console.log('✅ Job applications created\n');

    // ─── Job Alerts ───────────────────────────────────────
    console.log('🔔 Creating job alerts...');
    await Promise.all([
        prisma.jobAlert.create({ data: { userId: sarah.id, name: 'Remote React Jobs', query: 'React developer', location: 'Remote', jobTypes: [JobType.FULL_TIME], remoteOnly: true, salaryMin: 120000, frequency: 'daily', isActive: true } }),
        prisma.jobAlert.create({ data: { userId: marcus.id, name: 'ML Engineer Roles', query: 'machine learning engineer', location: 'San Francisco', jobTypes: [JobType.FULL_TIME], salaryMin: 150000, frequency: 'weekly', isActive: true } }),
    ]);
    console.log('✅ Job alerts created\n');

    // ─── Notifications ────────────────────────────────────
    console.log('📢 Creating notifications...');
    await Promise.all([
        prisma.notification.create({ data: { userId: sarah.id, type: NotificationType.APPLICATION_UPDATE, title: 'Interview Scheduled!', message: 'Global Commerce has invited you to an interview for the Full-Stack Engineer role.', isRead: false } }),
        prisma.notification.create({ data: { userId: sarah.id, type: NotificationType.JOB_ALERT, title: '5 new React jobs match your alert', message: 'Check out the latest remote React developer openings.', isRead: true } }),
        prisma.notification.create({ data: { userId: marcus.id, type: NotificationType.APPLICATION_UPDATE, title: 'Offer Received! 🎉', message: 'Congratulations! NeuralStack has extended an offer for the Data Engineer position.', isRead: false } }),
        prisma.notification.create({ data: { userId: alex.id, type: NotificationType.AI_RECOMMENDATION, title: 'Profile 92% complete', message: 'Add your portfolio URL to reach 100% profile completion and get more matches.', isRead: false } }),
    ]);
    console.log('✅ Notifications created\n');

    // ─── Market Insights Cache ────────────────────────────
    console.log('📊 Creating market insights cache...');
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week
    await Promise.all([
        prisma.marketInsightsCache.create({ data: { key: 'salary:react-developer:remote', data: { avgSalary: 145000, minSalary: 100000, maxSalary: 200000, demand: 'High', trend: '+12% YoY' }, expiresAt: future } }),
        prisma.marketInsightsCache.create({ data: { key: 'salary:ml-engineer:san-francisco', data: { avgSalary: 185000, minSalary: 140000, maxSalary: 260000, demand: 'Very High', trend: '+23% YoY' }, expiresAt: future } }),
    ]);
    console.log('✅ Market insights cached\n');

    // ─── Summary ──────────────────────────────────────────
    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('─────────────────────────────────');
    console.log(`👤 Users:        3  (alex, sarah, marcus — password: Password123!)`);
    console.log(`🛠️  Skills:       ${skills.length}`);
    console.log(`🏢 Companies:    ${companies.length}`);
    console.log(`💼 Jobs:         ${jobs.length}`);
    console.log(`📋 Applications: 5`);
    console.log(`🔖 Saved Jobs:   4`);
    console.log(`🔔 Alerts:       2`);
    console.log(`📢 Notifications:4`);
    console.log('─────────────────────────────────');
    console.log('');
    console.log('🔑 Test login credentials:');
    console.log('   Email:    alex.rivera@jobfor.dev');
    console.log('   Password: Password123!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
