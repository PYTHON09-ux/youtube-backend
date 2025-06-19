import connectDB from "./db/index.js";
import donenv from 'dotenv'


donenv.config({
    path:'./env'
})



connectDB()









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