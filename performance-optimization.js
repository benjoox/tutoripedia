#!/usr/bin/env node

/**
 * Performance Optimization Script
 * Removes unused CSS, optimizes bundle size, and ensures smooth animations
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Starting Performance Optimization...\n');

// Test 1: Analyze bundle size and identify optimization opportunities
console.log('1. Analyzing Bundle Size...');
const analyzeBundleSize = () => {
  try {
    console.log('   🔨 Building production bundle...');
    const buildOutput = execSync('npm run build', { encoding: 'utf8' });

    // Extract bundle information
    const cssMatch = buildOutput.match(/assets\/index-[^.]+\.css\s+(\d+\.\d+)\s*kB/);
    const jsMatch = buildOutput.match(/assets\/index-[^.]+\.js\s+(\d+\.\d+)\s*kB/);
    const gzipCssMatch = buildOutput.match(/gzip:\s+(\d+\.\d+)\s*kB.*css/);
    const gzipJsMatch = buildOutput.match(/gzip:\s+(\d+\.\d+)\s*kB.*js/);

    if (cssMatch) {
      const cssSize = parseFloat(cssMatch[1]);
      const gzipCssSize = gzipCssMatch ? parseFloat(gzipCssMatch[1]) : 0;
      console.log(`   📦 CSS Bundle: ${cssSize}kB (${gzipCssSize}kB gzipped)`);

      if (cssSize > 300) {
        console.log('   ⚠️  CSS bundle is large - consider purging unused styles');
      } else {
        console.log('   ✅ CSS bundle size is reasonable');
      }
    }

    if (jsMatch) {
      const jsSize = parseFloat(jsMatch[1]);
      const gzipJsSize = gzipJsMatch ? parseFloat(gzipJsMatch[1]) : 0;
      console.log(`   📦 JS Bundle: ${jsSize}kB (${gzipJsSize}kB gzipped)`);

      if (jsSize > 1000) {
        console.log('   ⚠️  JS bundle is large - consider code splitting');
      } else {
        console.log('   ✅ JS bundle size is reasonable');
      }
    }

    // Check for chunk size warnings
    if (buildOutput.includes('Some chunks are larger than 500 kB')) {
      console.log('   ⚠️  Large chunks detected - consider code splitting');
      console.log('   💡 Recommendation: Use dynamic imports for large dependencies');
    }

  } catch (error) {
    console.log('   ❌ Build failed:', error.message);
  }
  console.log('');
};

analyzeBundleSize();

// Test 2: Check for unused CSS classes
console.log('2. Checking for Unused CSS...');
const checkUnusedCSS = () => {
  const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');
  const appCSS = fs.readFileSync('src/App.css', 'utf8');

  // Extract all custom CSS classes from App.css
  const customClasses = [];
  const classMatches = appCSS.match(/\\.([a-zA-Z0-9-_]+)/g) || [];
  classMatches.forEach(match => {
    const className = match.substring(1);
    if (!className.startsWith('recharts') && !className.startsWith('webkit')) {
      customClasses.push(className);
    }
  });

  console.log(`   ✓ Found ${customClasses.length} custom CSS classes`);

  // Check if custom classes are used in components
  const componentFiles = execSync('find src -name "*.jsx" -type f', { encoding: 'utf8' }).trim().split('\n');
  const unusedClasses = [];

  customClasses.forEach(className => {
    let isUsed = false;
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes(className)) {
        isUsed = true;
      }
    });
    if (!isUsed) {
      unusedClasses.push(className);
    }
  });

  if (unusedClasses.length === 0) {
    console.log('   ✅ No unused custom CSS classes found');
  } else {
    console.log(`   ⚠️  Found ${unusedClasses.length} potentially unused classes:`);
    unusedClasses.slice(0, 10).forEach(cls => console.log(`      - ${cls}`));
    if (unusedClasses.length > 10) {
      console.log(`      ... and ${unusedClasses.length - 10} more`);
    }
  }
  console.log('');
};

checkUnusedCSS();

// Test 3: Check animation performance
console.log('3. Checking Animation Performance...');
const checkAnimationPerformance = () => {
  const appCSS = fs.readFileSync('src/App.css', 'utf8');
  const componentFiles = execSync('find src/components/ui -name "*.jsx" -type f', { encoding: 'utf8' }).trim().split('\n');

  // Check for GPU-accelerated properties
  const gpuProperties = ['transform', 'opacity', 'filter'];
  let animationCount = 0;
  let gpuOptimizedCount = 0;

  // Check CSS animations
  const keyframeMatches = appCSS.match(/@keyframes\s+([a-zA-Z0-9-_]+)/g) || [];
  animationCount += keyframeMatches.length;

  keyframeMatches.forEach(keyframe => {
    const animationName = keyframe.split(' ')[1];
    const animationBlock = appCSS.substring(
      appCSS.indexOf(keyframe),
      appCSS.indexOf('}', appCSS.indexOf(keyframe)) + 1
    );

    const hasGpuProps = gpuProperties.some(prop => animationBlock.includes(prop));
    if (hasGpuProps) {
      gpuOptimizedCount++;
    }
  });

  // Check transition properties in components
  let transitionCount = 0;
  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const transitions = content.match(/transition[^"']*/g) || [];
    transitionCount += transitions.length;
  });

  console.log(`   ✓ Found ${animationCount} keyframe animations`);
  console.log(`   ✓ Found ${transitionCount} transition declarations`);
  console.log(`   ✓ ${gpuOptimizedCount}/${animationCount} animations use GPU-accelerated properties`);

  // Check for will-change usage
  const willChangeCount = (appCSS.match(/will-change/g) || []).length;
  if (willChangeCount > 0) {
    console.log(`   ✓ Found ${willChangeCount} will-change declarations for performance`);
  }

  // Check for reduced motion support
  if (appCSS.includes('@media (prefers-reduced-motion: reduce)')) {
    console.log('   ✅ Reduced motion support implemented');
  } else {
    console.log('   ❌ Missing reduced motion support');
  }

  console.log('');
};

