import fs from 'fs';
import path from 'path';

function patchFirebaseConfig() {
  const configPath = path.resolve('firebase.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  config.emulators.functions.host = '127.0.0.1';
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Firebase emulator bound to localhost');
}

function patchPackageJson() {
  const pkgPath = path.resolve('package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.scripts.dev = 'HOST=127.0.0.1 PORT=3001 next dev';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('✅ Strategist dashboard bound to localhost');
}

patchFirebaseConfig();
patchPackageJson();
console.log('🔒 mesh:secure task completed');