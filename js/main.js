var sHost = "nim-rd.nuance.mobi";
var sPort = 9443;

var socketPath = "nina-webapi/nina";

// For the NinaStartSession CONNECT message
var nmaid = "Nuance_ConUHack2017_20170119_210049";
var nmaidKey = "0d11e9c5b897eefdc7e0aad840bf4316a44ea91f0d76a2b053be294ce95c7439dee8c3a6453cf7db31a12e08555b266d54c2300470e4140a4ea4c8ba285962fd";
var username = "websocket_sample";

// For the NinaStartSession COMMAND message. All set in the startSession() index.html page
var appName = "TakeMeThere";
var companyName = "Jon&Justin";
var applicationName = "TakeMeThere";
var cloudModelVersion = "1.0";
var clientAppVersion = "0.0";
var defaultAgent = "http://ac-srvozrtr01.dev.ninaweb.nuance.com/nuance-nim_team-englishus-WebBotRouter/jbotservice.asmx/TalkAgent";

// Audio handlers
var audioContext = initAudioContext();
var audioPlayer = new AudioPlayer(audioContext); // For the play audio command

// The current command (used when receiving end-of-speech and beginning-of-speech)
var currentCommand;

// The WebSocket
var socket;

// Where to go
var newlocation;

function initWebSocket() {

    socket = new WebSocket("wss://" + sHost + ":" + sPort + "/" + socketPath); // The WebSocket must be secure "wss://"
    socket.binaryType = "arraybuffer"; // Important for receiving audio

    socket.onopen = function () {
        console.log("WebSocket connection opened.");

        socket.send(JSON.stringify({
            connect: {
                nmaid: nmaid,
                nmaidKey: nmaidKey,
                username: username
            }
        }));
        var version = $("#api_version")[0];
        socket.send(JSON.stringify({
            command: {
                name: "NinaStartSession",
                logSecurity: "off",
                appName: appName,
                companyName: companyName,
                cloudModelVersion: cloudModelVersion,
                clientAppVersion: clientAppVersion,
                agentURL: defaultAgent,
                // apiVersion: version.options[version.selectedIndex].value
            }
        }));
        currentCommand = "NinaStartSession";
    };


    socket.onclose = function () {
        if (!alert("WebSocket connection closed.")) {
            window.location.reload(true);
        }
    };

    socket.onmessage = function (event) {
        console.log("socket RECEIVED:");
        var response = JSON.parse(event.data);
        var stringResult = JSON.stringify(response, null, 4);
        console.log(stringResult);
        var startIndex = stringResult.search("Take me to")
        var substring = stringResult.substr(startIndex+11);
        var endIndex = substring.search('"');
        var searchString = substring.substr(0, endIndex);
        newlocation = searchString;
    }
}

function startSession() {

    // Check parameters of the connection message.
    var lNmaid = nmaid;
    if (lNmaid.length > 0) {
        nmaid = lNmaid;
    }
    var lNmaidKey = nmaidKey;
    if (lNmaidKey.length > 0) {
        nmaidKey = lNmaidKey;
    }
    var lUsername = username;
    if (lUsername.length > 0) {
        username = lUsername;
    }
    // Check parameters of the start session message.
    var company_name = companyName;
    if (company_name.length > 0) {
        companyName = company_name;
    }
    var application_name = applicationName;
    if (application_name.length > 0) {
        appName = application_name;
    }

    if (socket === undefined) {
        initWebSocket();
    }
}

function endSession() {

    defaultAgent = "";

    socket.send(JSON.stringify({
        command: {
            name: "NinaEndSession",
        }
    }));
    currentCommand = "NinaEndSession";
}

function startSpeechRecog() {
    socket.send(JSON.stringify({
        command: {
            "name" : "NinaDoSpeechRecognition",
            "sr_engine" : "MREC"
        }
    }));
}

var audioRecorder = new AudioRecorder(new AudioContext());
var shouldStopRecording = false;

function startRecording() {
    audioRecorder.start().then(

        function() {
            console.log("Recorder stopped.");
        },

        function() {
            console.log("Recording failed!!");
        },


        //SEND DATA TO WEBSOCKET HERE
        function(data) {
            console.log("Audio data received...");

            if (shouldStopRecording) {
                return;
            }

            var frames = data[0];

            //SENDING AUDIO TO WEBSOCKET
            socket.send(frames.buffer);

        }


    );
}

function stopRecording() {
    shouldStopRecording = true;

    audioRecorder.stop();
    audioRecorder = undefined;

    socket.send(JSON.stringify({
        endcommand: {}
    }));
}