import { print, OutputType } from "../helpers/print.js"

export default class Exception extends Error { 
  static WRONG_DB_USERNAME_PASSWORD = "Wrong database's username and password";
  static WRONG_CONNECTION_STRING = "Wrong server name/connection string";
  static CANNOT_CONNECT_MONGOOSEDB = "Cannot connect MongooseDB";
  static USER_EXIST = "User already exists";
  static EMAIL_EXIST = "Email already exists";
  static CANNOT_REGISTER_USER = "Cannot register user";
  static WRONG_EMAIL_OR_PASSWORD = "Wrong email or password";
  static CANNOT_GET_USER = "Cannot get user";
  static CANNOT_GET_PROJECT = "Cannot get project";
  static FULLNAME_LEAST_LETTERS = "Fullname must be at least 3 letters long";
  static ENTER_EMAIL = "Enter email";
  static EMAIL_INVALID = "Email is invalid";
  static PASSWORD_INVALID = "Password should br 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters"

  constructor(message, validationErrors = {}) {
    super(message);
    print(message, OutputType.ERROR); 
    this.validationErrors = validationErrors
  }
}