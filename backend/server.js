const  express  =  require("express");
const { Pool } = require('pg');

const bodyParser = require("body-parser");
const passportConfig = require("./lib/passportConfig");
const app =express()
const cors = require("cors");
const fs = require("fs");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "jobportal",
    password: "harshil",
    port: 5432,
  });


// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}


const port = 5000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

app.listen(port, () => {
  console.log(`Server started on port ${port}!`);
});




app.get("/", (req, res) => {

res.status(200).send("Engine Started, Ready to take off!");

})
