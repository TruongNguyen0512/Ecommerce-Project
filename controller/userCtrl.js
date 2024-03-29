const User = require('../models/userModel')
const asyncHandler = require("express-async-handler");    
const { generateToken } = require("../config/jwtToken");
const validateMongoDbId = require('../utils/validateMongodbid');
const { generateRefreshToken } = require('../config/refreshToken');
const jwt  =  require('jsonwebtoken')

const createUser = asyncHandler(async (req, res) => {
    /**
     * TODO:Get the email from req.body
     */
    const email = req.body.email;  
    /**
     * TODO:With the help of email find the user exists or not
     */
    const findUser = await User.findOne({ email: email });
  
    if (!findUser) {
      /**
       * TODO:if user not found user create a new user
       */
      const newUser = await User.create(req.body);
      res.json(newUser);
    } else {
      /**
       * TODO:if user found then thow an error: User already exists
       */
      throw new Error("User Already Exists");
    }
  });

const loginUser = asyncHandler(async (req,res) =>{
  const {email,password}  = req.body     
  //  check it user emty or not   

  const findUser = await User.findOne({email}) 
   
  if(findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken  =  await generateRefreshToken(findUser?._id)
    const updateuser =  await User.findByIdAndUpdate(findUser.id,{
      refreshToken : refreshToken ,

    },{
      new :true  
    })
    res.cookie('refreshToken',refreshToken,{
      httpOnly : true  ,  
      maxAge :  72*60*60*1000 ,
    })
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    }); 

  }else {
    throw new Error("invalid Credentials")   
  }
          
})

// logout functionally  
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) {
      throw new Error("No refresh token in cookies");
  }

  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });

  if (!user) {
      res.clearCookie("refreshToken", {
          httpOnly: true,
          secure: true,
      });
      return res.status(204).send(); // Send an empty response with status 204
  }

  await User.findOneAndUpdate({ refreshToken }, { $unset: { refreshToken: "" } });
  res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
  });
  return res.sendStatus(204); // Send status 204 for successful operation
});


// get all user  

const getallUser  =  asyncHandler(async  (req,res) => {

  try {
    const getUsers  =   await User.find()   
    res.json(getUsers)  
  } catch (error) {
      throw new Error(error)    
  }
} )

// get a single user  

const getaUser  =  asyncHandler(async (req,res) =>{
  const {id } =  req.params  
  try {
      const getaUser = await User.findById(id)
      res.json(getaUser) 
  } catch (error) {
       throw new Error(error)
  }  
})  

// handle refresh token 
 
const handleRefreshToken  =  asyncHandler(async (req,res) =>{
     const cookie  =  req.cookies 
     console.log(cookie) 
     if(!cookie?.refreshToken) throw new Error("No refresh token in cookies")  
     const refreshToken  = cookie.refreshToken 
    console.log(refreshToken)  
    const user = await User.findOne({refreshToken})  
    if( !user) throw  new Error("No refresh token present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
})

// updatra a user   

const updateaUser =  asyncHandler(async (req,res) =>{
    const {id}  = req.params ;  
    validateMongoDbId(id)  ; 
    try {
       const updateaUser  =  await User.findByIdAndUpdate(id,{
        firstname  : req?.body?.firstname , 
        lastname : req?.body?.lastname , 
        email : req?.body?.email , 
        mobile : req?.body?.mobile ,
       },{
        new : true  , 
       })
      
       res.json(updateaUser)
       
    } catch (error) {
      throw new Error(error)
    }
})

// delete a user
const deleteaUser  =  asyncHandler(async (req,res) =>{
  const {id } =  req.params  
  validateMongoDbId(id)
  try {
      const deleteaUser = await User.findByIdAndDelete(id)
      res.json(deleteaUser) 
  } catch (error) {
       throw new Error(error)
  }  
})

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const blockusr = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    res.json(blockusr);
  } catch (error) {
    throw new Error(error);
  }
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id)
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    res.json({
      message: "User UnBlocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// 
module.exports  = { createUser,loginUser,getallUser ,getaUser,deleteaUser,updateaUser,blockUser,unblockUser,handleRefreshToken,logout};


