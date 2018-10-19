# secure-chat
Secure Instant Point-to-Point (P2P) Messaging using Node.js and Socket.IO

## Run
1. git clone https://github.com/chanyoonzhu/secure-chat.git
2. cd secure-chat
3. npm install
5. mongod
6. mongo < models/db.js
7. npm run start

## Todo
* crypto [https://nodejs.org/api/crypto.html](https://nodejs.org/api/crypto.html)
    * log in using passphrase (done)
    * generate key using passphrase
    * padding strategy
    * message encryption with 56-bit key
    * display both cipher and plaintext
    * bonus: periodically update the key
* image messaging [serve image](https://stackoverflow.com/questions/26331787/socket-io-node-js-simple-example-to-send-image-files-from-server-to-client)
* file messaging [serve file](https://medium.com/@Mewsse/file-upload-with-socket-io-9d2d1229494)

## References
* [Salt Hash passwords using NodeJS crypto](https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/)
* [Node.js Authentication with Passport](https://blog.cloudboost.io/node-js-authentication-with-passport-4a125f264cd4)
* [Local Authentication with Passport and Mongo](https://github.com/sitepoint-editors/LocalPassportAuth)
* [Local Authentication Using Passport in Node.js](https://www.sitepoint.com/local-authentication-using-passport-node-js/)