const User = require("../model/User.model");
const Ride = require("../model/Ride.model");
const TicketReply = require("../model/TicketReply.model");
const bcrypt = require("bcrypt");
const { jwtsecret } = process.env;
// const jwtSecret = require("../config/jwtSecret");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const moment = require("moment");
const jwtToken = require("../helpers/jwt");
const responseHandler = require("../helpers/responseHandler");

//Ticket Reply
exports.TicketReply = async (req, res, next) => {
  try {
    const authheader = req.get("Authorization");
    const decoded = await jwtToken.decryptToken(authheader);
    const createreplyticket = new TicketReply();
    const { replytoticketID, replyMsg, Replytime, replydate } = req.body;
    createreplyticket.ByUserID = decoded._id;
    createreplyticket.replytoticketID = replytoticketID;
    createreplyticket.replyMsg = replyMsg;
    createreplyticket.Replytime = moment().format("h:mm:ss a");
    createreplyticket.replydate = moment().format("MMM Do YY");

    const response = await createreplyticket.save();
    responseHandler.success(res, "New Ticket Created SuccessFully", 200);
  } catch (error) {
    next(error);
  }
};
