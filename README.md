# A11y Metrics Checks

This tool scans Ember repositories for accessibility.

## Checks (WIP)

- check_packages: checks to make sure `ember-a11y-testing` and `ember-template-lint` are installed
- check_templates: checks template files for disabled lints and reports instances and total count

## TODO

- check to see if a11y related linting rules are turned off in the template config file
- check to see if there are any `a11yAudit` exceptions
- report total number of issues
- report an itemized list of issues
