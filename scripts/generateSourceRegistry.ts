// Copyright James Burvel O’Callaghan III
// President Citibank Demo Business Inc.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outputFilePath = path.resolve(rootDir, 'services', 'sourceRegistry.ts');

const EXCLUDED_DIRS = ['node_modules', 'web', '.git', 'dist', '.vscode', 'scripts'];
const EXCLUDED_FILES = [
    '.DS_Store', 'package-lock.json',
    // Exclude obsolete UI components
    'DashboardView.tsx',
    'MachineView.tsx',
    'FeaturePalette.tsx',
    'LeftSidebar.tsx'
];

const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (EXCLUDED_DIRS.includes(path.basename(fullPath)) || EXCLUDED_FILES.includes(path.basename(fullPath))) {
            return;
        }

        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
};

const generateRegistry = () => {
    console.log('Generating source file registry...');
    const allFiles = getAllFiles(rootDir);
    
    let fileContent = `// This file is a registry of all source code files in the application.
// It's used by the ActionManager to create a downloadable zip of the entire app source.
// THIS FILE IS AUTO-GENERATED. DO NOT EDIT BY HAND.

export const sourceFiles: Record<string, string> = {\n`;

    allFiles.forEach(filePath => {
        const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
        const content = fs.readFileSync(filePath, 'utf-8');
        const key = `'${relativePath}'`;
        const value = '`' + content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`';
        fileContent += `  ${key}: ${value},\n`;
    });

    fileContent += '};\n';

    fs.writeFileSync(outputFilePath, fileContent, 'utf-8');
    console.log(`Source registry generated successfully at ${outputFilePath}`);
};

generateRegistry();
