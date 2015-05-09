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

		var localVideo = document.getElementById('myvideo');
		var remoteVideo = document.getElementById('hervideo');

		var isFirefox = false;

		var pc;	
		var pc_config;

		window.turnserversDotComAPI.iceServers(function(data) {
  			 pc_config = {
  				'iceServers': data
			};
			console.log(data);
		});


		//Tells the other peer that you would like to receive video or audio from them.
		var sdpConstraints = {
  			'mandatory': {
    			'OfferToReceiveAudio': true,
    			'OfferToReceiveVideo': true
  			}
		};

		var constraints = {
			audio: true,
			video: true
		};

		socketio.on('message', function(message) {
			if(message === 'calling') {
				$scope.callOrAnswer = 'Answer';
			} else if(message === 'ending') {
				endCall();
				$scope.callOrAnswer = 'Call';		
			} else if(message === 'answered') {
				isChannelReady = true;
				$scope.callOrAnswer = 'End';		
			} else if(message === 'Got user media') {
				maybeStart();
			} else if (message.type === 'offer') {
				console.log('handling offer');
    			if (!isInitiator && !isStarted) {
    				isChannelReady = true;	
      				maybeStart();
    			}
    			pc.setRemoteDescription(new getSessionDescription(message));
    			doAnswer();
    		} else if (message.type === 'candidate' && isStarted) {
    			console.log('handling candidate');
    			var candidate = getIceCandidate({
      				sdpMLineIndex: message.label,
      				candidate: message.candidate
    			});
    			pc.addIceCandidate(candidate);
  			} else if (message.type === 'answer' && isStarted) {
    			pc.setRemoteDescription(new getSessionDescription(message));
  			} 
		});

		$scope.videoConfInit = function() {
			if($scope.callOrAnswer === 'Call') {
				sendMessage('calling');
				isInitiator = true;
				$scope.callOrAnswer = 'Calling';
				initiateFirstUserVideo();
			} else if($scope.callOrAnswer === 'End') {
				sendMessage('ending');
				endCall();
				$scope.callOrAnswer = 'Call';
			} else if($scope.callOrAnswer === 'Answer') {
				sendMessage('answered');
				initiateFirstUserVideo();
				$scope.callOrAnswer = 'End';
			}
		}

		//ending a call
		function endCall() {
			pc.close();
			pc = null;
			isInitiator = false;
			isStarted = false;
			isChannelReady = false;
		}

		function sendMessage(message) {
 			 socketio.emit('message', message);
		}

		function initiateFirstUserVideo() {
			navigator.getUserMedia = navigator.getUserMedia ||
  			navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			navigator.getUserMedia(constraints, handleUserMedia, handleUserMediaError);	
			if(navigator.mozGetUserMedia) {
   				 isFirefox = true;
  			}
			if (location.hostname != "localhost") {
				console.log("turn initiating");
    			requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913');
  			}		
		}
		
		function handleUserMedia(stream) {
 			console.log('Adding local stream.');
  			localVideo.src = window.URL.createObjectURL(stream);
  			localVideoStream = stream;
  			sendMessage('Got user media');
		    if (isInitiator) {
    			maybeStart();
  			}
		}

		function handleUserMediaError(error){
  			console.log("navigator.getUserMedia error: ", error);
		}

		function maybeStart() {
			console.log('isStarted: '+isStarted+ ' localVideoStream: '+typeof localVideoStream+ ' isChannelReady: '+isChannelReady);
			if (!isStarted && typeof localVideoStream != 'undefined' && isChannelReady) {
				console.log("in maybeStart()");
    			createPeerConnection();
    			pc.addStream(localVideoStream);
    			// Add data channels
    			//createDataConnection();
    			isStarted = true;
    			//   console.log('isInitiator', isInitiator);
    			if (isInitiator) {
    				console.log("in doCall()");
      				doCall();
    			}
  			}
		}

		//This event allows you to display a message in a confirmation dialog box 
		//to inform the user whether he/she wants to stay or leave the current page.
		window.onbeforeunload = function(e) {
  			sendMessage('bye');
		}

		/////////////////////////////////////////////////////////
		// Next we setup the data channel between us and the far
		// peer. This is bi-directional, so we use the same
		// connection to send/recv data. However its modal in that
		// one end of the connection needs to kick things off,
		// so there is logic that varies based on if the JS
		// script is acting as the initator or the far end.
		/////////////////////////////////////////////////////////

		function createPeerConnection() {
		  try {
		    var servers = null;
		    pc = new getRTCPeerConnection(servers, {
		      optional: [{
		        RtpDataChannels: true
		      }]
		    });
		    pc.onicecandidate = handleIceCandidate;
		    pc.onaddstream = handleRemoteStreamAdded;
		    pc.onremovestream = handleRemoteStreamRemoved;

		  } catch (e) {
		    console.log('Failed to create PeerConnection, exception: ' + e.message);
		    alert('Cannot create RTCPeerConnection object.');
		    return;
		  }
		}

		function getSessionDescription(message) {
		  if(isFirefox){
		    return new mozRTCSessionDescription(message);
		  }
		  else{
		    return new RTCSessionDescription(message);
		  }
		}

		function getIceCandidate(params) {
		  if(isFirefox){
		    return new mozRTCIceCandidate(params);
		  }
		  else{
		    return new RTCIceCandidate(params);
		  }
		}

		function getRTCPeerConnection(params) {
		  if(isFirefox){
		    return new mozRTCPeerConnection(params);
		  }
		  else{
		    return new webkitRTCPeerConnection(params);
		  }
		}

		function handleIceCandidate(event) {
		  if (event.candidate) {
		    sendMessage({
		      type: 'candidate',
		      label: event.candidate.sdpMLineIndex,
		      id: event.candidate.sdpMid,
		      candidate: event.candidate.candidate
		    });
		  } else {
		    console.log('End of candidates.');
		  }
		}

		function handleRemoteStreamAdded(event) {
		  console.log('Remote stream added.');
		  remoteVideo.src = window.URL.createObjectURL(event.stream);
		  remoteVideoStream = event.stream;
		}

		function handleCreateOfferError(event) {
		  console.log('createOffer() error: ', e);
		}

		function doCall() {
		  console.log('Sending offer to peer');
		  pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
		}

		function doAnswer() {
		  console.log('Sending answer to peer.');
		  if(isFirefox) {  
		    pc.createAnswer(setLocalAndSendMessage, handleCreateAnswerError, sdpConstraints);
		  }
		  else {
		    pc.createAnswer(setLocalAndSendMessage, null, sdpConstraints);
		  }
		}

		function setLocalAndSendMessage(sessionDescription) {
		  // Set Opus as the preferred codec in SDP if Opus is present.
		  sessionDescription.sdp = preferOpus(sessionDescription.sdp);
		  pc.setLocalDescription(sessionDescription);
		  console.log('sending description'+sessionDescription);
		  sendMessage(sessionDescription);
		}

		function handleCreateAnswerError(error) {
		  console.log('createAnswer() error: ', e);
		}

		function requestTurn(turn_url) {
		  var turnExists = false;
		  for (var i in pc_config.iceServers) {
		    if (pc_config.iceServers[i].url.substr(0, 5) === 'turn:') {
		      turnExists = true;
		      turnReady = true;
		      break;
		    }
		  }
		  if (!turnExists) {
		    console.log('Getting TURN server from ', turn_url);
		    // No TURN server. Get one from computeengineondemand.appspot.com:
		    var xhr = new XMLHttpRequest();
		    xhr.onreadystatechange = function() {
		      if (xhr.readyState === 4 && xhr.status === 200) {
		        var turnServer = JSON.parse(xhr.responseText);
		        console.log('Got TURN server: ', turnServer);
		        pc_config.iceServers.push({
		          'url': 'turn:' + turnServer.username + '@' + turnServer.turn,
		          'credential': turnServer.password
		        });
		        turnReady = true;
		      }
		    };
		    xhr.open('GET', turn_url, true);
		    xhr.send();
		  }
		}

		function handleRemoteStreamAdded(event) {
		  console.log('Remote stream added.');
		  remoteVideo.src = window.URL.createObjectURL(event.stream);
		  remoteVideoStream = event.stream;
		}

		function handleRemoteStreamRemoved(event) {
		  console.log('Remote stream removed. Event: ', event);
		}



		function handleRemoteHangup() {
		  //  console.log('Session terminated.');
		  // stop();
		  // isInitiator = false;
		}



		// Set Opus as the default audio codec if it's present.
		function preferOpus(sdp) {
		  var sdpLines = sdp.split('\r\n');
		  var mLineIndex;
		  // Search for m line.
		  for (var i = 0; i < sdpLines.length; i++) {
		    if (sdpLines[i].search('m=audio') !== -1) {
		      mLineIndex = i;
		      break;
		    }
		  }
		  if (mLineIndex === null) {
		    return sdp;
		  }

		  // If Opus is available, set it as the default in m line.
		  for (i = 0; i < sdpLines.length; i++) {
		    if (sdpLines[i].search('opus/48000') !== -1) {
		      var opusPayload = extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
		      if (opusPayload) {
		        sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload);
		      }
		      break;
		    }
		  }

		  // Remove CN in m line and sdp.
		  sdpLines = removeCN(sdpLines, mLineIndex);

		  sdp = sdpLines.join('\r\n');
		  return sdp;
		}

		function extractSdp(sdpLine, pattern) {
		  var result = sdpLine.match(pattern);
		  return result && result.length === 2 ? result[1] : null;
		}

		// Set the selected codec to the first in m line.
		function setDefaultCodec(mLine, payload) {
		  var elements = mLine.split(' ');
		  var newLine = [];
		  var index = 0;
		  for (var i = 0; i < elements.length; i++) {
		    if (index === 3) { // Format of media starts from the fourth.
		      newLine[index++] = payload; // Put target payload to the first.
		    }
		    if (elements[i] !== payload) {
		      newLine[index++] = elements[i];
		    }
		  }
		  return newLine.join(' ');
		}

		// Strip CN from sdp before CN constraints is ready.
		function removeCN(sdpLines, mLineIndex) {
		  var mLineElements = sdpLines[mLineIndex].split(' ');
		  // Scan from end for the convenience of removing an item.
		  for (var i = sdpLines.length - 1; i >= 0; i--) {
		    var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
		    if (payload) {
		      var cnPos = mLineElements.indexOf(payload);
		      if (cnPos !== -1) {
		        // Remove CN payload from m line.
		        mLineElements.splice(cnPos, 1);
		      }
		      // Remove CN line in sdp
		      sdpLines.splice(i, 1);
		    }
		  }

		  sdpLines[mLineIndex] = mLineElements.join(' ');
		  return sdpLines;
		}

	}]);