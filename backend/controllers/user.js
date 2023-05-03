const { Magic } = require('@magic-sdk/admin');
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try{
        const {fullName, walletAddress, emailId} = req.body;

        const duplicate = await User.findOne({emailId}).exec();
        if(duplicate) return res.status(409).json({
            message: "User already registered"
        });

        const result = await User.create({
            "fullName" : fullName, 
            "walletAddress": walletAddress, 
            "emailId": emailId
        });
        res.status(201).json(result);
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: err
        })
    }
}

exports.magicLogin = async (req, res) => {
    console.log('magic login')
    try {
        const m = new Magic(process.env.MAGICLINK_PUBLISHABLE_KEY);
        const mAdmin = new Magic(process.env.MAGICLINK_SECRET_KEY);

        const DIDToken = req.body.didToken;
        const userInfo = req.body.userInfo;
        console.log(DIDToken, userInfo);
        const userEmail = userInfo.email;
        const [proof, claim] = mAdmin.token.decode(DIDToken);
        console.log('proof', proof);
        console.log('claim', claim);

        const issuer = mAdmin.token.getIssuer(DIDToken);
        console.log('issuer', issuer);
        const publicAddress = mAdmin.token.getPublicAddress(DIDToken);
        console.log('publicAddress', publicAddress);

        let userObj = await User.findOne({emailId: userEmail}).exec();

        if(!userObj){
            userObj = await User.create({
                fullName: `user_${publicAddress}`,
                walletAddress: publicAddress,
                emailId: userEmail
            });
        }

        console.log("CREATED USR", userObj)
        let message = "Loged in";

        const token = jwt.sign(
            { wallet_address: publicAddress },
            process.env.JWT_SECRET
        );

        return res.status(200).json({
            user_instance: userObj,
            message: message,
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
}