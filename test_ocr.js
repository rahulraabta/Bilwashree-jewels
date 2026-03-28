const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

async function testOCR() {
    console.log("Starting Tesseract.js Worker...");
    const worker = await Tesseract.createWorker('eng');
    
    const filesToTest = [
        'page_001.jpg',
        'page_002.jpg',
        'page_003.jpg'
    ];
    
    for (const file of filesToTest) {
        const fullPath = path.join(__dirname, 'public', 'images', 'extracted', file);
        console.log(`Analyzing ${file}...`);
        
        const { data: { text } } = await worker.recognize(fullPath);
        
        // Find text matching something like NK-something, NK26, PD-something, ER-something
        console.log(`=== RAW TEXT FOR ${file} ===\n`, text.substring(0, 200).replace(/\n/g, ' '));
        
        const match = text.match(/([A-Z]{2,3}[-\s]*\d{2,4})/gi);
        console.log(`Result code: ${match ? match[0] : 'None found'} \n`);
    }

    await worker.terminate();
}

testOCR();
