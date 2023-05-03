const express = require("express");

const router = express.Router();

const {
    registerUser, magicLogin
} = require("../controllers/user");


router.post("/register", registerUser);
router.post("/magicLogin", magicLogin);

module.exports = router;
