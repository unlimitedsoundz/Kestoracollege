const fs = require('fs');
const path = require('path');

const targetDirs = ['src', 'public', 'scripts'];
const extensions = ['.tsx', '.ts', '.md', '.json', '.js'];

function fixInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Fix image source paths /Kestora-logo-official.png -> /kestora-logo-official.png
        content = content.replace(/\/images\/Kestora/g, '/images/kestora');

        // 2. Fix external domains labs.Kestora.edu -> labs.kestora.edu
        content = content.replace(/labs\.Kestora\.edu/g, 'labs.kestora.edu');

        // 3. System-wide check for any href or item paths that might still be capitalized
        // Use regex to find internal absolute paths that are capitalized
        content = content.replace(/(href|item|url)="\/([^"]*Kestora[^"]*)"/g, (match, prefix, pathPart) => {
            return `${prefix}="/${pathPart.toLowerCase()}"`;
        });

        // 4. Fix metadata base and schema urls specifically if not caught
        content = content.replace(/https:\/\/www\.Kestoracollege\.fi/g, 'https://www.kestora.fi');
        content = content.replace(/https:\/\/Kestoracollege\.fi/g, 'https://kestora.fi');

        // 5. Fix email addresses in mailto: or as text if they have Kestora domain capitalized
        content = content.replace(/@Kestoracollege\.fi/g, '@kestora.fi');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated: ${filePath}`);
        }
    } catch (err) {
        console.error(`Error processing ${filePath}: ${err.message}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (extensions.includes(path.extname(fullPath))) {
            fixInFile(fullPath);
        }
    });
}

targetDirs.forEach(dir => {
    const absDir = path.resolve(__dirname, dir);
    if (fs.existsSync(absDir)) {
        walkDir(absDir);
    }
});
