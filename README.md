[![CircleCI](https://circleci.com/gh/jvt/Brainy-Kids.svg?style=svg)](https://circleci.com/gh/jvt/Brainy-Kids)

# 8108 - Brainy Kids Administration panel and Analytics Platform

This is the codebase for the Brainy Kids backend and administration panel. This repository also includes the code required for ingesting analytics from the various applications. Keep in mind that this application has to be running only on a single computer/server. All other teachers, administrators, etc will access it through the web.

## Pre-requisites

1.  Make sure you have Node.js installed (Make sure `node --version` prints out a version number)
2.  Make sure you have the latest version of MongoDB set up either locally or point it to a remote server (see "Getting Started")
3.  If you want to install this for actual use, make sure you install it on a server that can be accessed by any computer that wants to use it. This usually means the server should have a static IP address and correct port forwarding/firewall configuration.

## Getting started

1.  Clone this repository (`git clone git@github.com:jvt/Brainy-Kidz.git`)
2.  Open the repository (`cd Brainy-Kidz`)
3.  Install the dependencies (`npm install`)
4.  Duplicate `.env.example` and rename it to `.env`
5.  Open the `.env` file and add a JWT_SECRET
6.  Also set `MONGODB_URI` to either point to your local machine or wherever your MongoDB is.
7.  Make sure your instance of MongoDB is running
8.  Start the application with `npm run dev`
9.  Navigate your browser to `localhost:3000`

Now other users should be able to access the application by navigating to it in their web-browser.

## Common issues

1. The program will exit on startup if it is unable to find an instance of MongoDB running at the set URI. Be sure that the instance of MongoDB is running before you start the program.
2. If the program crashes on startup with error messages mentioning the word "dependicies" run `npm install` in the root directory of the project again.

## Developer notes

### Viewing the Redux store

1.  From any page on the website, press `CTRL + h` (Configured in `/frontend/components/DevTools.js`) to open the Redux DevTools panel
2.  From here, you can view the global state of the application.
3.  To move the window around, press `CTRL + w`

### Running API Tests

1.  From a terminal window, run `npm run test` or `npm test` (both do the same thing)
2.  Let the tests run, it will generate a coverage window in the terminal once all the tests have completed running

### Continuous Integration

CI is provided by CircleCI and runs on every pull request to ensure tests pass. Merging is disabled until tests pass.
