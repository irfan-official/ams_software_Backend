import dotenv from "dotenv";
dotenv.config();
import express, { urlencoded } from "express";
import dbConnection from "./connection/mongodb.connection.js";
import authRoute from "./routes/authentication.routes.js";
import { Internal, External } from "./utils/ErrorTypesCode.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import groupRoute from "./routes/group.routes.js";
import titleSeeds from "./seeds/title.js";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const port = Number(process.env.PORT) || 4000;

dbConnection();

app.listen(port, () => {
  // titleSeeds("Test for 17 id", "0812110205101017");
  // titleSeeds("Test for 27 id", "0812110205101027");
  console.log(`App started at http://localhost:${process.env.PORT || 4000}`);
});

app.use("/auth/api/v1", authRoute);
app.use("/group/api/v1", groupRoute);

app.use((error, req, res, next) => {
  console.log("Error ==> ", error.message);

  if ((error.ErrorTypes = Internal)) {
    return res.status(error.statusCode || 400).json({
      redirect: false,
      success: false,
      message: error.message,
    });
  } else {
    return res.status(error.statusCode || 500).json({
      redirect: true,
      success: false,
      message: error.message,
    });
  }
});
