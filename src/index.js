import { app } from "./app.js";
import connectDB from "./db/index.js";
import donenv from 'dotenv'


donenv.config({
    path:'./env'
})



connectDB()

app.listen(process.env.PORT || 8080, ()=>{
    console.log(`app is running on port ${process.env.PORT}`)
})








/* import express from 'express'

const app =express()

;(async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error in express")
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on port : ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR::", error)
        throw error
    }
})()  // self executed block 

*/