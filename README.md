# Public Cloud Cost Visualizer

## Background

Cloud computing solutions are attractive to cloud customers because they offer the leasing of computing resources at relatively low costs. 

## Objectives

* Identify various cloud computing solutions and aggregate the factors used in their pricing models and billing units. 

* Construct a front-end interface that provides visitors with useful visualizations between different cloud computing solutions. 

* Construct a solid back-end with a well defined API. 

## Installing the Cloudwatch API (fresh install Ubuntu 16.04)
### curl
* sudo apt-get upgrade
* sudo apt-get install curl

### Docker
* curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
* sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
* sudo apt-get update
* apt-cache policy docker-ce
* sudo apt-get install -y docker-ce

### Node-js
* sudo apt-get update
* sudo apt-get install --yes nodejs
* sudo apt-get install --yes nodejs-legacy
* sudo apt-get install --yes npm

### Starting the API
* navigate to "cloudwatch" folder
* bash ./runapi.sh

### How to use
* see "cloudwatch/readme.md" 

## Installing the Cloudvisualizer

* install <a href="https://nodejs.org/en/download/">NodeJS</a>
* navigate to the "MVP Prototype" directory 
* run "npm install" to get all the dependencies
* start the NodeJS server by running "node app.js -a {IP address of cloudwatch API}"
* visit <a href="http://localhost:3000">localhost:3000</a>

