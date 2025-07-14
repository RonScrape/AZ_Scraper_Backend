const mongoose = require("mongoose")

class UserModel {
  constructor(){
    this.userSchema = this.create_user_schema()
    this.model = mongoose.model("User",this.userSchema)
  }

   create_user_schema(){
    return  mongoose.Schema({
      username:{
        type:String,
        required:true,
        unique:true
      },
      email:{
        type:String,
        required:true,
        unique:true
      },
      password:{
        type:String,
        required:true,
        minlength:6
      },
      role:{
        enum:["user","admin"],
        type:String,
        default:"user"
      }
    },{timestamps:true})
  }
}
module.exports = new UserModel().model