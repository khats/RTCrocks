// Remote peer
var Peer = function (peerId, channel, streamManager) {

    var _streamManager = streamManager;
    _peerId = peerId;
    var _channel = channel;
    var _peerConnection = null;
    var _dataChannel = null;
    var _config = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

    var createPeerConnection = function () {
        if (window.RTCPeerConnection) {
            return new RTCPeerConnection(_config);
        } else if (window.webkitRTCPeerConnection) {
            return new webkitRTCPeerConnection(_config);
        } else if (window.mozRTCPeerConnection) {
            return new mozRTCPeerConnection(_config);
        }
    };

    var init = function () {

        _peerConnection = createPeerConnection();
        _peerConnection.addEventListener('error', onError);
        _peerConnection.addEventListener('addstream', onAddStream);
        _peerConnection.addEventListener('removestream', onRemoveStream);
        _peerConnection.addEventListener('statechange', onStateChange);
        _peerConnection.addEventListener('icecandidate', onIceCandidate);
        _peerConnection.addEventListener('datachannel', onDataChannel);
        // Add the local stream
        _peerConnection.addStream(_streamManager.getLocalStream());

    };

    var onIceCandidate = function (event) {
        if (event.candidate) {
            var message = { type: 4, description: btoa(JSON.stringify(event.candidate)),peerId:_peerId };
            _channel.send(message);
        } else {
            console.log('Null ICE candidate');
        }
    };

    var onError = function (event) {

        console.log("onError", arguments);
    };

    var onStateChange = function (event) {

        if(_peerConnection.readyState == "active") {
                _dataChannel = _peerConnection.createDataChannel('data');
                _dataChannel.addEventListener('open', onChannelOpen);
        }

        console.log('State', _peerConnection.readyState);
    };

    var onDataChannel = function (event) {
        console.log('onDataChannel', arguments);
    };

    var onChannelOpen = function (event) {
        console.log('onChannelOpen', arguments);
    };

    var onAddStream = function (event) {
        console.log("onAddStream", arguments);
        _streamManager.addStream(event.stream);

    };

    var onRemoveStream = function (event) {
        console.log("onRemoveStream", arguments);
        _streamManager.removeStream(event.stream);
    };

    var createOfferCallback = function (offer) {
        _peerConnection.setLocalDescription(offer);
        console.log("createOfferCallback", offer);
        offer = btoa(JSON.stringify(offer));
        var message = { type: 2, description: offer, peerId: _peerId };
        _channel.send(message);

    };

    var createAnswerCallback = function (answer) {
        _peerConnection.setLocalDescription(answer);
        console.log("createAnswerCallback", answer);
        answer = btoa(JSON.stringify(answer));
        var message = { type: 3, description: answer, peerId: _peerId };
        _channel.send(message);

    };

    this.connect = function () {

        console.log("connect", arguments);
        _peerConnection.createOffer(createOfferCallback);

    };

    this.acceptOffer = function (offer) {
        offer = JSON.parse(atob(offer));
        console.log("acceptOffer", offer);
        _peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        setTimeout(function () {
            _peerConnection.createAnswer(createAnswerCallback);
        },0);
        
    };

    this.acceptAnswer = function (answer) {
        answer = JSON.parse(atob(answer));
        console.log("acceptAnswer", answer);
        setTimeout(function() {
            _peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        },0);
    };

    this.addIceCandidate = function (candidate) {
        candidate = JSON.parse(atob(candidate));
        console.log("addIceCandidate", candidate);
        setTimeout(function() {
            _peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        },0);

    };

    init();

};