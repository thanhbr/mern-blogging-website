import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { awsRepository } from "../repositories/index.js";

const getUploadURL = async (req, res) => {
  try {
    const imageAWS = await awsRepository.getUploadURL({req, res});
    console.log('imageAWS', imageAWS);
    if (!imageAWS) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Error getting upload URL"
      })
    }
    res.status(HttpStatusCode.OKE).json({
      status: true,
      message: 'Get image successfully',
      data: imageAWS || ""
    });
  } catch (error) {
    console.log('error', error);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    })
  }
}

export default {
  getUploadURL
}