let keypressed = {};
//Allows tabs to indent in textarea
$(document).on('keydown', '#EditorArea', function(e) {
    var keyCode = e.keyCode;
    var start = this.selectionStart;
    var end = this.selectionEnd;
    if (e.keyCode === 9) {
        e.preventDefault();
        $(this).val(
            $(this).val().substring(0, start) +
            '\t' +
            $(this).val().substring(end)
        );
        this.selectionStart = this.selectionEnd = start + 1;
    }
});


//Stores which buttons are being pressed at all times
$(document).on('keydown', function(e) {
    keypressed[e.keyCode] = true;
    activateShortcut(e);
});
$(document).on('keyup', function(e) {
    keypressed[e.keyCode] = false;
    if (docSaved) {
        socket.emit('text updating', editor.getValue());
    }
});

function activateShortcut(e) {
    //if CTRL is pressed down
    if (keypressed[17]) {
        //if CTRL+s is pressed save page
        if (keypressed[83]) {
            e.preventDefault();
            savePage();
        }
    }

}
