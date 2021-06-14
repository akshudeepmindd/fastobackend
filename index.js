require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const connectDB = require("./settings/connectDB");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users");
const driverRouter = require("./routes/driver");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const rideRouter = require("./routes/ride");
const ticketRouter = require("./routes/ticket");
const ticketReplyRouter = require("./routes/ticketReply");
const authMiddleware = require("./middleware/auth");
const vehicalRouter = require("./routes/vehical");
const offerRouter = require("./routes/offer");
const categoryRouter = require("./routes/category");
const paymentRoute = require("./routes/payment");
const goodsRouter = require("./routes/category");
const imageRouter = require("./routes/image");
const cityRouter = require("./routes/city");
const errorHandler = require("./utils/globalErrorHandler");
const userController = require("./controllers/users");
const baseRouter=require("./routes/base");
const { PORT } = process.env ;

connectDB()
  .then(() => console.log("Connected to Mongodb..."))
  .catch((error) => console.error(error));

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cors());
//app.listen(5681);

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/drivers", driverRouter);
app.use("/verify", userController.Verification);
app.use("/rides", rideRouter);
//app.use("/ticket", authMiddleware, ticketRouter);
app.use("/ticket", ticketRouter);

app.use("/basefare",baseRouter);

app.use("/ticketReply", authMiddleware, ticketReplyRouter);
app.use("/admin", adminRouter);
app.use("/image", imageRouter);
app.use("/city", cityRouter);
app.use("/category", categoryRouter);
app.use("/vehical",  vehicalRouter);
app.use("/offer", offerRouter);

app.use("/goodsType", goodsRouter);
app.use("/payment", authMiddleware, paymentRoute);
app.use(errorHandler);
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
