import { spawn } from 'child_process';
import fs from 'fs/promises';
import chalk from 'chalk';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import stripAnsi from 'strip-ansi';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function getFilesFromRepo() {
  return new Promise((resolve, reject) => {
    let git = spawn('git', ['ls-files']);
    let output = '';

    git.stdout.on('data', (data) => (output += data.toString()));
    git.stderr.on('data', (data) => reject(data.toString()));
    git.on('close', (code) => {
      if (code !== 0) reject(`git ls-files exited with code ${code}`);
      else
        resolve(
          output
            .trim()
            .split('\n')
            .filter((file) => file.endsWith('.hbs'))
        );
    });
  });
}

async function countWordInFile(file, word) {
  let fileContent = await fs.readFile(file, 'utf-8');
  return fileContent.split(word).length - 1;
}

async function scanGithubRepo(word) {
  const files = await getFilesFromRepo();
  let totalCount = 0;
  let output = '';

  for (let file of files) {
    let count = await countWordInFile(file, word);
    if (count > 0) {
      let message =
        '' +
        chalk.yellow(word) +
        ' found ' +
        chalk.red(count) +
        ' time(s) in file: ' +
        chalk.blue(file) +
        '.\n';
      console.log(message);
      output += message;
      totalCount += count;
    }
  }

  let totalMessage =
    '' +
    chalk.yellow(word) +
    ' count: ' +
    chalk.yellow(totalCount) +
    ' time(s).\n';
  console.log(totalMessage);
  output += totalMessage;

  const resultsDir = path.join(__dirname, 'results');
  await fs.mkdir(resultsDir, { recursive: true });
  await fs.writeFile(path.join(resultsDir, 'output.txt'), stripAnsi(output));
}

const word = 'template-lint-disable';
scanGithubRepo(word).catch((err) => console.log(err));
