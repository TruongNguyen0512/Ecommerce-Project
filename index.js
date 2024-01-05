const express = require('express');  
const dbConnet = require('./config/dbConnect');
const app = express()  
const dotenv  = require("dotenv").config()   
const authRouter = require('./routes/authRoutes')   ; 
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const PORT = process.env.PORT || 5000 ;   

dbConnet()

app.use(bodyParser.json())    ;  
app.use(bodyParser.urlencoded({extended:false}))    ;  
app.use("/api/user",authRouter) ;    


app.use(notFound) 
app.use(errorHandler)    



app.use('/',(req,res) => {
    res.send("Hello from server ")
})
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`)  
})   