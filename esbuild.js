const esbuild = require('esbuild');

const isWatch = process.argv.includes('--watch');
const isProduction = process.argv.includes('--production');

// 古いバージョンのesbuildでもエラーにならない、安全な設定オブジェクトの構築
const config = {
  entryPoints: ['src/extension.ts'],
  outfile: 'out/extension.js',
  bundle: true,
  external: ['vscode'],
  format: 'cjs',
  platform: 'node',
  sourcemap: !isProduction,
  minify: isProduction,
};

if (isWatch) {
  config.watch = {
    onRebuild(error, result) {
      if (error) console.error('watch build failed:', error);
      else console.log('watch build succeeded:', result);
    },
  };
}

async function runBuild() {
  try {
    await esbuild.build(config);
    if (isWatch) {
      console.log('watching for changes...');
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

runBuild();