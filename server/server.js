import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { 
  userRouter
} from "./routers/index.js";
import dotenv from "dotenv";
import connect from "./database/database.js";
import checkToken from "./authentication/auth.js";
import admin from "firebase-admin";
import serviceAccount from "./firebase-adminsdk.json" assert{type: "json"};
import aws from "aws-sdk";
import { nanoid } from "nanoid";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Maximum of request size
server.use(bodyParser.json({ limit: '30mb' }));
server.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));
server.use(cors());

server.use('/users', userRouter);


// setup aws s3 bucket
const s3 = new aws.S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise("putObject", {
    Bucket: "vista-blog-s3",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg"
  });
}

// upload image url
server.get("/get-upload-url", (req, res) => {
  generateUploadURL()
    .then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
      console.log(err.message);
      return res.status(500).json({ error: err.message });
    })
})


server.use(checkToken);
// app.use('/users', userRouter);


server.listen(PORT, async () => {
  await connect();
  console.log(`Server is running on port ${PORT}`)
})