
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials!');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);


import fs from 'fs';

async function checkTables() {
    let output = '🔍 Checking table access...\n';

    // Check modules
    const { count: moduleCount, error: mError } = await supabase
        .from('modules')
        .select('*', { count: 'exact', head: true });

    if (mError) output += `❌ Error checking modules: ${JSON.stringify(mError)}\n`;
    else output += `✅ modules table found. Count: ${moduleCount}\n`;

    // Check Subject
    const { count: subjectCount, error: sError } = await supabase
        .from('Subject')
        .select('*', { count: 'exact', head: true });

    if (sError) output += `❌ Error checking Subject: ${JSON.stringify(sError)}\n`;
    else output += `✅ Subject table found. Count: ${subjectCount}\n`;

    // Check courses (for relationship)
    const { count: courseCount, error: cError } = await supabase
        .from('Course')
        .select('*', { count: 'exact', head: true });

    if (cError) output += `❌ Error checking Course: ${JSON.stringify(cError)}\n`;
    else output += `✅ Course table found. Count: ${courseCount}\n`;

    fs.writeFileSync('check_output.txt', output);
    console.log('Done writing to check_output.txt');
}

checkTables();
