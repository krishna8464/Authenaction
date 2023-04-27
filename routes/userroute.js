const express = require("express")
const {UserModel} = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();
const {authenticate} = require("../middleware/authentication")

const userRoute = express.Router();

userRoute.post("/register",async(req,res)=>{
    const { name, email, password } = req.body;
    try {
        let all_data = await UserModel.find({email});
        if(all_data.length === 0){
            bcrypt.hash(password, 5,async(err,val)=>{
                if(err){
                    res.status(201).send({"err":"login is not working"})
                }else{
                    let obj = {
                        email : email,
                        name : email,
                        password : val,
                        avatar : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSLU5_eUUGBfxfxRd4IquPiEwLbt4E_6RYMw&usqp=CAU",
                        bio : "Add your bio"
                    }
                    const user = new UserModel(obj);
                    await user.save()
                    res.send("User registered Successfully")
                }
            })
        }else{
            res.send({"msg":"User already Regester"})
        }
    } catch (error) {
        res.send({"msg":"Error in registering the user"})
        console.log(error)
    }
})

userRoute.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    
    try {
        const user = await UserModel.find({email});
        const hashed_pass = user[0].password;
        if(user.length>0){
            bcrypt.compare(password,hashed_pass,(err,result)=>{
                if(result){
                    const token = jwt.sign({userid:user[0]._id},process.env.KEY);
                    res.status(201).send({"msg":"Login Successfull","username":user[0].name,"email":user[0].email,"Access_Token":token})
                }else{
                    res.send({"msg":"Wrong Credntials"})
                }
            })
        }else{
            res.send({"msg":"User Not registered"})
        }
    } catch (error) {
        res.send({"msg":"some thing went wrong in login"})
    }
})

userRoute.use(authenticate)


userRoute.get("/getProfile",async(req,res)=>{
    let id = req.body.userid
    let user = await UserModel.findOne({_id:id});
    res.send(user)
})

userRoute.patch("/update",async(req,res)=>{
    let Id = req.body.userid
    let data = req.body
    try {
        let all_data = await UserModel.find({_id:Id});
        if(all_data.length == 0){
            res.send({"msg":`No user found with the given id : ${Id}`})
        }else{
            await UserModel.findByIdAndUpdate({_id:Id},data);
            res.status(201).send({"msg":`user id of ${Id} detials updated successfully`});
        }
    } catch (error) {
        res.status(400).send({"msg":`No user found with the given id : ${Id}`})
    }
})




module.exports={
    userRoute
}
