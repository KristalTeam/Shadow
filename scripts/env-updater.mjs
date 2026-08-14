import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const envPath = path.resolve(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, '', 'utf8');
}

var value = execSync('git rev-parse --short HEAD').toString().trim();

let envContent = fs.readFileSync(envPath, 'utf8');

// Create regex matching the specific key
const regex = new RegExp(`^DEPLOYMENT_VERSION=.*`, 'm');

if (regex.test(envContent)) {
    envContent = envContent.replace(regex, `DEPLOYMENT_VERSION="${value}"`);
} else {
    envContent += `\nDEPLOYMENT_VERSION="${value}"`;
}

fs.writeFileSync(envPath, envContent, 'utf8');
