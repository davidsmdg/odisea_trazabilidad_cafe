const fs = require('fs');
const path = require('path');

const workspaceDir = 'c:\\Users\\Soft\\Downloads\\Ceres_trazabilidad_cafe-main\\Odisea trazabilidad\\src';

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

const widthPattern = /w-\[\d+px\]|min-w-\[\d+px\]/i;

console.log("Analyzing source files for mobile layout issues...");

let found = [];

walkDir(workspaceDir, (filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.tsx' || ext === '.ts' || ext === '.css') {
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            // Check hardcoded widths
            if (widthPattern.test(line)) {
                found.push({
                    file: path.basename(filePath),
                    line: idx + 1,
                    type: 'Hardcoded Width',
                    content: line.trim()
                });
            }
            // Check usage of w-screen
            if (line.includes('w-screen')) {
                found.push({
                    file: path.basename(filePath),
                    line: idx + 1,
                    type: 'w-screen usage (can cause scrollbar issues)',
                    content: line.trim()
                });
            }
            // Check raw widths in CSS or inline style
            if (line.includes('width:') && !line.includes('100%') && !line.includes('auto') && !line.includes('var(')) {
                found.push({
                    file: path.basename(filePath),
                    line: idx + 1,
                    type: 'Inline / CSS Width',
                    content: line.trim()
                });
            }
            // Check grid cols without responsive design (e.g. grid-cols-3 or grid-cols-4 without sm: or md:)
            if (line.includes('grid-cols-') && !line.includes('sm:') && !line.includes('md:') && !line.includes('lg:') && !line.includes('grid-cols-1')) {
                found.push({
                    file: path.basename(filePath),
                    line: idx + 1,
                    type: 'Fixed grid layout (non-responsive)',
                    content: line.trim()
                });
            }
        });
    }
});

found.forEach(item => {
    console.log(`[${item.type}] ${item.file}:${item.line} -> ${item.content}`);
});
console.log(`\nAnalysis finished. Found ${found.length} potential issues.`);
