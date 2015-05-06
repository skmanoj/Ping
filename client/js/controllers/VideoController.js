/*
 *  Video Controller 
 */

chatApp.controller('VideoController', ['$scope', 'socketio',
	function($scope, socketio) {
		
		var isInitiator = false;
		var isStarted = false;
		var isChannelReady = false;
		var localVideoStream;
		var remoteVideoStream;
		$scope.callOrAnswer = 'Call';

		var constraints = {
			audio: true,
			video: true
		};

		socketio.on('message', function(message) {
			if(message === 'calling') {
				$scope.callOrAnswer = 'Answer';
			} else if(message === 'ending') {
				$scope.callOrAnswer = 'Call';		
			} else if(message === 'answered') {
				$scope.callOrAnswer = 'End';		
			}
		});

		$scope.videoConfInit = function() {
			if($scope.callOrAnswer === 'Call') {
				sendMessage('calling');
				$scope.callOrAnswer = 'Calling';
				initiateFirstUserVideo();
			} else if($scope.callOrAnswer === 'End') {
				sendMessage('ending');
				$scope.callOrAnswer = 'Call';
			} else if($scope.callOrAnswer === 'Answer') {
				sendMessage('answered');
				initiateFirstUserVideo();
				$scope.callOrAnswer = 'End';
			}
		}

		function sendMessage(message) {
 			 socketio.emit('message', message);
		}

		function initiateFirstUserVideo() {
			navigator.getUserMedia = navigator.getUserMedia ||
  			navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			navigator.getUserMedia(constraints, successCallback, errorCallback);			
		}
		
		function successCallback(localMediaStream) {
			window.stream = localMediaStream; // stream available to console
  			var video = document.getElementById("myvideo");
  			video.src = window.URL.createObjectURL(localMediaStream);
  			video.play();
		}

		function errorCallback(error){
  			console.log("navigator.getUserMedia error: ", error);
		}

	}]);