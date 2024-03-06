import aws from "aws-sdk";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import Exception from "../exceptions/Exception.js";

dotenv.config();

// setup aws s3 bucket
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
})

const generateUploadURL = async () => {
  try {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
      Bucket: "s3-vista-blogging",
      Key: imageName,
      Expires: 1000,
      ContentType: "image/jpeg"
    });
  } catch (error) {
    throw new Error(err.message);
  }
}


const getUploadURL = async ({ }) => {
  try {
    const uploadURL = await generateUploadURL();
    if (!uploadURL) {
      throw new Exception(Exception.GET_FAILED_IMAGE); 
    }
    return uploadURL;
  } catch (err) {
    throw new Exception(Exception.GET_FAILED_IMAGE); 
  }
}

export default {
  getUploadURL
}