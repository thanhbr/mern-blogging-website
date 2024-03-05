import HttpStatusCode from "../exceptions/HttpStatusCode.js";
import jwt from "jsonwebtoken";


const trimStr = value => value.toLowerCase().trim();

export default function checkToken(req, res, next) {
  try {
    // bypass login, register
    if (
      trimStr(req.url) === trimStr("/users/sign-in") ||
      trimStr(req.url) === trimStr("/users/sign-up") ||
      trimStr(req.url) === trimStr("/users/google-auth") ||
      trimStr(req.url) === trimStr("/aws/get-upload-url")
    ) {
      next();
      return;
    }

    // other requests
    // get and validate token
    const authHeader = req?.headers['authorization'] || "";
    const token = authHeader && authHeader?.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if(err) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
          message: "Access token is invalid"
        });
      }
      req.user = user.id;
      next();
    });
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: error.message
    });
  }
}