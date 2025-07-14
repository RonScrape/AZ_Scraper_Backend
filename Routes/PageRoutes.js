const express = require("express")
const AuthMiddlewares = require("../Middlewares/AuthMiddleware")
class PageRoutes{
  constructor(){
    this.router = express.Router()
    this.initialize_page_routes()
  }
  initialize_page_routes(){
    this.router.get("/home",AuthMiddlewares.checkAuthorized,(req,res)=>{
      return res.status(200).json({
        success:true,
        user:req.userDetails,
        message:"Welcome to home page "+req.userDetails.username
      })
    })
    this.router.get("/adminhome",AuthMiddlewares.checkAuthorized,AuthMiddlewares.checkIfAdmin,(req,res)=>{
      return res.status(200).json({
        success:true,
        user:req.userDetails,
        message:"Welcome to admin home page "+req.userDetails.username
      })
    })
  }
}

module.exports = new PageRoutes().router