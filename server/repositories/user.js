import { UserModal } from "../Schema/index.js";
import Exception from "../exceptions/Exception.js";
import { emailRegex, passwordRegex } from "../helpers/regex.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";

const generateUsername = async (email) => {
  let username = email.split("@")[0]
  const usernameExists = await UserModal.exists({"personal_info.username": username}).then((result) => result);

  usernameExists ? username += nanoid().substring(0, 5) : "";
  return username;
}

const formatDatatoSendRegister = (user) => {
  // Create JWT
  const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2 days' });

  return {
    access_token,
    profile_img: user?.personal_info?.profile_img || "",
    username: user?.personal_info?.username || "",
    fullname: user?.personal_info?.fullname || ""
  }
}

const register = async ({
  fullname, 
  email, 
  password
}) => {
  // ======== validating the data from frontend ========
  const existingUser = await UserModal.exists({"personal_info.email": email}).exec();
  if(!!existingUser) {
    throw new Exception(Exception.EMAIL_EXIST);
  }
  if(fullname.length < 3) {
    throw new Exception(Exception.FULLNAME_LEAST_LETTERS);
  }
  if(!email) {
    throw new Exception(Exception.ENTER_EMAIL);
  }
  if(!emailRegex.test(email)) {
    throw new Exception(Exception.EMAIL_INVALID);
  }
  if(!passwordRegex.test(password)) {
    throw new Exception(Exception.PASSWORD_INVALID);
  }
  // ======== end validate the data from frontend ========
  
  const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SECRET_PHRASE));
  const username = await generateUsername(email) || '';

  const newUser = await UserModal.create({
    personal_info: {
      fullname,
      email,
      password: hashedPassword,
      username
    }
  });
  
  const response = formatDatatoSendRegister(newUser._doc);
  return response;
}

const login = async ({email, password}) => {
  let existingUser = await UserModal.findOne({"personal_info.email": email}).exec();
  
  if(existingUser) {
    // encrypt password, use bcrypt
    const isMatched = await bcrypt.compare(password, existingUser.personal_info.password);
    if(!!isMatched) {
      const response = formatDatatoSendRegister(existingUser);
      return response;
    } else {
      throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
    }
  } else {
    throw new Exception(Exception.WRONG_EMAIL_OR_PASSWORD);
  }
}

export default {
  register,
  login
}