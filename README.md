# Ping

Ping is a [node.js] based chat server, and it has the capabilities like:

  - Creating private chat rooms
  - Video conferencing
  - Display pic of the user is shown using gravatar associated with user's mail id

### Tech

Ping is developed using the following open source libraries:

* [node.js] - evented I/O for the backend
* [socket.io] - enables real-time bidirectional event-based communication
* [AngularJS] - HTML enhanced for web apps!
* [Twitter Bootstrap] - great UI boilerplate for modern web apps
* [Express] - fast node.js network app framework
* [Nodemon] - Monitor for any changes in your node.js application and automatically restart the server - perfect for development
* [bower] - front end package manager
* [Gravatar] - Globally recognized avatar.

### How to deploy the application

You need [node.js] installed globally:

Go to the root directory of the application and run the following command to install node_modules

```sh
$ npm install
```

Go to the root directory of the application and run the following command to install front-end dependencies

```sh
$ bower install
```

To start the chat server, go to the root directory of the application and run

```sh
$ npm start
```

To make use of Ping, go to the following url in a browser

```sh
http://localhost:3000/
```

### Todo's

 - Use grunt to automate the tasks
 - Support for browsers like IE and safari
 - Write UnitTests

[node.js]:http://nodejs.org
[socket.io]:http://socket.io/
[Twitter Bootstrap]:http://twitter.github.com/bootstrap/
[Gravatar]:https://github.com/emerleite/node-gravatar
[express]:http://expressjs.com
[AngularJS]:http://angularjs.org
[Nodemon]:https://github.com/remy/nodemon
[bower]:http://bower.io/