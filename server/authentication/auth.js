import HttpStatusCode from "../exceptions/HttpStatusCode.js"
import jwt from "jsonwebtoken"


const trimStr = value => value.toLowerCase().trim()

export default function checkToken(req, res, next) {
  // bypass login, register
  if(trimStr(req.url) === trimStr('/users/login')
      || trimStr(req.url) === trimStr('/users/register')
  ) {
    next()
    return
  }

  // other requests
  // get and validate token
  const token = req.headers?.authorization?.split(" ")[1];
  const sss = 333;
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: error.message
    })
  }
}