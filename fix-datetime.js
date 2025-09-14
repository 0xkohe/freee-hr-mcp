#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  './src/tool-schemas.zod.ts'
];

filesToFix.forEach(filePath => {
  const absolutePath = path.resolve(filePath);

  if (!fs.existsSync(absolutePath)) {
    console.log(`File not found: ${absolutePath}`);
    return;
  }

  let content = fs.readFileSync(absolutePath, 'utf8');

  // Remove .datetime({}) and .datetime() calls
  const originalContent = content;
  content = content.replace(/\.datetime\(\{\}\)/g, '');
  content = content.replace(/\.datetime\(\)/g, '');

  if (content !== originalContent) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Fixed datetime issues in: ${filePath}`);
  } else {
    console.log(`No datetime issues found in: ${filePath}`);
  }
});

console.log('Datetime fix completed!');