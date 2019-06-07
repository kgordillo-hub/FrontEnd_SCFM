var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}

function connect() {
	//End point
    var socket = new SockJS('https://websocket-medical.azurewebsites.net/medical-devices-websocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
		//Suscripcion al topico
        stompClient.subscribe('/topic/medicalSignal', function (mensajebroadcast) {
            showGreeting(JSON.parse(mensajebroadcast.body).contenido);
        });
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
}

function sendName() {
    stompClient.send("/app/sendSignal", {}, JSON.stringify({'name': $("#name").val()}));
}

function showGreeting(message) {
	//alert(message);
	//var obj = JSON.parse(message);
    $("#greetings").append("<tr><td>" + message + "</td></tr>");
}


connect();
$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
   // $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
    $( "#send" ).click(function() { sendName(); });
});

