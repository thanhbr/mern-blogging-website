import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { 
  userRouter,
  awsRouter,
  blogRouter
} from "./routers/index.js";
import dotenv from "dotenv";
import connect from "./database/database.js";
import checkToken from "./authentication/auth.js";
import admin from "firebase-admin";
import serviceAccount from "./firebase-adminsdk.json" assert {type: "json"};

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3000;

// ========= google authentication =========
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
// ========= end google authentication =========

// Maximum of request size
server.use(bodyParser.json({ limit: '30mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
server.use(cors());

server.use('/users', userRouter);
server.use("/aws", awsRouter);

server.use(checkToken);
server.use("/blogs", blogRouter);
// server.use('/users', userRouter);


server.listen(PORT, async () => {
  await connect();
  console.log(`Server is running on port ${PORT}`)
})