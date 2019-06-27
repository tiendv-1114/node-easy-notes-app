// Create express app. Express, as you know, is a web framework that we’ll be using for building the REST APIs
const express = require("express");
const app = express();

// Body-parser is a module that parses the request
// Use body parser so we can get info from POST and/or URL parameters
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Use morgan to log requests to the console
const morgan = require("morgan");
app.use(morgan('dev'));

// Used to create, sign, and verify tokens
const jwt = require("jsonwebtoken");

const config = require("./config/ApplicationConfig");
const mongoose =  require("mongoose");

const apiRoutes = express.Router();
require("./routes/routes")(app, apiRoutes, jwt);

mongoose.Promise = global.Promise;
mongoose.connect(config.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Connected success!!!");
}).catch(err => {
    console.log("Could not connect to database");
    process.exit();
});

// Secret variable
app.set("superSecret", config.secret);

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
