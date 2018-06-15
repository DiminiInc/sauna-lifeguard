window.onload = function() {
    termsChecked();
    startConnection();

    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};

window.onunload = function() {
    client.disconnect();
}

function open_door() {
    var msgtext = "set ****	";

    message = new Paho.MQTT.Message(msgtext);

    message.destinationName = "devices/lora/807B859020000220/gpio";

    client.send(message);
}

var client;

var message;

startConnection();

function startConnection() {

    client = new Paho.MQTT.Client("10.11.162.178", Number(1884), "root");

    client.onConnectionLost = onConnectionLost;

    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
    });

}

function onConnect() {

    // Once a connection has been made, make a subscription.

    console.log("onConnect");

    //client.subscribe("devices/lora/807B859020000220/gpio");
    client.subscribe("devices/lora/#");


};

function onConnectionLost(responseObject) {

    if (responseObject.errorCode !== 0)

        console.log("onConnectionLost:" + responseObject.errorMessage);

};

function onMessageArrived(message) {
    var msg = message.payloadString;
    JSON.parse(msg);


};

function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

function hideModal(id)

{
    document.getElementById(id).style.display = 'none';
}

function colorChange() {
    document.getElementById("room1").style.backgroundColor = '#ddd';
}

function termsChecked() {

    var chk = document.getElementById('checkbox_room_1');
    if (chk.checked) {
        document.getElementById("room1").style.backgroundColor = '#7abd53';
    } else {
        document.getElementById("room1").style.backgroundColor = '#ddd';
    }
}

function stopBubble(event) {
    event.stopPropagation();
}