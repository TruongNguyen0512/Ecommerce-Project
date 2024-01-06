  
const jwt  =  require('jsonwebtoken')  
const asyncHandle =  require('express-async-handler');
const User = require('../models/userModel');

const authMiddleware  =  asyncHandle(async (req,res,next)=>{
    let token; 
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))  {
        token  = req.headers.authorization.split(" ")[1] 
        try {
            if(token){
                const decoded =  jwt.verify(token,process.env.JWT_SECRET)  
                const user = await User.findById((decoded?.id))  
                req.user = user 
                next()      
            }
        } catch (error) {
            throw  new Error("Not authorization token exprired , please login again ")
        }
    }else{
        throw new Error('There is no token attached to the header')  
    }
})

const isAdmin  = asyncHandle(async (req,res,next) =>{
    console.log(req.user)   
})

module.exports  =  {authMiddleware,isAdmin}