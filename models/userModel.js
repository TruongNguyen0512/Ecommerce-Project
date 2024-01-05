const mongoose = require('mongoose'); // Erase if already required
const bcryptjs = require('bcryptjs')  ; 


// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,    
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,  
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },  

    role :{
        type : String ,
        default : "user" ,   
    }
});


userSchema.pre("save", async function(next){
    var salt =  bcryptjs.genSaltSync(10);
    this.password  =  await bcryptjs.hash(this.password,salt)  
})

userSchema.methods.isPasswordMatched =  async function(enteredPassword) {
    return await bcryptjs.compare(enteredPassword,this.password)
}
//Export the model
const User = mongoose.model('User', userSchema);

module.exports = User;