/*
 *  Video Controller 
 */

chatApp.controller('VideoController', ['$scope', 'socketio',
	function($scope, socketio) {
		var constraints = {
			audio: true,
			video: true
		};

		$scope.videoConfInit = function() {
			navigator.getUserMedia = navigator.getUserMedia ||
  			navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			navigator.getUserMedia(constraints, successCallback, errorCallback);
		};
		
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