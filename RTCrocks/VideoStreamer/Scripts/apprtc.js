/*Mute/unmute*/
function toggleVideoMute() {
    // Call the getVideoTracks method via adapter.js.
    videoTracks = localStream.getVideoTracks();

    if (videoTracks.length === 0) {
        console.log("No local video available.");
        return;
    }

    if (isVideoMuted) {
        for (i = 0; i < videoTracks.length; i++) {
            videoTracks[i].enabled = true;
        }
        console.log("Video unmuted.");
    } else {
        for (i = 0; i < videoTracks.length; i++) {
            videoTracks[i].enabled = false;
        }
        console.log("Video muted.");
    }

    isVideoMuted = !isVideoMuted;
}

function toggleAudioMute() {
    // Call the getAudioTracks method via adapter.js.
    audioTracks = localStream.getAudioTracks();

    if (audioTracks.length === 0) {
        console.log("No local audio available.");
        return;
    }

    if (isAudioMuted) {
        for (i = 0; i < audioTracks.length; i++) {
            audioTracks[i].enabled = true;
        }
        console.log("Audio unmuted.");
    } else {
        for (i = 0; i < audioTracks.length; i++) {
            audioTracks[i].enabled = false;
        }
        console.log("Audio muted.");
    }

    isAudioMuted = !isAudioMuted;
}

// Ctrl-D: toggle audio mute; Ctrl-E: toggle video mute.
// On Mac, Command key is instead of Ctrl.
// Return false to screen out original Chrome shortcuts.
document.onkeydown = function () {
    if (navigator.appVersion.indexOf("Mac") != -1) {
        if (event.metaKey && event.keyCode === 68) {
            toggleAudioMute();
            return false;
        }
        if (event.metaKey && event.keyCode === 69) {
            toggleVideoMute();
            return false;
        }
    } else {
        if (event.ctrlKey && event.keyCode === 68) {
            toggleAudioMute();
            return false;
        }
        if (event.ctrlKey && event.keyCode === 69) {
            toggleVideoMute();
            return false;
        }
    }
}
//=========================
//unused
function onHangup() {
    console.log("Hanging up.");
    transitionToDone();
    stop();
    // will trigger BYE from server
    socket.close();
}