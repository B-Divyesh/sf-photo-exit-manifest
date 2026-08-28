import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run('npm', ['run', 'build:site']);
run('cargo', ['build']);

const requestedTag = process.argv[2];
const args = ['--test'];
if (requestedTag) args.push(`--test-name-pattern=${requestedTag}`);
args.push('site/test/claims.test.mjs');
run(process.execPath, args);
