import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Requires service_role key to bypass RLS

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log('Fetching it_assets...');

    const { data: assets, error } = await supabase.from('it_assets').select('*');
    if (error) {
        console.error('Error fetching assets:', error);
        return;
    }

    console.log(`Found ${assets.length} assets. Updating content to use kestora.online...`);

    let totalUpdates = 0;

    for (const asset of assets) {
        let changed = false;
        let newUrl = asset.access_url || '';
        let newDesc = asset.description || '';

        // Check and replace in URL
        if (newUrl.includes('sykli')) {
            newUrl = newUrl.replace(/syklicollege\.edu/gi, 'kestora.online')
                .replace(/syklicollege/gi, 'kestora')
                .replace(/sykli\.fi/gi, 'kestora.online')
                .replace(/sykli\.edu/gi, 'kestora.online');
            changed = true;
        }

        // Check and replace in description
        if (newDesc.includes('sykli')) {
            newDesc = newDesc.replace(/syklicollege\.edu/gi, 'kestora.online')
                .replace(/syklicollege/gi, 'kestora')
                .replace(/sykli\.fi/gi, 'kestora.online')
                .replace(/sykli\.edu/gi, 'kestora.online');
            changed = true;
        }

        if (changed) {
            console.log(`Updating [${asset.name}]...`);
            console.log(`  Old Desc: ${asset.description}`);
            console.log(`  New Desc: ${newDesc}`);
            console.log(`  Old URL: ${asset.access_url}`);
            console.log(`  New URL: ${newUrl}`);

            const { error: updateError } = await supabase
                .from('it_assets')
                .update({ access_url: newUrl, description: newDesc })
                .eq('id', asset.id);

            if (updateError) {
                console.error(`Failed to update ${asset.name}:`, updateError);
            } else {
                console.log(`Successfully updated ${asset.name}`);
                totalUpdates++;
            }
        }
    }

    console.log(`Done. Updated ${totalUpdates} records.`);
}

main();
