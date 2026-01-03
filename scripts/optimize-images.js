/**
 * Image Optimization Script for Raspberry Pi
 * Generates multiple sizes and WebP versions of images
 * 
 * Usage:
 *   npm install --save-dev sharp
 *   node scripts/optimize-images.js
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Image size configurations
const SIZES = {
  thumbnail: { width: 150, quality: 75 },
  small: { width: 400, quality: 80 },
  medium: { width: 800, quality: 80 },
  large: { width: 1200, quality: 85 }
};

// Directories to process
const MUNICIPALITIES = [
  'BAGAMANOC',
  'BARAS',
  'BATO',
  'CARAMORAN',
  'GIGMOTO',
  'PANDAN',
  'PANGANIBAN',
  'SAN_ANDRES',
  'SAN_MIGUEL',
  'VIGA',
  'VIRAC'
];

const INPUT_BASE = path.join(__dirname, '../public/assets/images');
const OUTPUT_BASE = path.join(__dirname, '../public/assets/images/optimized');

/**
 * Optimize a single image
 */
async function optimizeImage(inputPath, outputDir, filename) {
  const stats = { original: 0, optimized: {} };
  
  try {
    // Get original size
    const originalStats = fs.statSync(inputPath);
    stats.original = originalStats.size;
    
    const name = path.parse(filename).name;
    
    // Generate each size
    for (const [sizeName, config] of Object.entries(SIZES)) {
      const outputPath = path.join(outputDir, `${name}-${sizeName}.webp`);
      
      await sharp(inputPath)
        .resize(config.width, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ 
          quality: config.quality,
          effort: 6 // Max compression effort
        })
        .toFile(outputPath);
      
      const optimizedStats = fs.statSync(outputPath);
      stats.optimized[sizeName] = optimizedStats.size;
    }
    
    return stats;
  } catch (error) {
    console.error(`❌ Error optimizing ${filename}:`, error.message);
    return null;
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(inputDir, outputDir) {
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(inputDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  );
  
  if (imageFiles.length === 0) {
    return null;
  }
  
  console.log(`\n📁 Processing ${inputDir}...`);
  console.log(`   Found ${imageFiles.length} images`);
  
  const results = [];
  
  for (const file of imageFiles) {
    const inputPath = path.join(inputDir, file);
    const stats = await optimizeImage(inputPath, outputDir, file);
    
    if (stats) {
      results.push({ file, stats });
      
      // Calculate total savings
      const totalOptimized = Object.values(stats.optimized).reduce((a, b) => a + b, 0);
      const savings = ((1 - totalOptimized / (stats.original * Object.keys(SIZES).length)) * 100).toFixed(1);
      
      console.log(`   ✅ ${file} → ${Object.keys(SIZES).length} sizes (${savings}% smaller)`);
    }
  }
  
  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting image optimization for Raspberry Pi...');
  console.log(`   Input: ${INPUT_BASE}`);
  console.log(`   Output: ${OUTPUT_BASE}`);
  console.log(`   Sizes: ${Object.keys(SIZES).join(', ')}`);
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalImages = 0;
  
  // Process each municipality
  for (const municipality of MUNICIPALITIES) {
    const inputDir = path.join(INPUT_BASE, municipality);
    const outputDir = path.join(OUTPUT_BASE, municipality);
    
    if (!fs.existsSync(inputDir)) {
      console.log(`⚠️  Skipping ${municipality} (directory not found)`);
      continue;
    }
    
    const results = await processDirectory(inputDir, outputDir);
    
    if (results) {
      results.forEach(({ stats }) => {
        totalOriginal += stats.original * Object.keys(SIZES).length;
        totalOptimized += Object.values(stats.optimized).reduce((a, b) => a + b, 0);
        totalImages++;
      });
    }
  }
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images processed: ${totalImages}`);
  console.log(`Total variants created: ${totalImages * Object.keys(SIZES).length}`);
  console.log(`Original total size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total size: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total savings: ${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}%`);
  console.log('='.repeat(60));
  console.log('✨ Optimization complete!');
  console.log('\n💡 Next steps:');
  console.log('   1. Update useSpotMedia.js to use responsive images');
  console.log('   2. Add <picture> elements with srcset');
  console.log('   3. Test on Raspberry Pi');
}

// Run the script
main().catch(console.error);
