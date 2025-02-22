import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema=new Schema({

username:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
},

email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
},

password:{
    type:String,
    required:[true,"Password is required"]
},


},{
    
    timestamps: true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
         return next();
    }
    this.password=await bcrypt.hash(this.password,10)
    next()
})


userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User=mongoose.model("User",userSchema)

export const createToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Optionally, set an expiration time for the token
  );
};