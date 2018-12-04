$(function(){

    // import crypto library
    var pbkdf2 = require('pbkdf2');
    var crypto = require('crypto');
    var dh = require('diffie-hellman');

    //Create Dillie-Hellman Object
    var dhPrime = localStorage.getItem('dhPrime'); 
    const alice = dh.createDiffieHellman(dhPrime);
    var aliceKey = alice.generateKeys();
    var bobKey = aliceKey;
    var aliceSecret = alice.computeSecret(bobKey);

    //generate key
    var derivedKey;
    var initialSalt = localStorage.getItem('salt');
    var salt;
	generateKey();
    //make connection
    var socket = io.connect('http://localhost:3000');

    //buttons and inputs
    var message = $("#message");
    var username = $("#username");
    var send_message = $("#send_message");
    var send_file = $("#send_file");
    var submit_file = $("#submit_file");
    var chatroom = $("#chatroom");
    var feedback = $("#feedback");
    var usernameplain = username.html();
    var isFile = false;

    // on file upload change
    send_file.change(function(){
        isFile = true;
        var filename = send_file[0].files[0].name;
        message.val(filename);
    });

    //Transfer file
    submit_file.click(function(e){
        e.preventDefault();
        var file = send_file.prop('files')[0];
        var fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            var buffer = fileReader.result; 
            dataEncrypted = encryptData(buffer)
            socket.emit('upload', { 
                username: usernameplain,
                name: file.name, 
                type: file.type, 
                size: file.size, 
                data: dataEncrypted,
            }); 
        };
        return false;
    });

    //Emit message
    message.keypress(function (e) {
        if (e.which == 13) {
            if (isFile) {
                submit_file.trigger('click');
                isFile = false;
                message.val("");
            } else {
                submitMessage();
            }
        }
    });

   
    send_message.click(function(){
        if (isFile) {
            submit_file.trigger('click');
            isFile = false;
            message.val("");
        } else {
            submitMessage();
        }
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
        salt = data.salt;
    });

    //Listen on key-exchange
    socket.on('key-exchange', () => {
        alice.setPrivateKey(String.fromCharCode.apply(null, crypto.randomBytes(32)), 'ascii');
        newAliceKey = alice.generateKeys();
        socket.emit('dhKey-send', {username: usernameplain, dhKey : newAliceKey});
    });

    //Listen to dhKey-receive
    socket.on('dhKey-receive', (data) => {
        if(data.username != usernameplain){
            //bobKey = data.dhKey.toString('ascii');
            bobKey = data.dhKey.data;
            aliceSecret = alice.computeSecret(bobKey);
            //console.log(aliceSecret);
            derivedKey = pbkdf2.pbkdf2Sync(aliceSecret, salt, 4096, 8, 'sha512');
            console.log('New session key: ' + derivedKey);
        }
    });

    //Listen on file transfer
    socket.on('upload', (data) => {
        var message = decryptData(data.data);
        var messageEncrypted = message['ciphertext'];
        var messageDecrypted = message['plaintext'];
        var $download = $("<a>").hide();
        $download.attr('href', messageDecrypted)
                 .attr('download', data.name);
        $('body').append($download);
        if(isImageDataUrl(messageDecrypted)) {
            $icon = $("<p class='message image'>" + data.username + ": " + data.name + "  <img width='40' height='40' src='" + messageDecrypted + "'></p>");
        } else {
            $icon = $("<p class='message' >" + data.username + ":<img src='images/blank-file.png'>" + data.name + "</p>")
        }
        $icon.click(function(){
            $download[0].click();
        });
        chatroom.append($icon);
    });

    function isImageDataUrl (dataUrl) {
        prefix = "data:";
        prefixLen = prefix.length;
        startIdx = prefixLen;
        meme = "image";
        endIdx = startIdx + meme.length;
        console.log(dataUrl.substring(startIdx, endIdx));
        return dataUrl.substring(startIdx, endIdx) == meme;
    }

    function submitMessage (){
        //encryptipn
        messageEncrypted = encryptData(message.val());
    
        // socket
        socket.emit('new_message', {message : messageEncrypted, username:username.html()});
    }

    function encryptData (data) {
        const keyHex = new Buffer(derivedKey);
        const cipher = crypto.createCipheriv('des-cbc', keyHex, keyHex);
        let c = cipher.update(data, 'utf8', 'base64');
        c += cipher.final('base64');
        var messageEncrypted = c.toString();
        return messageEncrypted;
    }

    function decryptData (data) {
		const keyHex = new Buffer(derivedKey);
        const cipher = crypto.createDecipheriv('des-cbc', keyHex, keyHex);
        let c = cipher.update(data, 'base64', 'utf8');
        c += cipher.final('utf8');
        var messageDecrypted = c.toString();
        console.log("plaintext: " + messageDecrypted);
        console.log("ciphertext: " + data);
        message['plaintext'] = messageDecrypted;
        message['ciphertext'] = data;
        return message;
    }
	
	//generate key
	function generateKey(){
        var passWord = localStorage.getItem('pw');
        derivedKey = pbkdf2.pbkdf2Sync(passWord, initialSalt, 4096, 8, 'sha512');
        console.log('Initial session key: ' + derivedKey);
        localStorage.removeItem('pw');
        localStorage.removeItem('salt');
	}
});