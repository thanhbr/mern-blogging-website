import Exception from "../exceptions/Exception.js";
import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import { userRepository } from "../repositories/index.js";

const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    try {
      const user = await userRepository.register({ fullname, email, password })
      res.status(HttpStatusCode.INSERT_OK).json({
        status: true,
        message: 'Register users successfully',
        data: user
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.toString()
      })
    }
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err: err});
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    try {
      const user = await userRepository.login({ email, password })
      res.status(HttpStatusCode.OK).json({
        status: !!user?.username,
        message: !!user?.username ? 'Login successfully' : Exception.WRONG_EMAIL_OR_PASSWORD,
        data: user
      });
      
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.toString()
      })
    }
    
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err: err});
  }
}

export default {
  register,
  login
}