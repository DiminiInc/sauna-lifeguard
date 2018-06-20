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

function open_door() {
    var msgtext = "gpio get 24";

    message = new Paho.MQTT.Message(msgtext);

    message.destinationName = "devices/lora/807B859020000258/gpio";

    client.send(message);
   //alert(msgtext);
}

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

    //client.subscribe("devices/lora/807B859020000258/bme280");
    client.subscribe("devices/lora/#");


};

function onConnectionLost(responseObject) {

    if (responseObject.errorCode !== 0)

        console.log("onConnectionLost:" + responseObject.errorMessage);

};

function onMessageArrived(message) {	
	
    var msg = message.payloadString;
    //alert(msg)
    var obj = JSON.parse(msg);
    var devEUI = obj.status.devEUI;
    alert(msg);
    if (devEUI == "807B859020000258") {
        var chk = document.getElementById('checkbox-room-1');

        if (chk.checked) {
        	//open_door();
        	var motion = 'true';
        	var temperature = 'true';
        	var humidity = 'true';
        	
            motion = obj.data.value;
            temperature = obj.data.temperature;
            humidity = obj.data.humidity;
            alert("hum = " + humidity);
            document.getElementById("1-1-1").innerHTML = temperature;
            document.getElementById("1-1-2").innerHTML = humidity;
            document.getElementById("1-1-3").innerHTML = motion;
           
        }
    }
        
}


function showModal(id) {
    document.getElementById(id).style.display = 'block';
}

function hideModal(id)

{
    document.getElementById(id).style.display = 'none';
}

function showRoomModal(id, room) {
    document.getElementById(id).style.display = 'block';
    document.getElementById(room).style.display = 'block';
    document.getElementById("room-info").setAttribute("onclick", "hideRoomModal('room-info','" + room + "'); return false;");
}

function hideRoomModal(id, room)

{
    document.getElementById(id).style.display = 'none';
    document.getElementById(room).style.display = 'none';
}

function colorChange() {
    document.getElementById("room1").style.backgroundColor = '#ddd';
}

function termsChecked(roomID) {
	var newDir, newFile;
	tizen.filesystem.resolve("documents", function(dir) 
	    {
	       newDir = dir.createDirectory("newDir");
	       newFile = newDir.createFile("newFilePath.txt");
	       newFile.openStream(
	        "w",
	        function(fs) {
	        	 fs.write("test test test");
	        	 fs.close();
	        }, function(e) {
	        	 console.log("Error " + e.message);
	        }, "UTF-8");
	    });
	    
	
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