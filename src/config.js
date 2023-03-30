import { config } from "dotenv";
config();

export default {
  PORT: process.env.PORT || 5002,
  APPID: process.env.APPID || "",
};
