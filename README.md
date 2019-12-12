# SmartBoxApp

... is a JavaScript / HTML Web Application providing a lightweight Sonos controller and a remote control for multiple 433MHz RF sockets running on NodeJS. Both app modules require backends providing the REST APIs. 
- The Sonos REST Api is provided by https://github.com/jishi/node-sonos-http-api.git
- The RC433 RF REST API is provided by  .....

This Web App is based on Oracle JET, an extension toolkit using numerous different JS frameworks. See http://www.oraclejet.org 

## Installation
I recommend to install the complete solution from the docker composition I uploaded to https://github.com/rockydaddy/SmartBoxDocker which incorporates this repo. The docker repo will create and run all required backends as well as the Web App. But if you have already set up the backend servers on your own and you would just like to install this WebApp individually, or if you would like to use this Web App for a template to develop your own app, then run the following installation procedure. 

SmartBoxApp requires [Node.js](https://nodejs.org/) v4+ to run.
  - Download this app repository
```sh
$ git clone https://github.com/rockydaddy/SmartBoxApp.git
$ cd SmartBoxApp/static/data
```
  - Update the Sonos configuration to point to the API Server addresses (use a text editor of your choice, here it's vi)
```sh
$ vi sonosConfig.js
```
  - update `var basisUrl = "http://192.168.0.6:5005/";` pointing to your Sonos REST API backend
  - Update the RC433 configuration to point to the API Server addresses (use a text editor of your choice, here it's vi)
```sh
$ vi rc433Config.js
```
  - update `var basisUrl = "http://192.168.0.6:5005/";` pointing to your RC433 REST API backend
  - Navigate back to the app root directory and install all required node modules
```sh
$ cd ../../
$ npm install
```
  - run the server 
```sh
$ npm start
```
  - Mind that the NodeJS HTTP server of this app is configured to listen on port 80. If you are required to change this edit `server.js` -> `app.listen(80)` and give the proper port.
