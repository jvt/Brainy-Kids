[![CircleCI](https://circleci.com/gh/jvt/Brainy-Kids.svg?style=svg)](https://circleci.com/gh/jvt/Brainy-Kids)

# 8108 - Brainy Kids Administration panel and Analytics Platform

This is the codebase for the Brainy Kids backend and administration panel. This repository also includes the code required for ingesting analytics from the various applications.

## Getting started

1.  Make sure you have Node.js installed (Make sure `node --version` prints out a version number)
2.  Clone this repository (`git clone git@github.com:jvt/Brainy-Kidz.git`)
3.  Open the repository (`cd Brainy-Kidz`)
4.  Install the dependencies (`npm install`)
5.  Duplicate `.env.example` and rename it to `.env`
6.  Start the application with `npm run dev`
7.  Navigate your browser to `localhost:3000`

## Viewing the Redux store

1.  From any page on the website, press `CTRL + h` (Configured in `/frontend/components/DevTools.js`) to open the Redux DevTools panel
2.  From here, you can view the global state of the application.
3.  To move the window around, press `CTRL + w`

## Running API Tests

1.  From a terminal window, run `npm run test` or `npm test` (both do the same thing)
2.  Let the tests run, it will generate a coverage window in the terminal once all the tests have completed running

## Continuous Integration

CI is provided by CircleCI and runs on every pull request to ensure tests pass. Merging is disabled until tests pass.
