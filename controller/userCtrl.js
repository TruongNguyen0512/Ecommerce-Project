const User = require('../models/userModel')
const asyncHandler = require("express-async-handler");    
const { generateToken } = require("../config/jwtToken");

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

// updatra a user   

const updateaUser =  asyncHandler(async (req,res) =>{
    const {id}  = req.params ;  
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
  try {
      const deleteaUser = await User.findByIdAndDelete(id)
      res.json(deleteaUser) 
  } catch (error) {
       throw new Error(error)
  }  
})

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;


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
module.exports  = { createUser,loginUser,getallUser ,getaUser,deleteaUser,updateaUser,blockUser,unblockUser};


