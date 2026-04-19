const express = require("express")
const cors = require("cors")
require('dotenv').config();

const app = express()

app.use(cors())
app.use(express.json())

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
app.get("/test", function (req, res) {
    res.send("API is working")
})

app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList

    new Promise(async function (resolve, reject) {
        try {
            for (var i = 0; i < emailList.length; i++) {
                await transporter.sendMail(
                    {
                        from: process.env.EMAIL_FROM,
                        to: emailList[i],
                        subject: process.env.EMAIL_SUBJECT,
                        text: msg
                    }
                )
                console.log("Email send to:" + emailList[i]);
            }
            resolve("Success")
        }
        catch (error) {
            reject("Failed")
        } 
    }).then(function(){
        res.send(true)
    }).catch(function(){
        res.send(false)
    })
})

app.listen(process.env.PORT || 5000, function () {
    console.log("Server Started on port " + (process.env.PORT || 5000));
})

