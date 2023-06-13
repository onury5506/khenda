import express from "express"
import db from "./db/db.js"
import api from './routes/api/api.js'

const app = express()

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.use("/api",api)

app.listen(3000,()=>{
    console.log("server started")
})