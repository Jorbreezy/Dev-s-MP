const envir = require('dotenv').config();
const secret = process.env.SECRET;
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
const auth = require('./routes/auth');
const marketPlace = require('./routes/marketplace');

//USE
app.use('/dist', express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Define route handlers
app.use('/auth', auth);
app.use('/marketplace', marketPlace);

//Main get request
app.get('/', (req, res) => {
    res.status(200).sendFile(path.join(__dirname, '../client/index.html'));
})

app.listen(port, () => console.log(`listening on port ${ port }`));