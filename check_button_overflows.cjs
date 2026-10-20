const fs = require('fs');
const path = require('path');

const srcDir = 'c:\\Users\\Soft\\Downloads\\Ceres_trazabilidad_cafe-main\\Odisea trazabilidad\\src';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

console.log("Analyzing files for potential button text overflows on mobile...");

let issues = [];

walkDir(srcDir, (filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.tsx' || ext === '.ts') {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        
        lines.forEach((line, idx) => {
            // Find button elements or classes that represent buttons
            if (line.includes('<button') || line.includes('<Button') || line.includes('className=') && (line.includes('rounded-') || line.includes('bg-'))) {
                // If it contains a large text class (like text-xl, text-2xl, text-3xl) and is a button, or has long text
                if (line.includes('text-xl') || line.includes('text-2xl') || line.includes('text-lg') || line.includes('text-3xl')) {
                    issues.push({
                        file: path.basename(filePath),
                        line: idx + 1,
                        content: line.trim()
                    });
                }
            }
        });
    }
});

issues.forEach(issue => {
    console.log(`[Large text button/element] ${issue.file}:${issue.line} -> ${issue.content}`);
});
console.log(`\nAnalysis finished. Found ${issues.length} potential overflow elements.`);