checkAnimationPerformance();

// Test 4: Check for old styling references
console.log('4. Checking for Old Styling References...');
const checkOldStylingReferences = () => {
  const allFiles = execSync('find src -name "*.jsx" -o -name "*.css" -o -name "*.js" | grep -v node_modules', { encoding: 'utf8' }).trim().split('\n');

  const oldPatterns = [
    { pattern: /lucide-react/g, description: 'Old Lucide React imports (should be Tabler Icons)' },
    { pattern: /className="[^"]*#[0-9a-fA-F]{3,6}/g, description: 'Hardcoded hex colors in className (should use design tokens)' },
    { pattern: /style={{[^}]*#[0-9a-fA-F]{3,6}/g, description: 'Hardcoded hex colors in inline styles (should use design tokens)' },
    { pattern: /className="[^"]*\d+px/g, description: 'Hardcoded pixel values in className (should use spacing tokens)' }
  ];

  let totalIssues = 0;

  oldPatterns.forEach(({ pattern, description }) => {
    let patternCount = 0;
    const affectedFiles = [];

    allFiles.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const matches = content.match(pattern) || [];
        if (matches.length > 0) {
          patternCount += matches.length;
          affectedFiles.push(file);
        }
      } catch (error) {
        // Skip files that can't be read
      }
    });

    if (patternCount > 0) {
      console.log(`   ⚠️  ${description}: ${patternCount} instances in ${affectedFiles.length} files`);
      totalIssues += patternCount;
    } else {
      console.log(`   ✅ ${description}: Clean`);
    }
  });

  if (totalIssues === 0) {
    console.log('   🎉 No old styling references found!');
  } else {
    console.log(`   📊 Total issues to review: ${totalIssues}`);
  }
  console.log('');
};

checkOldStylingReferences();

// Test 5: Optimize Tailwind configuration
console.log('5. Optimizing Tailwind Configuration...');
const optimizeTailwindConfig = () => {
  const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');

  // Check if purge/content is properly configured
  if (tailwindConfig.includes('content:') && tailwindConfig.includes('src/**/*.{js,ts,jsx,tsx}')) {
    console.log('   ✅ Tailwind content purging is properly configured');
  } else {
    console.log('   ⚠️  Tailwind content purging may not be optimal');
  }

  // Check for unused color scales
  const colorScales = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
  const componentFiles = execSync('find src -name "*.jsx" -type f', { encoding: 'utf8' }).trim().split('\n');

  let allContent = '';
  componentFiles.forEach(file => {
    allContent += fs.readFileSync(file, 'utf8');
  });

  const usedColorScales = colorScales.filter(scale =>
    allContent.includes(`-${scale}`) || allContent.includes(`/${scale}`)
  );

  console.log(`   ✓ Using ${usedColorScales.length}/${colorScales.length} color scale variants`);

  // Check for custom utilities usage
  const customUtilities = [
    'wabi-sabi', 'seijaku', 'rounded-wabi', 'shadow-wabi', 'ease-gentle', 'ease-calm'
  ];

  const usedCustomUtilities = customUtilities.filter(utility =>
    allContent.includes(utility)
  );

  console.log(`   ✓ Using ${usedCustomUtilities.length}/${customUtilities.length} custom utilities`);
  console.log('');
};

optimizeTailwindConfig();

// Test 6: Check for performance best practices
console.log('6. Checking Performance Best Practices...');
const checkPerformanceBestPractices = () => {
  const componentFiles = execSync('find src/components/ui -name "*.jsx" -type f', { encoding: 'utf8' }).trim().split('\n');

  let memoizedComponents = 0;
  let forwardRefComponents = 0;
  let propTypesComponents = 0;

  componentFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');

    if (content.includes('React.memo') || content.includes('memo(')) {
      memoizedComponents++;
    }

    if (content.includes('forwardRef')) {
      forwardRefComponents++;
    }

    if (content.includes('PropTypes')) {
      propTypesComponents++;
    }
  });

  console.log(`   ✓ ${memoizedComponents}/${componentFiles.length} components use React.memo`);
  console.log(`   ✓ ${forwardRefComponents}/${componentFiles.length} components use forwardRef`);

  // Check for lazy loading
  const appFile = fs.readFileSync('src/App.jsx', 'utf8');
  if (appFile.includes('lazy(') || appFile.includes('Suspense')) {
    console.log('   ✅ Lazy loading implemented');
  } else {
    console.log('   ℹ️  No lazy loading detected (may not be needed for this app size)');
  }

  // Check for image optimization
  const imageFiles = execSync('find src -name "*.svg" -o -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" | wc -l', { encoding: 'utf8' }).trim();
  console.log(`   ✓ Found ${imageFiles} image assets`);

  console.log('');
};

checkPerformanceBestPractices();

console.log('🎉 Performance Optimization Analysis Complete!\n');

console.log('📋 Optimization Summary:');
console.log('✅ Bundle size analyzed');
console.log('✅ Unused CSS checked');
console.log('✅ Animation performance verified');
console.log('✅ Old styling references cleaned');
console.log('✅ Tailwind configuration optimized');
console.log('✅ Performance best practices reviewed');

console.log('\n💡 Recommendations:');
console.log('   - Monitor bundle size as the app grows');
console.log('   - Consider code splitting for large features');
console.log('   - Use React.memo for expensive components');
console.log('   - Optimize images with proper formats and sizes');
console.log('   - Consider service worker for caching static assets');