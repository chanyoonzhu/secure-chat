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
        var file = send_file.prop('files')[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            var buffer = fileReader.result; 
            console.log(buffer);
            socket.emit('upload', { 
                name: file.name, 
                type: file.type, 
                size: file.size, 
                data: buffer,
            }); 
        };
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
        message = decryptData(data.message);
        messageEncrypted = message['ciphertext'];
        messageDecrypted = message['plaintext'];

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

    //Listen on file transfer
    socket.on('upload', (data) => {
        console.log('transferred');
        console.log(data);
        console.log(data.type);
        var $download = $("<a>").hide();
        $download.attr('href', data.data)
                 .attr('download', data.name);
        $('body').append($download);
        $icon = $("<p class='message' ><img src='./images/blank-file.png'></p>")
                .click(function(){
                    $download[0].click();
                });
        chatroom.append($icon);
    });

    function submitMessage (){
        //encryptipn
        messageEncrypted = encryptData(message.val());
    
        // socket
        socket.emit('new_message', {message : messageEncrypted, username:username.html()});
    }

    function encryptData (data) {
        var passPhrase = localStorage.getItem('pw') + localStorage.getItem('salt');
        console.log('pw:' + passPhrase)
        var encrypted = CryptoJS.TripleDES.encrypt(data, passPhrase, { 
            iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var messageEncrypted = encrypted.toString();
        console.log("ciphertext: " + messageEncrypted);
        return messageEncrypted;
    }

    function decryptData (data) {
        var passPhrase = localStorage.getItem('pw') + localStorage.getItem('salt');
        var decrypted = CryptoJS.TripleDES.decrypt(data, passPhrase, {
            iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        var messageDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
        console.log("plaintext: " + messageDecrypted);
        message['plaintext'] = messageDecrypted;
        message['ciphertext'] = data;
        return message;
    }
});