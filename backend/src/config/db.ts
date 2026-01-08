import mongoose from "mongoose";
import { errorLogger, logger } from "../helper/logger";
import { mongoUri } from "./secret";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(mongoUri, {
      connectTimeoutMS: 3000,
    });
    logger.info(`MongoDB Connected to database: ${connect.connection.name}`);
  } catch (error) {
    errorLogger.error(error);
    process.exit(1);
  }
};

export default connectDB;
