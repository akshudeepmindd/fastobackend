const User = require("../model/User.model");
const Ride = require("../model/Ride.model");
const jwtToken = require("../helpers/jwt");
const responseHandler = require("../helpers/responseHandler");

exports.GetUserRide = async (req, res, next) => {
  try {
    const { rideId } = req.query;
    const token = req.headers["authorization"];
    const decoded = await jwtToken
      .decryptToken(token)
      .then((result) => result.user)
      .catch((error) => error);
    const rides = await Ride.findOne({ ByUserID: decoded._id, _id: rideId });
    if (!rides) {
      responseHandler.failure(res, "no ride is avalable.", 400);
    }
    responseHandler.data(res, rides, 200);
  } catch (error) {
    next(error);
  }
};

exports.GetUserRideList = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await jwtToken
      .decryptToken(token)
      .then((result) => result.user)
      .catch((error) => error);
    const rides = await Ride.find({ ByUserID: decoded._id });
    if (!rides) {
      responseHandler.failure(res, "no ride is avalable.", 400);
    }
    responseHandler.data(res, rides, 200);
  } catch (error) {
    next(error);
  }
};

exports.GetRideList = async (req, res, next) => {
  try {
    const rides = await Ride.find();
    if (!rides) {
      responseHandler.failure(res, "no ride is avalable.", 400);
    }
    responseHandler.data(res, rides, 200);
  } catch (error) {
    next(error);
  }
};
//Create Ride
exports.CreateRide = async (req, res, next) => {
  console.log(req.body);
  try {
    const { pickUpLocation, dropLocation, Kms } = req.body;

    const token = req.headers["authorization"];
    console.log(token,"token");
    const decoded = await jwtToken
      .decryptToken(token)
      .then((result) => result.user)
      .catch((error) => error);
     console.log(decoded._id);
     console.log(req.body)
    const ride = await new Ride({
      ByUserID:decoded._id,
            pickUpLocation:req.body.pickUpLocation,
      dropLocation:req.body.dropLocation,
      Kms:req.body.kms,
      goodType:req.body.goodType,
      pickupName:req.body.pickupName,
      pickupNumber:req.body.pickupNumber,
      receivrNumber:req.body.receivrNumber,
      // vehicalSelected:req.body.vehicalSelected,
      paymentType:req.body.paymentType,
      orderStatus:req.body.orderStatus,
      createdAt:req.body.createdAt,
      couponApplied:req.body.couponApplied,
      AcceptedByDriverId:req.body.AcceptedByDriverId,
      PickedUpAt:req.body.PickedUpAt,
      RecivedAt:req.body.RecivedAt,
      rating:req.body.rating,
comment:req.body.comment,
suggestion:req.body.suggestion,
status:req.body.status,
StartOpt:req.body.StartOpt,
CompleteOtp:req.body.CompleteOtp,
message:req.body.message

    }).save();
    console.log(decoded._id,"userRide");
    const saverideintouser = await User.findByIdAndUpdate(decoded._id, {
      $push: { rideHistory: ride._id },
    });
    responseHandler.data(res, saverideintouser, 200);
  } catch (error) {
    next(error);
  }
};

//Delete Ride
exports.DeleteRide = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = await jwtToken
      .decryptToken(token)
      .then((result) => result.user)
      .catch((error) => error);
    const deleteride = await Ride.findByIdAndDelete({
      _id: req.body.rideid,
    });
    //   res.send(deleteride)
    const deleterideidfromuser = await User.findByIdAndUpdate(decoded._id, {
      $pull: { rideHistory: deleteride._id },
    });
    responseHandler.data(res, deleterideidfromuser, 200);
  } catch (err) {
    next(err);
  }
};
exports.UpdateDriver=async(req,res,next)=>{
  console.log(req.body.id,req.body);
  try {
    await Ride.updateOne({ _id: req.body._id }, { ...req.body });
  responseHandler.data(res, "Driver Updated SuccessFully", 200);
  } catch (e) {
    next(e);
  }

};
