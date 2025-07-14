const express = require("express")
const cors = require("cors")
const cookie_parser = require("cookie-parser")
require("dotenv").config()
const connect_database = require("./Database/Db_connect")
const AuthRoutes = require("./Routes/AuthRoutes")
const PageRoutes = require("./Routes/PageRoutes")

class Server{
  constructor(){
    this.app = express()
    this.initialize_middlewares()
    connect_database(process.env.MONGO_URI)
    this.initialize_routes()
  }
  initialize_middlewares(){
    console.log("Middleware is running") // for debugging
    this.app.use(cookie_parser(process.env.COOKIE_SECRET))
    this.app.use(express.json())
    this.app.use(cors())
  }
  initialize_routes(){
    this.app.use("/api/auth",AuthRoutes)
    this.app.use("/api/pages",PageRoutes)
  }
  start_server(){
    this.app.listen(process.env.PORT,()=>{
      console.log(`Server is running on port ${process.env.PORT}`)
      })
  }
}
const prod_server_v1 = new Server()
prod_server_v1.start_server()