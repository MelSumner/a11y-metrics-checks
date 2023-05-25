const fs = require('fs');
const glob = require('glob');
const axios = require('axios');

// Specify the URL of the package.json file
const packageJsonURL = 'https://raw.githubusercontent.com/MelSumner/a11y-automation/main/package.json';

// Specify the path to the output file
const outputPath = './data/output.txt';

// Array of packages to check
const packagesToCheck = ['ember-a11y-testing', 'ember-template-lint'];

// Create a writable stream to the output file
const outputStream = fs.createWriteStream(outputPath, { flags: 'a' });

// Initialize error count
let errorCount = 0;

// Fetch the package.json file from the URL
axios.get(packageJsonURL)
  .then(response => {
    const packageJson = response.data;

    // Get the devDependencies section from package.json
    const dependencies = packageJson.devDependencies || {};

    // Check if all the packages in packagesToCheck exist in dependencies
    const missingPackages = packagesToCheck.filter(packageName => !(packageName in dependencies));

    if (missingPackages.length > 0) {
      const missingPackagesMsg = `Missing packages:\n${missingPackages.join('\n')}`;
      console.log(missingPackagesMsg);
      outputStream.write(missingPackagesMsg + '\n');
      errorCount += missingPackages.length;
    } else {
      console.log('All packages are present!');
      outputStream.write('All packages are present!\n');
    }

    // Find all hbs files, but don't look in node_modules
    // glob.sync('**/*.hbs', { ignore: 'node_modules/**' }, (err, files) => {
    //   console.log('foooooo was hereeeeee');
    //   if (err) {
    //     console.error(`Error searching for .hbs files: ${err}`);
    //     return;
    //   }

    //   files.forEach(file => {
    //     console.log('file is' + file);
    //     // Read each file
    //     fs.readFile(file, 'utf8', (err, content) => {
    //       if (err) {
    //         console.error(`Error reading file: ${err}`);
    //         return;
    //       }

    //       // Check for the string "template-lint-disable" in each .hbs file content
    //       // TODO update this later to check for all the ways this could be present
    //       if (content.match('template-lint-disable')) {
    //         const parentFolder = path.dirname(file);
    //         const msg = `Found "template-lint-disable" in file: ${file} (Parent folder: ${parentFolder})`;
    //         console.log(msg);
    //         outputStream.write(msg + '\n');
    //         errorCount++;
    //       } else {
    //         const msg = `No disabled lint rules found`;
    //         console.log(msg);
    //         outputStream.write(msg + '\n');
    //       }
    //     });
    //   });
    // });
  })
  .catch(error => {
    console.error(`Error fetching package.json: ${error}`);
  })
  .finally(() => {
    // Close the output stream and log the error count when all operations are done
    outputStream.write(`Total Errors Found: ${errorCount}\n`);
    outputStream.end();
  });
