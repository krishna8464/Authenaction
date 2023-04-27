const jwt = require("jsonwebtoken");
require("dotenv").config();


async function authenticate(req,res,next){
    req.body.userid = "demo";
    try {
        const tocken = req.headers.authorization;
        if(tocken){
            const decoded = jwt.verify(tocken,process.env.KEY);
            if(decoded){
                const userid = decoded.userid;
                req.body.userid=userid;
                next();

            }else{
                res.send({"msg":"Access Denied"})
            }

        }else{
            res.send({"msg":"Access Denied"});
        }
    } catch (error) {
        res.send({"msg":"Login to access detials"})
    }
}

module.exports={
    authenticate
}