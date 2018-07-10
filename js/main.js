window.onload = function() {
    var i;
    for (i = 1; i < 10; i++) {
        termsChecked(i);
    }

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
};

var client;

var message;

startConnection();

function startConnection() {

    client = new Paho.MQTT.Client("10.11.162.241", Number(1884), "root");

    client.onConnectionLost = onConnectionLost;

    client.onMessageArrived = onMessageArrived;

    client.connect({
        onSuccess: onConnect
    });

}

function onConnect() {

    // Once a connection has been made, make a subscription.

    console.log("onConnect");

    client.subscribe("devices/lora/#");


};

function onConnectionLost(responseObject) {

    if (responseObject.errorCode !== 0)

        console.log("onConnectionLost:" + responseObject.errorMessage);

};

function onMessageArrived(message) {

	try{
    var msg = message.payloadString;
    var obj = JSON.parse(msg);
    var devEUI = obj.status.devEUI;
	


    if (devEUI == "807B859020000258") {
        var chk = document.getElementById('checkbox-room-1');
        if (chk.checked) {
            WorkWithData(obj, devEUI, 1);
        }
    } else if (devEUI == "***") {
        var chk = document.getElementById('checkbox-room-2');
        if (chk.checked) {
            WorkWithData(obj, devEUI, 2);
        }
    } else if (devEUI == "***") {
        var chk = document.getElementById('checkbox-room-3');
        if (chk.checked) {
            WorkWithData(obj, devEUI, 3);
        }
    }
	}catch(e){
	}

}

function WorkWithData(obj, devEUI, numRoom) {


    var temperature = obj.data.temperature;
    var humidity = obj.data.humidity;
    var motion = obj.data.value;
    if (temperature != undefined) {
        document.getElementById(numRoom + "-3-1").innerHTML = document.getElementById(numRoom + "-2-1").innerHTML;
        document.getElementById(numRoom + "-2-1").innerHTML = document.getElementById(numRoom + "-1-1").innerHTML;
        document.getElementById(numRoom + "-1-1").innerHTML = temperature;

        document.getElementById(numRoom + "-3-2").innerHTML = document.getElementById(numRoom + "-2-2").innerHTML;
        document.getElementById(numRoom + "-2-2").innerHTML = document.getElementById(numRoom + "-1-2").innerHTML;
        document.getElementById(numRoom + "-1-2").innerHTML = humidity;

        GpioGet24(devEUI);

        if (temperature > 120) {
            document.getElementById("room" + numRoom).style.backgroundColor = '#ec5341';
            alert("Temperature in room " + numRoom + " is too high!");
        }
    }

    if (motion == 1 || motion == 0) {
        document.getElementById(numRoom + "-3-3").innerHTML = document.getElementById(numRoom + "-2-3").innerHTML;
        document.getElementById(numRoom + "-2-3").innerHTML = document.getElementById(numRoom + "-1-3").innerHTML;
        document.getElementById(numRoom + "-1-3").innerHTML = motion;

        if (document.getElementById(numRoom + "-1-3").innerHTML == "0" && document.getElementById(numRoom + "-2-3").innerHTML == "0" && document.getElementById(numRoom + "-3-3").innerHTML == "0") {
            document.getElementById("room" + numRoom).style.backgroundColor = '#ec5341';
            GpioSet251(devEUI);
            alert("There is no motion in room " + numRoom + " for a long period!");
        }

        if (document.getElementById(numRoom + "-1-3").innerHTML == "0" && document.getElementById(numRoom + "-2-3").innerHTML == "0") {
            GpioSet251(devEUI);
            GpioGet24(devEUI);
        }
    }
}

//make sound
function GpioGet24(devEUI) {
    var msgtext = "get 24";

    message = new Paho.MQTT.Message(msgtext);

    message.destinationName = "devices/lora/" + devEUI + "/gpio";
    client.send(message);

}

//get motion
function GpioSet251(devEUI) {
    var msgtext = "set 25 1";

    message = new Paho.MQTT.Message(msgtext);

    message.destinationName = "devices/lora/" + devEUI + "/gpio";
    client.send(message);

}



function showModal(id) {
    document.getElementById(id).style.visibility = 'visible';
    document.getElementById(id).style.opacity = '1';
}

function hideModal(id)
{
    document.getElementById(id).style.visibility = 'hidden';
    document.getElementById(id).style.opacity = '0';
}

function showRoomModal(id, room) {
	document.getElementById(id).style.visibility = 'visible';
    document.getElementById(id).style.opacity = '1';
    document.getElementById("toggle-room-" + room).style.display = 'block';
    document.getElementById("Table-" + room).style.display = 'table';
    document.getElementById("room-info").setAttribute("onclick", "hideRoomModal('room-info','" + room + "'); return false;");
}

function hideRoomModal(id, room)
{
    document.getElementById(id).style.visibility = 'hidden';
    document.getElementById(id).style.opacity = '0';
    document.getElementById("toggle-room-" + room).style.display = 'none';
    document.getElementById("Table-" + room).style.display = 'none';
}

function colorChange() {
    document.getElementById("room1").style.backgroundColor = '#ddd';
}

function termsChecked(roomID) {
    var chk = document.getElementById('checkbox-room-' + roomID);
    if (chk.checked) {
        document.getElementById("room" + roomID).style.backgroundColor = '#7abd53';
    } else {
        document.getElementById("room" + roomID).style.backgroundColor = '#ddd';
    }
}

function stopBubble(event) {
    event.stopPropagation();
}