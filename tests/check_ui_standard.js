const fs = require('fs');
const path = require('path');

const ccDir = path.join(__dirname, '..', 'cc_modules');
const files = fs.readdirSync(ccDir).filter(f => f.endsWith('.js')).sort();

console.log('Total CC modules:', files.length);

const results = [];

files.forEach(file => {
    const content = fs.readFileSync(path.join(ccDir, file), 'utf8');
    const bgMedicalCount = (content.match(/bg-medical-100/g) || []).length;
    const h2Count = (content.match(/<h2 /g) || []).length;
    const h3Count = (content.match(/<h3 /g) || []).length;
    const selectableCardCount = (content.match(/selectable-card/g) || []).length;
    const messageSquarePlus = content.includes('message-square-plus');
    const bgRoseCount = (content.match(/bg-rose-50/g) || []).length;
    
    results.push({
        file,
        bgMed: bgMedicalCount,
        h2: h2Count,
        h3: h3Count,
        selectCard: selectableCardCount,
        msgSquare: messageSquarePlus,
        bgRose: bgRoseCount
    });
});

console.table(results);
