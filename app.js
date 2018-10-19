const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const UserDetails = require("./model");
var auth = require('./authentication');

// set the template engine
app.set('view engine', 'ejs');

// add middlewares
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.get('/', (req, res) => {
    res.render('login');
});

// listening on port 3000
server = app.listen(3000);

/*  PASSPORT SETUP  */

const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => res.send("Welcome "+ req.query.username + "!!"));
app.get('/error', (req, res) => res.send("error logging in"));

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
        res.render('index');
});

//socket.io instantiation
const io = require("socket.io")(server);

// listen on every connection
io.on('connection', (socket) => {
    console.log('New user connected');

    //default username
	socket.username = "Anonymous";

    //listen on change_username
    socket.on('change_username', (data) => {
        socket.username = data.username
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit('new_message', {message : data.message, username : socket.username});
    });

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username});
    });
});

// cryto
const crypto = require('crypto');

function hashPassword(password, salt) {
    var hash = crypto.createHash('sha256');
    hash.update(password);
    hash.update(salt);
    return hash.digest('hex');
}

