import { execSync } from 'child_process';
import { statSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

console.log('=== Enterprise Benchmark Baseline ===\n');

function runBenchmark() {
  // 1. Type Checking
  console.log('1. Type Checking...');
  const tscStart = performance.now();
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    const tscEnd = performance.now();
    console.log(`\n✅ Type Check Time: ${((tscEnd - tscStart) / 1000).toFixed(2)}s\n`);
  } catch (e) {
    console.log('\n❌ Type Check failed!\n');
  }

  // 2. Build Time
  console.log('2. Building application...');
  const buildStart = performance.now();
  try {
    execSync('npm run build', { stdio: 'inherit' });
    const buildEnd = performance.now();
    console.log(`\n✅ Build Time: ${((buildEnd - buildStart) / 1000).toFixed(2)}s\n`);
  } catch (e) {
    console.log('\n❌ Build failed!\n');
  }

  // 3. Chunk Sizes
  console.log('3. Chunk Sizes:');
  const assetsDir = join(process.cwd(), 'dist', 'assets');
  if (existsSync(assetsDir)) {
    const files = readdirSync(assetsDir);
    let totalSize = 0;
    for (const file of files) {
      const size = statSync(join(assetsDir, file)).size;
      totalSize += size;
      console.log(` - ${file}: ${(size / 1024).toFixed(2)} KB`);
    }
    console.log(`\n📊 Total Asset Size: ${(totalSize / 1024).toFixed(2)} KB`);
  } else {
    console.log('Could not find dist/assets directory. Build might have failed or configured differently.');
  }
}

runBenchmark();
