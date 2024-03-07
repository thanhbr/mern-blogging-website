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
      console.log('error', error);
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.toString()
      })
    }
    
  } catch (err) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err: err});
  }
}

const googleAuth = async (req, res) => {
  try {

    const { access_token } = req.body;

    try {
      const user = await userRepository.googleAuth({ access_token })
      res.status(HttpStatusCode.OK).json({
        status: !!user?.access_token,
        message: !!user?.access_token ? 'Login successfully' : Exception.FAILED_ACCOUNT_GOOGLE,
        data: user
      });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        status: false,
        message: error.toString()
      })
    }
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({err: Exception.FAILED_AUTHENTICATE_GOOGLE});
  }
}

const search = async (req, res) => {
  try {
    const { query } = req.body;
    
    const users = await userRepository.searchUser({ query });
    res.status(HttpStatusCode.OK).json({
      status: true,
      message: 'Get users successfully',
      data: users
    });
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: error.toString()
    });
  }
}

export default {
  register,
  login,
  googleAuth,
  search
}