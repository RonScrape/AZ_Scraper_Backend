const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const UserModel = require("../Models/User")
const jwt_creator = require("../Helpers/TokenCreator")
class AuthControllers{
  async register_new_user(req,res){
    const{username,email,password} = req.body
    try {
      const UserExists = await UserModel.findOne({$or:[{username:username},{email:email}]})
      if(UserExists){
        return res.status(404).json({
          success:false,
          message:"The user already exists"
        })
      }
      const hashed_pass = bcrypt.hashSync(password,10)
      const new_user = await UserModel.create({
        username,email,password:hashed_pass
      })
      return res.status(200).json({
        success:true,
        message:"User created successfully",
        dets:new_user
      })
    } catch (error) {
      return res.status(500).json({
        success:false,
        error:error
      })
    }
  }
  async login_user(req,res){
    const{email,password} = req.body
    try {
      const UserExists = await UserModel.findOne({email:email})
      if(!UserExists){
        return res.status(404).json({
          success:false,
          message:"Invalid credentials"
        })
      }
      const pass_valid = bcrypt.compareSync(password,UserExists.password)
      if(!pass_valid){
        return res.status(404).json({
          success:false,
          message:"Invalid credentials"
        })
      }
      const payload_details = {username:UserExists.username,email:UserExists.email}
      const access_token = jwt_creator(payload_details,"1m")
      const refresh_token = jwt_creator(payload_details,"2m")
      res.cookie("access_token",access_token,{
        maxAge: 1 * 60 * 1000, // 1 minute
        httpOnly: true, // for security
        secure: false, // set to true in production (HTTPS)
        sameSite: "strict", // CSRF protection  
      })
      res.cookie("refresh_token",refresh_token,{
        maxAge: 2 * 60 * 1000, // 1 minute
        httpOnly: true, // for security
        secure: false, // set to true in production (HTTPS)
        sameSite: "strict", // CSRF protection  
      })


      return res.status(200).json({
        success:true,
        message:"LoggedIn Successfully"
      })
    } catch (error) {
      
    }
  }
}

module.exports = new AuthControllers()