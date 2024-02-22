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
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Access token is invalid"
        });
      }
      req.user = user.id;
    });
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: error.message
    });
  }
}