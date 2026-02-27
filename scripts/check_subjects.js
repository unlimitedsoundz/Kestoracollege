require('dotenv').config({ path: '.env' });
const { createClient } = require('@supabase/supabase-js');
const c = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

(async () => {
    // First check what semester values look like
    const { data: samples } = await c.from('Subject').select('code,semester,creditUnits').limit(3);
    for (const s of samples) console.log(s.code + ' semester=' + JSON.stringify(s.semester) + ' type=' + typeof s.semester);

    const { data: student } = await c.from('students').select('id,program_id').limit(1).single();
    const courseId = student.program_id;
    const sem = samples[0].semester; // Use same semester value as existing subjects

    const newSubjects = [
        { code: 'ARC-410', name: 'Sustainable Architecture & Green Building', creditUnits: 5, courseId, area: 'Architecture', language: 'English', semester: sem },
        { code: 'ARC-411', name: 'Architectural History & Theory', creditUnits: 5, courseId, area: 'Architecture', language: 'English', semester: sem },
        { code: 'ARC-412', name: 'Urban Planning & Design Studio', creditUnits: 5, courseId, area: 'Architecture', language: 'English', semester: sem },
        { code: 'ARC-413', name: 'Building Information Modeling (BIM)', creditUnits: 5, courseId, area: 'Architecture', language: 'English', semester: sem },
        { code: 'ARC-414', name: 'Structural Systems & Materials', creditUnits: 5, courseId, area: 'Architecture', language: 'English', semester: sem },
        { code: 'ARC-415', name: 'Design Thesis Seminar', creditUnits: 5, courseId, area: 'Architecture', language: 'English', semester: sem },
    ];

    const { data: inserted, error } = await c.from('Subject').insert(newSubjects).select('code,name');
    if (error) {
        console.log('ERROR: ' + error.message + ' | details: ' + error.details);
    } else {
        console.log('SUCCESS: Inserted ' + inserted.length + ' subjects');
    }

    // Verify
    const { data: allSubs } = await c.from('Subject').select('creditUnits').eq('courseId', courseId);
    const total = (allSubs || []).reduce((s, x) => s + (x.creditUnits || 0), 0);
    console.log('Total subjects: ' + allSubs?.length + ' | Total ECTS: ' + total);
})();
