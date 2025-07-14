const mongoose = require("mongoose")

const connect_to_mongo = async(URL)=>{
  try {
    await mongoose.connect(URL)
    console.log("Database successfully connected")
    
  } catch (error) {
    console.log(error)
  }
}

module.exports = connect_to_mongo