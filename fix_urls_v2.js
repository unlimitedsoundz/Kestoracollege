const fs = require('fs');
const path = require('path');

const targetDirs = ['src', 'public', 'scripts'];
const extensions = ['.tsx', '.ts', '.md', '.json', '.js'];

function fixInFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. Fix image source paths /SYKLI-logo-official.png -> /sykli-logo-official.png
        content = content.replace(/\/images\/SYKLI/g, '/images/sykli');

        // 2. Fix external domains labs.SYKLI.edu -> labs.sykli.edu
        content = content.replace(/labs\.SYKLI\.edu/g, 'labs.sykli.edu');

        // 3. System-wide check for any href or item paths that might still be capitalized
        // Use regex to find internal absolute paths that are capitalized
        content = content.replace(/(href|item|url)="\/([^"]*SYKLI[^"]*)"/g, (match, prefix, pathPart) => {
            return `${prefix}="/${pathPart.toLowerCase()}"`;
        });

        // 4. Fix metadata base and schema urls specifically if not caught
        content = content.replace(/https:\/\/www\.SYKLIcollege\.fi/g, 'https://www.syklicollege.fi');
        content = content.replace(/https:\/\/SYKLIcollege\.fi/g, 'https://syklicollege.fi');

        // 5. Fix email addresses in mailto: or as text if they have SYKLI domain capitalized
        content = content.replace(/@SYKLIcollege\.fi/g, '@syklicollege.fi');

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
