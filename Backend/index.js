import express from "express"

const app=express();
app.use("/",(req,res)=>{
    res.status(200).send("Good")
})

app.listen(3000,()=>{
    console.log("Server started:http://localhost:3000")
})