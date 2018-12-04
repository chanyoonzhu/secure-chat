const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserDetails = require("./models/model");
const crypto = require('crypto');
const fileUpload = require('express-fileupload');
var auth = require('./authentication');

// set the template engine
app.set('view engine', 'ejs');

// add middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// initial salt
let initialSalt = String.fromCharCode.apply(null, crypto.randomBytes(10));
console.log(initialSalt);
// salt
let randomSalt;
// initial dhPrime
var temp = crypto.createDiffieHellman(56*8);
let dhPrime = temp.getPrime('ascii');
// routes
app.get('/', (req, res) => {
    res.render('login', {"salt": initialSalt, "dhPrime" : dhPrime});
});

// listening on port 3000
server = app.listen(3000);

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("Welcome "+ req.query.username + "!!"));
app.get('/error', (req, res) => res.render('login',{"salt": initialSalt, "dhPrime" : dhPrime}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user) {
    cb(err, user);
  });
});

/* PASSPORT LOCAL AUTHENTICATION */

const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        UserDetails.findOne({
            username: username 
        }, function(err, user) {
            if (err) {
            return done(err);
            }

            if (!user) {
            return done(null, false);
            }

            if (auth.saltHashPassword(password, user.salt) != user.password) {
            return done(null, false);
            }
            return done(null, user);
        });
    }
));

app.post('/', 
    passport.authenticate('local', { failureRedirect: '/error' }),
    function(req, res) {
        res.render('index', {
            "username":req.user.username,
        });
});

//socket.io instantiation
const io = require("socket.io")(server);

// listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : data.username});
    });

    //listen on upload
    socket.on('upload', (data) => {
    	io.sockets.emit('upload', {
            username: data.username,
            name: data.name, 
            type: data.type, 
            size: data.size, 
            data: data.data,
        });
    });

    //listen on dhKey-send
    socket.on('dhKey-send', (data) => {
        io.sockets.emit('dhKey-receive', {username : data.username, dhKey : data.dhKey});
        //console.log("Key received: " + data.username + ": " + data.dhKey);
    });       
});

// change salt on 10 second interval
setInterval(function(){
    randomSalt = String.fromCharCode.apply(null, crypto.randomBytes(10));
    io.sockets.emit('salt_change', {salt: randomSalt});
    console.log(randomSalt);
},10000);   

// Send key-exchange Request on 10 second interval
setInterval(function(){
    io.sockets.emit('key-exchange');
    console.log("key-exchange");
},10000);  