var peers = {};
$(function () {
    var chat = $.connection.videoHub;
  
    var channel = chat.server;
    var streamManager = null;

    var getUserMediaFail = function () {
        $('#getUserMediaFail').show();
    };

    // Init
    var init = function () {
        //Try to get media stream
        if (navigator.getUserMedia) {
            navigator.getUserMedia('video', getUserMediaSuccess, getUserMediaFail);
        } else if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia({ video: true, /*audio: true*/ }, getUserMediaSuccess, getUserMediaFail);
        } else {
            getUserMediaFail();
        }
    };

    var getUserMediaSuccess = function (stream) {

        streamManager = new StreamManager(stream);

        chat.client.onMessage = function (message) {

            switch (message.type) {

                case 0: //Join
                    // Make an offer to all new peers because we're classy ;) 
                    makeOffer(message.peerId);
                    break;
                case 2: //Offer
                    //Accept all incoming offers because we're classy ;) 
                    acceptOffer(message.description, message.peerId);
                    break;
                case 3: //Answer
                    //Accept all incoming answers because we're classy ;) 
                    acceptAnswer(message.description, message.peerId);
                    break;
                case 4: //Candidate
                    addIceCandidate(message.description, message.peerId);
                    break;
                default:
                    console.log("Unknown message", message.message);
                    break;
            }
        };
        $.connection.hub.start().done(function () {
            chat.server.open();
        });
    };

    var getPeer = function (peerId) {
        var peer = peers[peerId];
        if (typeof (peer) == 'undefined') {
            peer = new Peer(peerId, channel, streamManager);
            peers[peerId] = peer;
        }
        return peer;
    };

    var makeOffer = function (peerId) {
        var peer = getPeer(peerId);
        peer.connect();
        return peer;
    };

    var acceptOffer = function (offer, peerId) {
        var peer = getPeer(peerId);
        peer.acceptOffer(offer);
        return peer;
    };

    var acceptAnswer = function (answer, peerId) {
        var peer = getPeer(peerId);
        peer.acceptAnswer(answer);
        return peer;
    };

    var addIceCandidate = function (candidate, peerId) {
        var peer = getPeer(peerId);
        peer.addIceCandidate(candidate);
        return peer;
    };
    init();

});