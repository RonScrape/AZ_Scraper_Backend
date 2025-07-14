const jwt = require("jsonwebtoken")

const createToken = (details,duration) =>{
  return jwt.sign(details,process.env.JWT_SECRET,{expiresIn:duration})
}

module.exports = createToken