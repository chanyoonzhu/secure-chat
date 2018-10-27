$(function(){
    //make connection
 var socket = io.connect('http://localhost:3000');

 //buttons and inputs
 var message = $("#message");
 var username = $("#username");
 var send_message = $("#send_message");
 var send_username = $("#send_username");
 var chatroom = $("#chatroom");
 var feedback = $("#feedback");

 //Emit message
 send_message.click(function(){

    //encryptipn
    var passPhrase = "Security1sF*n";
    var encrypted = CryptoJS.TripleDES.encrypt(message.val(), passPhrase, { 
        iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var messageEncrypted = encrypted.toString();
    console.log("ciphertext: " + messageEncrypted);

    // socket
    socket.emit('new_message', {message : messageEncrypted, username:username.html()});

 });

 //Listen on new_message
 socket.on("new_message", (data) => {
    feedback.html('');
    message.val('');

    // decryptipn
    var passPhrase = "Security1sF*n";
    var decrypted = CryptoJS.TripleDES.decrypt(data.message, passPhrase, {
        iv: CryptoJS.enc.Hex.parse('00000000000000000000000000000000'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var messageDecrypted = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("plaintext: " + messageDecrypted);

    // socket
    chatroom.append("<p class='message'>" + data.username + ": " + messageDecrypted + "</p>");
 });

 //Emit a username
 send_username.click(function(){
     socket.emit('change_username', {username : username.val()});
 });

 //Emit typing
 message.bind("keypress", () => {
     socket.emit('typing', {username:username.html()});
 });

 //Listen on typing
 socket.on('typing', (data) => {
     feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>");
 });
});