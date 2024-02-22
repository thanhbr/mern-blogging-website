import aws from "aws-sdk";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

// setup aws s3 bucket
const s3 = new aws.S3({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey:  process.env.AWS_SECRET_ACCESS_KEY,
})

const generateUploadURL = async () => {
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  return await s3.getSignedUrlPromise('putObject', {
    Bucket: "s3-vista-blogging",
    Key: imageName,
    Expires: 1000,
    ContentType: "image/jpeg"
  });
}


const getUploadURL = async ({req, res}) => {
  return await generateUploadURL()
    .then(url => res.status(200).json({ uploadURL: url }))
    .catch(err => {
      return res.status(500).json({ error: err.message });
    })
}

export default {
  getUploadURL
}