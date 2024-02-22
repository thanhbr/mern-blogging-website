import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { awsRepository } from "../repositories/index.js";

const getUploadURL = async (req, res) => {
  try {
    const imageAWS = await awsRepository.getUploadURL({req, res});
    res.status(HttpStatusCode.OKE).json({
      status: true,
      message: 'Get image successfully',
      data: imageAWS
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    })
  }
}

export default {
  getUploadURL
}