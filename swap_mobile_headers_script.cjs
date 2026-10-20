const fs = require('fs');
const path = require('path');

const layoutsDir = 'c:\\Users\\Soft\\Downloads\\Ceres_trazabilidad_cafe-main\\Odisea trazabilidad\\src\\app\\layouts';
const files = [
    'AmbientalLayout.tsx',
    'CatadorLayout.tsx',
    'CeresLayout.tsx',
    'LiderLayout.tsx',
    'ProducerLayout.tsx',
    'TostadorLayout.tsx'
];

console.log("Starting to swap mobile header layout (Menu Left, Logo Right)...");

files.forEach(filename => {
    const filePath = path.join(layoutsDir, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filename}`);
        return;
    }
    
    let content = fs.readFileSync(filePath, 'utf-8');
    
    // Regular expression to match the mobile header:
    // It starts with <header className="md:hidden flex...
    // Inside it, it typically has:
    // <div className="flex items-center gap-2">...</div>
    // and then <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(...
    // Let's locate this block and swap them.
    
    // Simple matching of the exact template:
    const headerRegex = /(<header className="md:hidden flex[^>]*>)\s*(<div className="flex items-center gap-2">[\s\S]*?<\/div>)\s*(<Button[\s\S]*?<\/Button>)\s*(<\/header>)/;
    
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, '$1\n                $3\n                $2\n            $4');
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Successfully swapped mobile header in: ${filename}`);
    } else {
        console.log(`Could not match header pattern in: ${filename}`);
    }
});

console.log("Finished swapping mobile headers.");
