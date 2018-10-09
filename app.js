const express = require('express');
const app = express();

// set the template engine
app.set('view engine', 'ejs');

// add middlewares
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
    res.send('Hello World');
});

// listening on port 3000
server = app.listen(3000);