// convert this to .mjs
// right now this can be run from anywhere and check some repo
// I think long term, the scripts would be bundled
// either installed in the repo and run from there
// or put into a reporting tool where the user inputs the repo URL and all the checks run
const fs = require('fs');
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
  })
  .catch(error => {
    console.error(`Error fetching package.json: ${error}`);
  })
  .finally(() => {
    // Close the output stream and log the error count when all operations are done
    outputStream.write(`Total Errors Found: ${errorCount}\n`);
    outputStream.end();
  });
