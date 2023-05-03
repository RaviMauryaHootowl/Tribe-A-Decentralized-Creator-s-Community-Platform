const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// import routes
const userRouter = require("./routes/user");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const allowCORS = (req, res, next) => {
    var origin = req.get("origin");
    res.header("Access-Control-Allow-Origin", origin);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
};

app.use("/user", userRouter);

app.get("/", (req, res) => {
    console.log(req);
    res.send("Hello World");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    console.log("[+] Listening on PORT: " + PORT);
});
