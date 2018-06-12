window.onload = function() {
    // TODO:: Do your initialization job

    // add eventListener for tizenhwkey
    document.addEventListener('tizenhwkey', function(e) {
        if (e.keyName === "back") {
            try {
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}
        }
    });
};

function showModal(id)
{
	document.getElementById(id).style.display = 'block';
}

function hideModal(id) 
{
    document.getElementById(id).style.display = 'none';
    id.stopPropagation();
}