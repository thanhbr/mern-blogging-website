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
  static ENTER_EMAIL = "Please enter a email";
  static EMAIL_INVALID = "The email address you entered is not valid. Please try again.";
  static PASSWORD_INVALID = "Password should br 6 to 20 characters long with a numeric, 1 lowercase and 1 uppercase letters";
  static FAILED_AUTHENTICATE_GOOGLE = "Failed to authenticate you with google. Try with some other account";
  static FAILED_ACCOUNT_GOOGLE = "This email was signed up without google. Please log in with password to access the acount";
  static FAILED_DUPLICATE_ACCOUNT_GOOGLE = "Account was created using google. Try logging in google.";
  static FAILED_BLOG_TITLE = "You must provide a title to publish the blog";
  static FAILED_BLOG_DESC = "You must provide description under 200 characters";
  static FAILED_BLOG_BANNER = "You must provide blog banner to publish it";
  static FAILED_BLOG_CONTENT = "There must be some blog content to publish it";
  static FAILED_BLOG_TAG = "Provide tags in order to publish the blog, maximum 10";
  static FAILED_BLOG_CREATE = "Failed to update total posts number";
  static GET_FAILED_BLOG = "Get failed to blogs";
  static GET_FAILED_IMAGE = "Get failed to image";

  constructor(message, validationErrors = {}) {
    super(message);
    print(message, OutputType.ERROR); 
    this.validationErrors = validationErrors
  }
}