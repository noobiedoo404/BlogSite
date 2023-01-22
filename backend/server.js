const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser')
const router = require('./Routes/api');


// var corsOptions = {
//     origin: "http://localhost:8081"
// };
app.use(cors());
// parse requests of content-type - application/json

// app.use(bodyParser.json({ limit: "50mb" }));
// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

// app.use(upload.array());
// app.use(express.static('public'));

/* Permission for CORS policy */
app.all("/*", function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

// app.use(express.json({ limit: '25mb' }));
// app.use(express.urlencoded({ limit: '25mb' }));
// parse requests of content-type - application/x-www-form-urlencoded
// app.use(express.urlencoded({ extended: true }));

//when the url localhost:8080/ is entered, the get request below is executed.
app.get('/', (req, res) => {
    res.send('hello from server :)');
})

//when the url localhost:8080/api is entered, the server knows it has to use api
app.use('/api', router);
app.use('/profileImages', express.static('uploads/profileImages'));
app.use('/blogImages', express.static('uploads/blogImages'));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});