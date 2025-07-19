const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const jwt_creator = require("../Helpers/TokenCreator");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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

  async googleConsentScreen_v1(req, res) {
    const GOOGLE_OSAUTH_URL = process.env.GOOGLE_OAUTH_URL;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

    const GOOGLE_OAUTH_SCOPES = [
      process.env.GOOGLE_USERINFO_EMAIL,
      process.env.GOOGLE_USERINFO_PROFILE,
    ];
    const state = "some_state";
    const scopes = encodeURIComponent(GOOGLE_OAUTH_SCOPES.join(" "));
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OSAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      process.env.GOOGLE_CALLBACK_URL
    )}&access_type=offline&response_type=code&state=${state}&scope=${scopes}&prompt=consent`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
  }
  // async googleCallback(req, res) {
  //   const {code} = req.query;
  //   console.log(code)
  //   const data = {
  //   code,

  //   client_id: process.env.GOOGLE_CLIENT_ID,

  //   client_secret: process.env.GOOGLE_CLIENT_SECRET,

  //   redirect_uri: process.env.GOOGLE_CALLBACK_URL,

  //   grant_type: "authorization_code",
  // };
  // const response = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL, {
  //   method: "POST",
  //    headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //   body: JSON.stringify(data),
  // });
  // const access_token_data = await response.json();
  // console.log(access_token_data);
  //   res.send("Google OAuth Callback Url!",access_token_data);
  // }
  async googleCallback_v1(req, res) {
    const { code } = req.query;
    if (!code)
      return res.status(400).json({ error: "Missing authorization code" });

    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.GOOGLE_CALLBACK_URL;
    const token_url = process.env.GOOGLE_ACCESS_TOKEN_URL;

    console.log("OAuth data:", {
      code,
      client_id,
      client_secret,
      redirect_uri,
    });

    const params = new URLSearchParams({
      code,
      client_id,
      client_secret,
      redirect_uri,
      grant_type: "authorization_code",
    });

    try {
      const response = await fetch(token_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      });

      const access_token_data = await response.json();
      console.log("Access token response:", access_token_data);

      if (access_token_data.error) {
        return res
          .status(400)
          .json({ success: false, error: access_token_data });
      }

      return res.status(200).json({
        success: true,
        token_data: access_token_data,
      });
    } catch (error) {
      console.error("Token exchange error:", error);
      return res
        .status(500)
        .json({ success: false, error: "OAuth token exchange failed" });
    }
  }
  async googleConsentScreen_v2(req, res) {
    const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const scopes = [
      process.env.GOOGLE_USERINFO_EMAIL,
      process.env.GOOGLE_USERINFO_PROFILE,
    ]
    const state = "some_state";
    const encoded_scopes = encodeURIComponent(scopes.join(" "));
    const google_consent_screen_url = `${GOOGLE_OAUTH_URL}?scope=${encoded_scopes}&response_type=code&state=${state}&redirect_uri=${encodeURIComponent(process.env.GOOGLE_CALLBACK_URL)}&client_id=${GOOGLE_CLIENT_ID}`;
    res.redirect(google_consent_screen_url);
  }
  async google_callback_v2(req, res) {
    const{code} = req.query

    console.log("Access Token:", code);
    return res.status(200).json({
      success: true,
      message: "Google OAuth Callback successful",
      access_token: code
    });
  }
}

module.exports = new AuthControllers();
