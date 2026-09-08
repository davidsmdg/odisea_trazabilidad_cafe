const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const colorMap = {
    '#006E6A': '#5f705f', // Primary
    '#006e6a': '#5f705f',
    '#065A74': '#bb8d3b', // Secondary
    '#065a74': '#bb8d3b',
    '#DFDD6B': '#e3d5b8', // Accent -> sand/beige
    '#dfdd6b': '#e3d5b8',
    '#7B9A64': '#8a9a8a', // Chart-3 -> soft sage
    '#7b9a64': '#8a9a8a',
    '#973333': '#a35c5c', // Destructive -> earthy red
    '#973333': '#a35c5c',
    '#022C2A': '#2c362c', // Foreground -> dark earthy green
    '#022c2a': '#2c362c',
    '#064E3B': '#4A5B4A', // Ambiental layout header -> slightly darker sage
    '#064e3b': '#4A5B4A'
};

function processDirectory(dirPath) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updatedContent = content;
            for (const [oldColor, newColor] of Object.entries(colorMap)) {
                const regex = new RegExp(oldColor, 'g');
                updatedContent = updatedContent.replace(regex, newColor);
            }
            if (content !== updatedContent) {
                fs.writeFileSync(fullPath, updatedContent, 'utf8');
                console.log('Updated: ', fullPath);
            }
        }
    });
}

processDirectory(directoryPath);

// Also process index.html at root
const indexHtml = path.join(__dirname, 'index.html');
if (fs.existsSync(indexHtml)) {
    let content = fs.readFileSync(indexHtml, 'utf8');
    let updatedContent = content;
    for (const [oldColor, newColor] of Object.entries(colorMap)) {
        const regex = new RegExp(oldColor, 'g');
        updatedContent = updatedContent.replace(regex, newColor);
    }
    if (content !== updatedContent) {
        fs.writeFileSync(indexHtml, updatedContent, 'utf8');
        console.log('Updated: ', indexHtml);
    }
}
