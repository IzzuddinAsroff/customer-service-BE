const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors");

// create our express app
const app = express()

var corsOptions = {
    origin: "http://localhost:8081",
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
  };
  
app.use(cors(corsOptions));

// middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
// route
const routes = require('./Routes/Route.js')
app.use('/', routes)

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });

//start server
// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});