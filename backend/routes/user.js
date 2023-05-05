const express = require("express");

const router = express.Router();

const {
    magicLoginUser, magicLoginCreator, getAllCreators, getCreatorInfo, joinMembership, setCreatorInfo
} = require("../controllers/user");

router.post("/magicLoginUser", magicLoginUser);
router.post("/magicLoginCreator", magicLoginCreator);
router.get("/getAllCreators", getAllCreators);
router.get("/getCreatorInfo", getCreatorInfo);
router.post("/setCreatorInfo", setCreatorInfo);
router.post("/joinMembership", joinMembership);

module.exports = router;
