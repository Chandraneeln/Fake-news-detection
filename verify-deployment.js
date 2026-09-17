#!/usr/bin/env node

/**
 * Vercel Deployment Verification Script
 * Checks if both frontend and backend are properly configured for Vercel
 */

import fs from 'fs';
import path from 'path';

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}: ${filePath}`);
  return exists;
}

function checkEnvVariable(filePath, variable) {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ Environment file not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hasVariable = content.includes(variable);
  console.log(`${hasVariable ? '✅' : '❌'} ${variable} in ${filePath}`);
  return hasVariable;
}

console.log('🔍 Vercel Deployment Verification\n');

console.log('📁 Configuration Files:');
let allConfigsPresent = true;

// Check Vercel config files
allConfigsPresent = Boolean(allConfigsPresent && checkFile('./vercel.json', 'Frontend Vercel config'));
allConfigsPresent = Boolean(allConfigsPresent && checkFile('./backend/vercel.json', 'Backend Vercel config'));

// Check environment files
allConfigsPresent = Boolean(allConfigsPresent && checkFile('./.env.example', 'Frontend environment example'));
allConfigsPresent = Boolean(allConfigsPresent && checkFile('./.env.production', 'Frontend production environment'));
allConfigsPresent = Boolean(allConfigsPresent && checkFile('./backend/.env.example', 'Backend environment example'));

console.log('\n🔧 Environment Variables:');

// Check frontend env variables
checkEnvVariable('./.env.production', 'VITE_API_URL');

// Check backend env variables (example file)
checkEnvVariable('./backend/.env.example', 'GOOGLE_API_KEY');
checkEnvVariable('./backend/.env.example', 'FRONTEND_URL');
checkEnvVariable('./backend/.env.example', 'CORS_ORIGIN');

console.log('\n📦 Package.json Scripts:');

// Check backend package.json for vercel-build script
try {
  const backendPackage = JSON.parse(fs.readFileSync('./backend/package.json', 'utf8'));
  const hasVercelBuild = Boolean(backendPackage.scripts && backendPackage.scripts['vercel-build']);
  console.log(`${hasVercelBuild ? '✅' : '❌'} Backend vercel-build script`);
  allConfigsPresent = Boolean(allConfigsPresent && hasVercelBuild);
} catch (error) {
  console.log('❌ Backend package.json not found or invalid');
  allConfigsPresent = false;
}

// Check frontend package.json for build script
try {
  const frontendPackage = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const hasBuild = Boolean(frontendPackage.scripts && frontendPackage.scripts.build);
  console.log(`${hasBuild ? '✅' : '❌'} Frontend build script`);
  allConfigsPresent = Boolean(allConfigsPresent && hasBuild);
} catch (error) {
  console.log('❌ Frontend package.json not found or invalid');
  allConfigsPresent = false;
}

console.log('\n📋 Deployment Checklist:');
console.log('1. ✅ Update .env.production with your actual backend URL');
console.log('2. ✅ Create backend/.env with your Google API key');
console.log('3. ✅ Deploy backend first: cd backend && vercel --prod');
console.log('4. ✅ Update VITE_API_URL with backend URL');
console.log('5. ✅ Deploy frontend: vercel --prod');
console.log('6. ✅ Update backend CORS settings with frontend URL');

console.log(`\n${allConfigsPresent ? '🎉' : '⚠️'} ${allConfigsPresent ? 'Ready for Vercel deployment!' : 'Please fix the issues above before deploying'}`);

if (allConfigsPresent) {
  console.log('\n📖 Next steps:');
  console.log('- Read DEPLOYMENT.md for detailed instructions');
  console.log('- Set up your Google Cloud API key');
  console.log('- Deploy to Vercel following the guide');
} else {
  console.log('\n🔧 Fix the missing files/configurations above before deployment');
}