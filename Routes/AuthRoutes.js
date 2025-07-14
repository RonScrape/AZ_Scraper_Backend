const express = require("express")
const AuthController = require("../Controllers/AuthControllers")

class AuthRoutes{
  constructor(){
    this.router = express.Router()
    this.initialize_Auth_Routes()
  }

  initialize_Auth_Routes(){
    this.router.post("/register",AuthController.register_new_user)
    this.router.post("/login",AuthController.login_user)
  }
}

module.exports = new AuthRoutes().router