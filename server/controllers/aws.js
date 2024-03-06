import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { awsRepository } from "../repositories/index.js";

const getUploadURL = async (req, res) => {
  try {
    const imageAWS = await awsRepository.getUploadURL({req, res});
    if (!imageAWS) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: "Error getting upload URL"
      })
    }
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get image successfully',
      data: {
        uploadURL: imageAWS || ""
      }
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString() + "3232323232"
    })
  }
}

export default {
  getUploadURL
}