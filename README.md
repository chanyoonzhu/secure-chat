# secure-chat
Secure Instant Point-to-Point (P2P) Messaging using Node.js and Socket.IO

## Authors
Qianyun Zhu, Lei Wang, Bo Rao

## Install
make sure your machine has Node.js and mongodb installed
1. git clone https://github.com/chanyoonzhu/secure-chat.git
2. cd secure-chat
3. npm install
5. mongod
6. mongo < models/db.js

## Run
1. mongod (if database server is not up yet)
2. npm install
7. npm run start
8. http://localhost:3000 in your browser
9. usernames and passwords:

| username | password      |
|----------|---------------|
| Alice    | Security1sF*n |
| Bob      | Security1sF*n |

## Todo
* crypto [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html)
    * log in using passphrase (done)
    * generate key using passphrase (done)
    * padding strategy (done)
    * message encryption with 56-bit key (done)
    * display both cipher and plaintext (done)
    * bonus: periodically update the key (done)
* image messaging [serve image] (done)(https://stackoverflow.com/questions/26331787/socket-io-node-js-simple-example-to-send-image-files-from-server-to-client)
* file messaging [serve file] (done)(https://medium.com/@Mewsse/file-upload-with-socket-io-9d2d1229494)

## References
* [Salt Hash passwords using NodeJS crypto](https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/)
* [Node.js Authentication with Passport](https://blog.cloudboost.io/node-js-authentication-with-passport-4a125f264cd4)
* [Local Authentication with Passport and Mongo](https://github.com/sitepoint-editors/LocalPassportAuth)
* [Local Authentication Using Passport in Node.js](https://www.sitepoint.com/local-authentication-using-passport-node-js/)
* [Client side encryption with Crypto-js - cdn](https://cdnjs.com/libraries/crypto-js)
* [CryptoJS example](https://codepen.io/gabrielizalo/pen/oLzaqx)
* [Reading files in JavaScript using the File APIs](https://www.html5rocks.com/en/tutorials/file/dndfiles/)
* [flaticon](https://www.flaticon.com/)

## Features
* client-to-client message encryption
* file/image encryption
* periodically update the key