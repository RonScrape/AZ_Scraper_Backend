const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
class AuthMiddlewares {
  async checkAuthorized(req, res, next) {
    const access_token = req.cookies?.access_token;
    const refresh_token = req.cookies?.refresh_token;
    try {
      if (!access_token && !refresh_token) {
        return res.status(404).json({
          success: false,
          message: "Not Authorized",
        });
      }
      try {
        const access_token_valid = jwt.verify(
          access_token,
          process.env.JWT_SECRET
        );
        req.userDetails = access_token_valid;
        return next();
      } catch (error) {
        if (!refresh_token) {
          return res.status(404).json({
            success: false,
            message: "No refresh token foundd", //strictly for debugging
          });
        }
      }
      const refresh_token_valid = jwt.verify(
        refresh_token,
        process.env.JWT_SECRET
      );
      const new_access_token = {
        username: refresh_token_valid.username,
        email: refresh_token_valid.email,
      };
      res.cookie("access_token", new_access_token, {
        maxAge: 1 * 60 * 1000, // 1 minute
        httpOnly: true, // for security
        secure: false, // set to true in production (HTTPS)
        sameSite: "strict", // CSRF protection
      });
      req.userDetails = refresh_token_valid;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
      });
    }
  }
  async checkIfAdmin(req, res, next) {
    const userDetails = req.userDetails;
    try {
      const user = await UserModel.findOne({ username: userDetails.username });
      if (user.role != "admin") {
        return res.status(404).json({
          success: false,
          message: "You are not an admin",
        });
      }
      return next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
      });
    }
  }
}

module.exports = new AuthMiddlewares();
