import { chmod, copyFile, mkdir, writeFile } from 'node:fs/promises';

const out = new URL('../dist/package/', import.meta.url);
await mkdir(out, { recursive: true });
const binary = new URL('../target/release/photo-exit-manifest', import.meta.url);
const packaged = new URL('photo-exit-manifest-linux-x86_64', out);
await copyFile(binary, packaged);
await chmod(packaged, 0o755);
await writeFile(new URL('README.txt', out), 'Photo Exit Manifest 0.1.0\nRun ./photo-exit-manifest-linux-x86_64 --help\nLicense: MIT\n');
