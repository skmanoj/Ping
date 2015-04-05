var chatApp = angular.module('chatApp',[]);

chatApp.factory('socketio', ['$rootScope', function ($rootScope) {

    'use strict';
        
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
                socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
	                callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);

/*
 *  Controllers
*/

chatApp.controller('BasicChatController', ['$scope', 'socketio', '$location', function($scope, socketio, $location) {
	// variables which hold the data for each person

	$scope.inviteScreen = false;
	$scope.connectScreen = false;
	$scope.personInside = false;
	$scope.tooManyPeople = false;
	$scope.leftUserWindow = false;
	$scope.noMsgWindow = false;
	$scope.chatScreenWindow = false;
	$scope.enterMsgWindow = false;
	$scope.link = $location.absUrl();

	$scope.name = '';
	$scope.email = '';
	$scope.lovelyChat = '';
	var img = '';
	$scope.validName = function() {
		return (!($scope.name.length > 1));
	}

	$scope.validEmail = function() {
		return !(isValid($scope.email));
	}

	$scope.sendLovelyChat = function() {
		if($scope.lovelyChat.length >= 1) {
			// Send the message to the other person in the chat
			$scope.chatScreenWindow = true;
			$scope.noMsgWindow = false;
			socketio.emit('msg', {msg: $scope.lovelyChat, user: $scope.name, img: img});
		} 
		$scope.lovelyChat = '';
	}

	var url = $scope.link.split("/");
	var id = url[url.length - 1];

	// on connection to server get the id of person's room
	socketio.on('connect', function(){
		socketio.emit('load', id);
	});

	// save the gravatar url
	socketio.on('img', function(data){
		console.log("imgg", data);
		img = data;
	});

		// receive the names and avatars of all people in the chat room
	socketio.on('peopleinchat', function(data){
		console.log("alertsss", data);
		if(data.number === 0) {
			$scope.connectScreen = true;
			$scope.update = function() {
				if(!($scope.validName()) && !($scope.validEmail())) {
					// call the server-side function 'login' and send user's parameters
					socketio.emit('login', {user: $scope.name, avatar: $scope.email, id: id});
					$scope.connectScreen = false;
					$scope.inviteScreen = true;
				}
			}
		} else if(data.number === 1) {
			console.log(data);
			$scope.personInside = true;
			$scope.firstUser = data.user;

			$scope.updateUser = function() {
				if(!($scope.validName()) && !($scope.validEmail())) {
					socketio.emit('login', {user: $scope.name, avatar: $scope.email, id: id});
					$scope.personInside = false;
				}
			}

		} else {
			$scope.tooManyPeople = true;
		}
		
	});

	socketio.on('tooMany', function(data){
		if(data.boolean && name.length === 0) {
			$scope.tooManyPeople = true;
		}
	});

	socketio.on('leave',function(data){
		if(data.boolean && id==data.room){
			$scope.enterMsgWindow = false;
			$scope.noMsgWindow = false;
			$scope.chatScreenWindow = false;
			$scope.leftUserWindow = true;
			$scope.leftUser = data.user;
		}
	});

	socketio.on('startChat', function(data){
		console.log(data);
		$scope.inviteScreen = false;
		
		if(data.boolean && data.id == id) {
			$scope.enterMsgWindow = true;
			$scope.noMsgWindow = true;

			if($scope.name === data.users[0]) {
				$scope.otherPerson = data.users[1];

			}
			else {
				$scope.otherPerson = data.users[0];
			}
		}
	});

	socketio.on('receive', function(data){
		$scope.chatScreenWindow = true;
		$scope.noMsgWindow = false;
		$scope.leftUserWindow = false;

	});

}]);

function isValid(thatemail) {

	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(thatemail);
}
