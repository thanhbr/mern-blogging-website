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

const register = async ({ fullname, email, password }) => {
  // Validating data from frontend
  const validations = [
    { condition: !!fullname && fullname.length >= 3, error: Exception.FULLNAME_LEAST_LETTERS },
    { condition: !!email, error: Exception.ENTER_EMAIL },
    { condition: emailRegex.test(email), error: Exception.EMAIL_INVALID },
    { condition: passwordRegex.test(password), error: Exception.PASSWORD_INVALID }
  ];

  for (const validation of validations) {
    if (!validation.condition) {
      throw new Exception(validation.error);
    }
  }

  const existingUser = await UserModal.exists({ "personal_info.email": email }).exec();
  if (existingUser) {
    throw new Exception(Exception.EMAIL_EXIST);
  }

  // All validations passed, proceed with registration
  const [hashedPassword, username] = await Promise.all([
    bcrypt.hash(password, parseInt(process.env.SECRET_PHRASE)),
    generateUsername(email)
  ]);

  const newUser = await UserModal.create({
    personal_info: {
      fullname,
      email,
      password: hashedPassword,
      username: username || ''
    }
  });

  return formatDatatoSendRegister(newUser._doc);
};

const login = async ({email, password}) => {
  const existingUser = await UserModal.findOne({ "personal_info.email": email }).exec();

  if (!existingUser) return {};

  const isMatched = await bcrypt.compare(password, existingUser?.personal_info?.password);

  if (isMatched) return formatDatatoSendRegister(existingUser);

  return {};
}

export default {
  register,
  login
}