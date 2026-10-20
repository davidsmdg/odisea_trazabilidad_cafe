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

console.log("Analyzing page and component files for back buttons...");

const navigatePattern = /navigate\(['"][^'"]+['"]\)/;

let pages = [];

walkDir(srcDir, (filePath) => {
    const ext = path.extname(filePath);
    if (ext === '.tsx' || ext === '.ts') {
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Let's check for pages that have "Detalle" or represent sub-sections, forms, or creations
        const filename = path.basename(filePath);
        if (filename.includes('Nueva') || filename.includes('Nuevo') || filename.includes('Detalle') || filename.includes('Form') || filename.includes('Experimento') || filename.includes('Evaluacion')) {
            pages.push({
                file: filename,
                path: filePath,
                content: content
            });
        }
    }
});

pages.forEach(p => {
    console.log(`\n--- File: ${p.file} ---`);
    // Find all navigate calls
    const lines = p.content.split('\n');
    lines.forEach((line, idx) => {
        if (line.includes('navigate(')) {
            console.log(`Line ${idx+1}: ${line.trim()}`);
        }
    });
});
