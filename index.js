const express = require("express");
const {connection} = require("./config/db");
const {userRoute} = require("./routes/userroute");

require("dotenv").config();

const cors = require("cors");

let app = express();
app.use(express.json());
app.use(cors({
    origin:"*"
}))

app.get("/",async(req,res)=>{
    try {
        res.send("Welcome to the server")
    } catch (error) {
        res.send(error)
    }
})

app.use("/",userRoute);

app.listen(process.env.PORT,async()=>{
    try {
        await connection;
        console.log("Connected to DB")
        
    } catch (error) {
        console.log("Something went wrong while connecting to DB")
    }
    console.log(`The server is running at ${process.env.PORT}`)
})