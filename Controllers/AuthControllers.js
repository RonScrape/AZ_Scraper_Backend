const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const jwt_creator = require("../Helpers/TokenCreator");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const axios = require("axios")
const { OAuth2Client } = require("google-auth-library");

class AuthControllers {
  async register_new_user(req, res) {
    const { username, email, password } = req.body;
    try {
      const UserExists = await UserModel.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (UserExists) {
        return res.status(404).json({
          success: false,
          message: "The user already exists",
        });
      }
      const hashed_pass = bcrypt.hashSync(password, 10);
      const new_user = await UserModel.create({
        username,
        email,
        password: hashed_pass,
      });
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        dets: new_user,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error,
      });
    }
  }
  async login_user(req, res) {
    const { email, password } = req.body;
    try {
      const UserExists = await UserModel.findOne({ email: email });
      if (!UserExists) {
        return res.status(404).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      const pass_valid = bcrypt.compareSync(password, UserExists.password);
      if (!pass_valid) {
        return res.status(404).json({
          success: false,
          message: "Invalid credentials",
        });
      }
      const payload_details = {
        username: UserExists.username,
        email: UserExists.email,
      };
      const access_token = jwt_creator(payload_details, "1m");
      const refresh_token = jwt_creator(payload_details, "2m");
      res.cookie("access_token", access_token, {
        maxAge: 1 * 60 * 1000, // 1 minute
        httpOnly: true, // for security
        secure: false, // set to true in production (HTTPS)
        sameSite: "strict", // CSRF protection
      });
      res.cookie("refresh_token", refresh_token, {
        maxAge: 2 * 60 * 1000, // 1 minute
        httpOnly: true, // for security
        secure: false, // set to true in production (HTTPS)
        sameSite: "strict", // CSRF protection
      });

      return res.status(200).json({
        success: true,
        message: "LoggedIn Successfully",
      });
    } catch (error) {}
  }

  async googleConsentScreen_v2(req, res) {
    const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const scopes = [
      process.env.GOOGLE_USERINFO_EMAIL,
      process.env.GOOGLE_USERINFO_PROFILE,
    ];
    const state = "some_state";
    const encoded_scopes = encodeURIComponent(scopes.join(" "));
    const google_consent_screen_url = `${GOOGLE_OAUTH_URL}?scope=${encoded_scopes}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(
      process.env.GOOGLE_CALLBACK_URL
    )}&client_id=${GOOGLE_CLIENT_ID}`;
    res.redirect(google_consent_screen_url);
  }
  async google_callback_v2(req, res) {
    const { code } = req.query;

    console.log("Access Token:", code);
    const url_params = {
      code,
      client_id:process.env.GOOGLE_CLIENT_ID,
      client_secret:process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:process.env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }
    const response = await axios.post(process.env.GOOGLE_ACCESS_TOKEN_URL,url_params,{
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      }
    })
    const data = await response.data
    const{id_token} = data
    // const verified_details = jwt.verify()
    console.log(id_token)
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
    idToken: id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  console.log(payload)
    return res.status(200).json({
      success: true,
      message: "Google OAuth Callback successful",
      access_token: data,
    });
  }
}

module.exports = new AuthControllers();
