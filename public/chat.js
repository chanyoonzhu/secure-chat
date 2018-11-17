$(function(){
    //make connection
    var socket = io.connect('http://localhost:3000');

    //buttons and inputs
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_file = $("#send_file");
    var submit_file = $("#submit_file");
    var send_username = $("#send_username");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");

    submit_file.click(function(e){
        e.preventDefault();
        // var fileReader = new FileReader();
        // fileReader.onload = function () {
        //     var data = fileReader.result;  // data <-- in this var you have the file data in Base64 format
        // };
        // fileReader.readAsDataURL(send_file.prop('files')[0]);
        var formData = new FormData(send_file);
        formData.append('secretFile', send_file.prop('files')[0]);
        // console.log(fileReader.result);
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/upload",
            data: formData,
            cache: false,
            contentType: false,
            enctype: 'multipart/form-data',
            processData: false,
            processData: false,
            contentType: false,
            cache: false,
            success: function(r){
                console.log("result",r)
            },
            error: function (e) {
                console.log("some error", e);
            }
        });
        return false;
    });

    //Emit message
    message.keypress(function (e) {
        if (e.which == 13) {
            submitMessage();
        }
    });

   
    send_message.click(function(){
        submitMessage();
    });

    //Listen on new_message
    socket.on("new_message", (data) => {
        feedback.html('');
        message.val('');

        // decryptipn
        var passPhrase = localStorage.getItem('pw') + localStorage.getItem('salt');
        var decrypted = CryptoJS.TripleDES.decrypt(data.message, passPhrase, {
            iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var messageDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
        console.log("plaintext: " + messageDecrypted);

        // socket
        chatroom.append("<p class='message'>" + data.username + ": " + messageDecrypted + "</p>");

        // scroll chat screen to bottom 
        var chatPanel = document.getElementById("chatroom");
        chatPanel.scrollTop = chatPanel.scrollHeight;
    });

    //Listen on salt change
    socket.on('salt_change', (data) => {
        localStorage.setItem('salt', data.salt);
    });

    //Emit typing
    message.bind("keypress", () => {
        socket.emit('typing', {username:username.html()});
    });

    //Listen on typing
    socket.on('typing', (data) => {
        feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
    });

    function submitMessage (){
        //encryptipn
        var passPhrase = localStorage.getItem('pw') + localStorage.getItem('salt');
        console.log('pw:' + passPhrase)
        var encrypted = CryptoJS.TripleDES.encrypt(message.val(), passPhrase, { 
            iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var messageEncrypted = encrypted.toString();
        console.log("ciphertext: " + messageEncrypted);
    
        // socket
        socket.emit('new_message', {message : messageEncrypted, username:username.html()});
    }
});