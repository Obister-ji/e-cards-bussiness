#!/usr/bin/env node

/**
 * Favicon Setup Script
 * Copies logo from logo folder and sets up favicon files
 */

const fs = require('fs');
const path = require('path');

// Paths
const logoSource = path.join(__dirname, 'logo', 'logo.jpeg');
const publicDir = path.join(__dirname, 'public');
const logoDestDir = path.join(publicDir, 'logo');
const logoDest = path.join(logoDestDir, 'logo.jpeg');

console.log('🔧 Setting up favicon from logo...');

try {
  // Check if source logo exists
  if (!fs.existsSync(logoSource)) {
    console.error('❌ Logo file not found:', logoSource);
    process.exit(1);
  }

  // Create logo directory in public
  if (!fs.existsSync(logoDestDir)) {
    fs.mkdirSync(logoDestDir, { recursive: true });
    console.log('📁 Created logo directory in public folder');
  }

  // Copy logo file
  fs.copyFileSync(logoSource, logoDest);
  console.log('📋 Copied logo to public/logo/logo.jpeg');

  // Create web manifest
  const manifest = {
    name: "Cardly Profile Craft",
    short_name: "Cardly",
    description: "Professional Digital Business Card Creator",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/favicon-512x512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  const manifestPath = path.join(publicDir, 'site.webmanifest');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log('📄 Created site.webmanifest');

  // Create browserconfig.xml for Windows tiles
  const browserconfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>#000000</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;

  const browserconfigPath = path.join(publicDir, 'browserconfig.xml');
  fs.writeFileSync(browserconfigPath, browserconfig);
  console.log('📄 Created browserconfig.xml');

  console.log('✅ Favicon setup complete!');
  console.log('');
  console.log('📋 Next steps:');
  console.log('1. Start the development server: bun run dev');
  console.log('2. The favicon will be automatically generated from your logo');
  console.log('3. Check the browser tab to see your logo as favicon');
  console.log('');
  console.log('🎯 Your logo is now ready to be used as favicon!');

} catch (error) {
  console.error('❌ Error setting up favicon:', error.message);
  process.exit(1);
}
