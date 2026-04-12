
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedAccounting() {
    console.log('Seeding Accounting Course...');

    // 1. Get Department
    const { data: dept } = await supabase.from('Department').select('id, schoolId').eq('slug', 'accounting-business-law').single();
    if (!dept) {
        console.error('Department accounting-business-law not found');
        return;
    }

    const sections = [
        {
            id: 'core-accounting',
            title: 'Core Accounting Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Accounting I & II:</strong> Introduction to double-entry bookkeeping, ledger maintenance, and financial statement preparation.</li>
                    <li><strong>Financial Accounting (I, II, III, & Advanced):</strong> Advanced partnership accounts, company accounts, mergers, acquisitions, and IFRS/IAS compliance.</li>
                    <li><strong>Cost Accounting (I & II):</strong> Cost classification, cost accumulation systems (job, process), inventory valuation, and budgetary control.</li>
                    <li><strong>Management Accounting (I & II):</strong> Using financial data for internal decision-making, variance analysis, and performance measurement.</li>
                    <li><strong>Auditing and Investigation (I & II):</strong> Principles of auditing, audit evidence, reporting, and forensic accounting.</li>
                    <li><strong>Taxation (I, II, & Advanced):</strong> Personal and corporate income tax, VAT, tax administration, and petroleum profits tax.</li>
                    <li><strong>Public Sector/Governmental Accounting:</strong> Accounting for government agencies, IPSAS, and non-profit organizations.</li>
                    <li><strong>Accounting Information Systems (AIS):</strong> Computerized accounting applications, data processing, and internal control systems.</li>
                    <li><strong>Accounting Theory:</strong> Conceptual framework, valuation models, and current issues in reporting.</li>
                </ul>
            `
        },
        {
            id: 'business-law',
            title: 'Business Law & Regulatory Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Principles of Law / Business Law:</strong> Legal structures of business and general legal principles.</li>
                    <li><strong>Commercial Law:</strong> Law of contract, agency, sale of goods, and bailment.</li>
                    <li><strong>Company Law / Corporate Law:</strong> Formation, management, and dissolution of companies.</li>
                    <li><strong>Bankruptcy and Executorship Law:</strong> Legal procedures for insolvency and estate management.</li>
                    <li><strong>Banking Laws and Regulations:</strong> Legal framework for financial institutions.</li>
                    <li><strong>Corporate Governance & Ethics:</strong> Ethical standards and compliance for directors and accountants.</li>
                    <li><strong>International Business Law:</strong> Legal aspects of cross-border trade.</li>
                </ul>
            `
        },
        {
            id: 'supporting',
            title: 'Supporting & Quantitative Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Business Mathematics/Statistics:</strong> Quantitative tools for business decisions, probability, and sampling.</li>
                    <li><strong>Financial Management/Corporate Finance:</strong> Working capital management, capital budgeting, and investment analysis.</li>
                    <li><strong>Economics (Micro & Macro):</strong> Fundamental economic principles for business.</li>
                    <li><strong>Business Communication:</strong> Effective communication in professional environments.</li>
                    <li><strong>Entrepreneurship/Business Development:</strong> Starting and managing small businesses.</li>
                </ul>
            `
        },
        {
            id: 'electives',
            title: 'Specialized/Elective Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Sustainability Accounting:</strong> Accounting for environmental and social impact.</li>
                    <li><strong>Oil and Gas Accounting:</strong> Specialized accounting for the energy sector.</li>
                    <li><strong>Forensic Accounting & Fraud Management:</strong> Techniques for detecting financial fraud.</li>
                    <li><strong>Strategic Management/Case Analysis:</strong> High-level strategic planning and business evaluation.</li>
                    <li><strong>Research Methodology:</strong> Techniques for researching accounting and business issues.</li>
                </ul>
            `
        }
    ];

    const courseData = {
        title: 'BSc Accounting & Business Law',
        slug: 'bsc-accounting-business-law',
        degreeLevel: 'BACHELOR',
        duration: '3 Years',
        language: 'English',
        description: 'A comprehensive program combining rigorous accounting training with a deep understanding of business law, preparing students for professional certification and leadership roles.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: sections,
        credits: 180,
        imageUrl: '/images/departments/placeholder-accounting.jpg' // Reusing dept image as placeholder
    };


    // --- Master's Degree ---
    const masterSections = [
        {
            id: 'adv-accounting',
            title: 'Advanced Accounting',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Advanced Financial Accounting:</strong> Complex consolidation and reporting.</li>
                    <li><strong>Advanced Management Accounting:</strong> Strategic decision support.</li>
                    <li><strong>International Financial Reporting Standards (IFRS):</strong> Global standards application.</li>
                    <li><strong>Forensic Accounting & Auditing:</strong> Fraud detection and investigation.</li>
                    <li><strong>Corporate Financial Reporting & Analysis:</strong> Financial health assessment.</li>
                    <li><strong>Accounting Information Systems:</strong> Advanced system design and control.</li>
                </ul>
            `
        },
        {
            id: 'business-law-gov',
            title: 'Business Law & Corporate Governance',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Business & Corporate Law:</strong> Advanced legal frameworks.</li>
                    <li><strong>Commercial Law & Contracts:</strong> Complex commercial agreements.</li>
                    <li><strong>Corporate Governance & Compliance:</strong> Regulatory adherence and board responsibilities.</li>
                    <li><strong>Employment & Labor Law:</strong> Workforce regulations.</li>
                    <li><strong>Intellectual Property Law:</strong> Patents, trademarks, and copyrights.</li>
                    <li><strong>International Business Law:</strong> Cross-border legal issues.</li>
                </ul>
            `
        },
        {
            id: 'finance-strategy',
            title: 'Finance & Strategic Management',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Corporate Finance & Risk Management:</strong> Financial strategy and hedging.</li>
                    <li><strong>Taxation & Tax Planning:</strong> Strategic tax minimization.</li>
                    <li><strong>Financial Statement Analysis & Valuation:</strong> Business valuation techniques.</li>
                    <li><strong>Strategic Management for Accountants:</strong> Integrating finance with strategy.</li>
                    <li><strong>Business Ethics & Regulatory Compliance:</strong> Ethical decision making.</li>
                </ul>
            `
        },
        {
            id: 'tech-data',
            title: 'Technology & Data in Accounting',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Accounting Information Systems (AIS):</strong> Deep dive into ERPs.</li>
                    <li><strong>Financial Modelling & Data Analytics:</strong> Predictive analysis.</li>
                    <li><strong>Digital Finance & E-Accounting:</strong> Cloud accounting and fintech.</li>
                    <li><strong>Auditing with Technology:</strong> CAATs and digital audit trails.</li>
                </ul>
            `
        },
        {
            id: 'electives',
            title: 'Specialization & Elective Courses',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li>Mergers & Acquisitions Accounting</li>
                    <li>International Taxation</li>
                    <li>Corporate Law & Governance</li>
                    <li>Business Risk & Forensic Investigation</li>
                    <li>Advanced Auditing Techniques</li>
                </ul>
            `
        },
        {
            id: 'research',
            title: 'Research & Professional Development',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Research Methods in Accounting & Business Law:</strong> Academic and applied research.</li>
                    <li><strong>Professional Writing & Reporting:</strong> Communication for executives.</li>
                    <li><strong>Case Studies & Industry Analysis:</strong> Real-world problem solving.</li>
                    <li><strong>Graduate Seminar:</strong> Contemporary issues.</li>
                </ul>
            `
        },
        {
            id: 'capstone',
            title: 'Capstone',
            content: `
                <ul class="list-disc pl-5 space-y-2">
                    <li><strong>Master’s Thesis / Applied Research Project:</strong> Independent study.</li>
                    <li><strong>Professional Internship (optional):</strong> Industry placement.</li>
                </ul>
            `
        }
    ];

    const masterData = {
        title: 'Master of Science in Accounting & Business Law',
        slug: 'msc-accounting-business-law',
        degreeLevel: 'MASTER',
        duration: '2 Years',
        language: 'English',
        description: 'An advanced program blending strategic financial management with in-depth legal expertise for higher-level corporate and advisory roles.',
        departmentId: dept.id,
        schoolId: dept.schoolId,
        sections: masterSections,
        credits: 120,
        imageUrl: '/images/departments/placeholder-accounting.jpg',
        careerPaths: 'Chartered Accountant, Corporate Legal Advisor, Financial Controller, Compliance Officer, Tax Consultant'
    };

    const { error: bErr } = await supabase.from('Course').upsert(courseData, { onConflict: 'slug' });
    if (bErr) console.error('Error upserting BSc:', bErr);
    else console.log('✅ Successfully seeded "BSc Accounting & Business Law".');

    const { error: mErr } = await supabase.from('Course').upsert(masterData, { onConflict: 'slug' });
    if (mErr) console.error('Error upserting MSc:', mErr);
    else console.log('✅ Successfully seeded "MSc Accounting & Business Law".');
}

seedAccounting();
