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
    this.router.get("/googlePage", AuthController.googleConsentScreen_v2)
    this.router.get("/google/callback", AuthController.google_callback_v2)
  }
}

module.exports = new AuthRoutes().router