const User = require("../model/User.model");
const Driver = require("../model/Driver.model");
const { sendSMS } = require("../utils/sendSms");
const otp = require("otp-generator");
const responseHandler = require("../helpers/responseHandler");
const jwtToken = require("../helpers/jwt");
const axios = require("axios");

exports.GetUser = async (req, res, next) => {
  try {
    const { Mobile } = req.body;
    const user = await User.findOne({ Mobile: Mobile });
    responseHandler.data(res, user, 200);
  } catch (err) {
    next(err);
  }
};

//Login Passenger
exports.loginUser = async (req, res, next) => {
  const { Mobile } = req.body;
  try {
    const user = await User.findOne({ Mobile });

    if (user) {
      const token = await jwtToken.createNewToken(user);
      responseHandler.token(res, token, 200);
    } else {
      const Newuser = new User({ Mobile }).save();
      const token = await jwtToken.createNewToken(Newuser);
      responseHandler.token(res, token, 200);
    }
  } catch (err) {
    next(err);
  }
};

//Login Driver
exports.loginDriver = async (req, res, next) => {
  const { Mobile } = req.body;
  try {
    const driver = await Driver.findOne({ Mobile });

    if (!driver) {
      responseHandler.failure(res, "you are not register as driver.", 400);
    }

    const token = await jwtToken.createNewToken(driver);
    responseHandler.token(res, token, 200);
  } catch (e) {
    next(e);
  }
};

//Send OTP
//OTP is sent to user
//OTP is to be stored in react native async storage
//if sent OTP == Entered OTP
//then enter the app
exports.SendOTP = async (req, res, next) => {
  const { Mobile } = req.body;
  try {
    const GeneratedOtp = otp.generate(5, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    await sendSMS(Mobile, GeneratedOtp);

    sentotp = Object.assign({
      otp: GeneratedOtp,
    });

    responseHandler.data(res, sentotp, 200);
  } catch (err) {
    next(err);
  }
};

//Create User
exports.createUser = async (req, res, next) => {
  const { Mobile } = req.body;

  try {
    const user = await User.findOne({ Mobile });

    if (user) {
      return responseHandler.failure(res, "user is already register.", 400);
    }

    const response = await new User({ Mobile }).save();
    responseHandler.data(res, response, 200);
  } catch (err) {
    next(err);
  }
};

//Create Driver
exports.createDriver = async (req, res, next) => {
  const { Mobile } = req.body;

  try {
    const driver = await Driver.findOne({ Mobile });

    if (driver) {
      return responseHandler.failure(res, "user is already register.", 400);
    }

    const response = await new Driver({ Mobile }).save();
    responseHandler.data(res, response, 200);
  } catch (err) {
    next(err);
  }
};
